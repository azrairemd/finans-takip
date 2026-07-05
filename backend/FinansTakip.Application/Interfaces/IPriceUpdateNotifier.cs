using FinansTakip.Application.DTOs;

namespace FinansTakip.Application.Interfaces
{
    public interface IPriceUpdateNotifier
    {
        Task NotifyPriceUpdateAsync(PriceDto price);
    }
}
