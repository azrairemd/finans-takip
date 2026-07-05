using FinansTakip.Application.Interfaces;
using FinansTakip.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FinansTakip.Infrastructure.Persistence.Repositories
{
	public class WatchlistRepository : IWatchlistRepository
	{
		private readonly AppDbContext _context;

		public WatchlistRepository(AppDbContext context)
		{
			_context = context;
		}

		public async Task<List<WatchlistItem>> GetByUserIdAsync(Guid userId)
		{
			return await _context.WatchlistItems
				.Where(w => w.UserId == userId)
				.ToListAsync();
		}

		public async Task<WatchlistItem> AddAsync(WatchlistItem item)
		{
			_context.WatchlistItems.Add(item);
			await _context.SaveChangesAsync();
			return item;
		}

		public async Task<bool> DeleteAsync(Guid id, Guid userId)
		{
			var item = await _context.WatchlistItems
				.FirstOrDefaultAsync(w => w.Id == id && w.UserId == userId);

			if (item == null) return false;

			_context.WatchlistItems.Remove(item);
			await _context.SaveChangesAsync();
			return true;
		}
	}
}