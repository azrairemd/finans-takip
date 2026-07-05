using FinansTakip.Application.DTOs;
using FinansTakip.Application.Interfaces;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace FinansTakip.Infrastructure.ExternalServices
{
    public class BinanceService : IBinanceService
    {
        private readonly HttpClient _httpClient;
        private readonly BinanceSettings _settings;
        private readonly IMarketDataCache _cache;
        private readonly IPriceUpdateNotifier _notifier;

        private static readonly JsonSerializerOptions _jsonOptions = new()
        {
            PropertyNameCaseInsensitive = false
        };

        public BinanceService(
            HttpClient httpClient,
            IOptions<BinanceSettings> settings,
            IMarketDataCache cache,
            IPriceUpdateNotifier notifier)
        {
            _httpClient = httpClient;
            _settings = settings.Value;
            _cache = cache;
            _notifier = notifier;

            _httpClient.BaseAddress = new Uri(_settings.RestBaseUrl);
        }


        public async Task<PriceDto?> GetTickerAsync(string symbol)
        {
            var requestUrl = $"{_httpClient.BaseAddress}api/v3/ticker/24hr?symbol={symbol.ToUpper()}";
            var response = await _httpClient.GetAsync($"/api/v3/ticker/24hr?symbol={symbol.ToUpper()}");

            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Binance hata döndü. URL: {requestUrl}, Status: {response.StatusCode}, Body: {content}");
            }

            var raw = JsonSerializer.Deserialize<BinanceRestTicker>(content);
            if (raw == null) return null;

            return MapToDto(raw.Symbol, raw.LastPrice, raw.PriceChangePercent, raw.HighPrice, raw.LowPrice, raw.Volume);
        }

        public async Task<List<PriceDto>> GetAllTickerAsync()
        {
            var response = await _httpClient.GetAsync("/api/v3/ticker/24hr");
            if (!response.IsSuccessStatusCode) return new List<PriceDto>();

            var json = await response.Content.ReadAsStringAsync();
            var rawList = JsonSerializer.Deserialize<List<BinanceRestTicker>>(json) ?? new();

            return rawList
                .Select(r => MapToDto(r.Symbol, r.LastPrice, r.PriceChangePercent, r.HighPrice, r.LowPrice, r.Volume))
                .ToList();
        }

        public async Task StartStreamingAsync(IEnumerable<string> symbols, CancellationToken cancellationToken)
        {
            var streamNames = symbols.Select(s => $"{s.ToLower()}@ticker");
            var combinedPath = $"/stream?streams={string.Join("/", streamNames)}";
            var uri = new Uri($"{_settings.WebSocketBaseUrl}{combinedPath}");

            using var socket = new ClientWebSocket();
            await socket.ConnectAsync(uri, cancellationToken);

            var buffer = new byte[8192];

            while (socket.State == WebSocketState.Open && !cancellationToken.IsCancellationRequested)
            {
                var messageBuilder = new StringBuilder();
                WebSocketReceiveResult result;

                do
                {
                    result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), cancellationToken);
                    messageBuilder.Append(Encoding.UTF8.GetString(buffer, 0, result.Count));
                }
                while (!result.EndOfMessage);

                if (result.MessageType == WebSocketMessageType.Close) break;

                await HandleMessageAsync(messageBuilder.ToString());
            }
        }

        private async Task HandleMessageAsync(string message)
        {
            try
            {
                var envelope = JsonSerializer.Deserialize<BinanceStreamEnvelope>(message, _jsonOptions);
                if (envelope?.Data == null)
                {
                    Console.WriteLine($"[WS] Data null geldi. Ham mesaj: {message}");
                    return;
                }

                var dto = MapToDto(
                    envelope.Data.Symbol,
                    envelope.Data.LastPrice,
                    envelope.Data.PriceChangePercent,
                    envelope.Data.HighPrice,
                    envelope.Data.LowPrice,
                    envelope.Data.Volume);

                Console.WriteLine($"[WS] {dto.Symbol} -> Last: {dto.LastPrice}, High: {dto.HighPrice24h}, Low: {dto.LowPrice24h}");

                _cache.Set(dto.Symbol, dto);
                await _notifier.NotifyPriceUpdateAsync(dto);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[WS] HATA: {ex.Message}, Ham mesaj: {message}");
            }
        }

        private static PriceDto MapToDto(string symbol, string lastPrice, string changePercent, string high, string low, string volume)
        {
            return new PriceDto
            {
                Symbol = symbol,
                LastPrice = ParseDecimal(lastPrice),
                PriceChangePercent = ParseDecimal(changePercent),
                HighPrice24h = ParseDecimal(high),
                LowPrice24h = ParseDecimal(low),
                Volume24h = ParseDecimal(volume),
                UpdatedAt = DateTime.UtcNow
            };
        }

        private static decimal ParseDecimal(string value)
        {
            return decimal.TryParse(value,
                System.Globalization.NumberStyles.Any,
                System.Globalization.CultureInfo.InvariantCulture,
                out var result) ? result : 0;
        }
    }
}