using FinansTakip.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FinansTakip.Application.Interfaces
{
    public interface IWatchlistRepository
    {
        Task<List<WatchlistItem>> GetByUserIdAsync(Guid userId);
        Task<WatchlistItem> AddAsync(WatchlistItem item);
        Task<bool> DeleteAsync(Guid id, Guid userId);
    }
}