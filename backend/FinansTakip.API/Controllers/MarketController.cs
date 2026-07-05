using FinansTakip.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FinansTakip.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MarketController : ControllerBase
    {
        private readonly IMarketDataCache _cache;
        private readonly IBinanceService _binanceService;

        public MarketController(IMarketDataCache cache, IBinanceService binanceService)
        {
            _cache = cache;
            _binanceService = binanceService;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var data = _cache.GetAll();
            return Ok(data);
        }

        [HttpGet("{symbol}")]
        public IActionResult GetBySymbol(string symbol)
        {
            var data = _cache.Get(symbol);
            if (data == null)
                return NotFound(new { message = $"{symbol} için veri bulunamadı." });

            return Ok(data);
        }

        [HttpGet("search")]
        public IActionResult Search([FromQuery] string q)
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest(new { message = "Arama terimi boş olamaz." });

            var results = _cache.GetAll()
                .Where(p => p.Symbol.Contains(q, StringComparison.OrdinalIgnoreCase))
                .ToList();

            return Ok(results);
        }
    }
}