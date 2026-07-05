using FinansTakip.Application.Interfaces;
using FinansTakip.Infrastructure.ExternalServices;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace FinansTakip.Infrastructure.BackgroundServices
{
    public class BinanceStreamHostedService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly BinanceSettings _settings;
        private readonly ILogger<BinanceStreamHostedService> _logger;

        public BinanceStreamHostedService(
            IServiceScopeFactory scopeFactory,
            IOptions<BinanceSettings> settings,
            ILogger<BinanceStreamHostedService> logger)
        {
            _scopeFactory = scopeFactory;
            _settings = settings.Value;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogInformation("Binance websocket bağlantısı başlatılıyor.");

                    using (var scope = _scopeFactory.CreateScope())
                    {
                        var binanceService = scope.ServiceProvider.GetRequiredService<IBinanceService>();

                        await binanceService.StartStreamingAsync(_settings.DefaultSymbols, stoppingToken);
                    }
                }
                catch (Exception ex) when (!stoppingToken.IsCancellationRequested)
                {
                    _logger.LogWarning(ex, "Binance websocket bağlantısı koptu, 5 saniye sonra tekrar denenecek.");
                    await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
                }
            }
        }
    }
}