using FinansTakip.Application.DTOs;

namespace FinansTakip.Application.Interfaces
{
    public interface IBinanceService
    {
        Task<PriceDto?> GetTickerAsync(string symbol);
        Task<List<PriceDto>> GetAllTickerAsync();

        Task StartStreamingAsync(IEnumerable<string> symbols, CancellationToken cancellation); 
    }
}
