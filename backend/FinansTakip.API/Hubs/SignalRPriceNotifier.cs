using FinansTakip.Application.DTOs;
using FinansTakip.Application.Interfaces;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace FinansTakip.API.Hubs
{
    // This class implements the IPriceUpdateNotifier interface to *send real-time price updates to connected clients using SignalR*.
    public class SignalRPriceNotifier : IPriceUpdateNotifier
    {
        // The SignalR hub context used to *send messages to clients connected to the MarketDataHub*
        private readonly IHubContext<MarketDataHub> _hubContext;

        public SignalRPriceNotifier(IHubContext<MarketDataHub> hubContext)
        {
            _hubContext = hubContext;
        }

        // This method sends a price update notification to all connected clients via SignalR.
        public async Task NotifyPriceUpdateAsync(PriceDto price)
        {
            await _hubContext.Clients.All.SendAsync("PriceUpdated", price);
        }
    }
}