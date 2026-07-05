using FinansTakip.Application.DTOs;
using FinansTakip.Application.Interfaces;
using FinansTakip.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace FinansTakip.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WatchlistController : ControllerBase
    {
        private readonly IWatchlistRepository _watchlistRepository;

        public WatchlistController(IWatchlistRepository watchlistRepository)
        {
            _watchlistRepository = watchlistRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyWatchlist([FromQuery] Guid userId)
        {
            var items = await _watchlistRepository.GetByUserIdAsync(userId);

            var dto = items.Select(i => new WatchlistItemDto
            {
                Id = i.Id,
                Symbol = i.Symbol,
                AddedAt = i.AddedAt
            });

            return Ok(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromQuery] Guid userId, [FromBody] AddWatchlistItemRequest request)
        {
            var item = new WatchlistItem
            {
                UserId = userId,
                Symbol = request.Symbol.ToUpper()
            };

            var created = await _watchlistRepository.AddAsync(item);

            return Ok(new WatchlistItemDto
            {
                Id = created.Id,
                Symbol = created.Symbol,
                AddedAt = created.AddedAt
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id, [FromQuery] Guid userId)
        {
            var deleted = await _watchlistRepository.DeleteAsync(id, userId);
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}