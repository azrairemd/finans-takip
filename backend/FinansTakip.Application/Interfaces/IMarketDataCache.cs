using FinansTakip.Application.DTOs;

namespace FinansTakip.Application.Interfaces
{
    public interface IMarketDataCache
    {
        PriceDto? Get(string symbol);
        void Set(string symbol, PriceDto data);
        List<PriceDto> GetAll();
    }
}