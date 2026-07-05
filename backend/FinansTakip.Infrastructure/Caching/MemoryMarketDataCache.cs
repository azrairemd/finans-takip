using FinansTakip.Application.DTOs;
using FinansTakip.Application.Interfaces;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace FinansTakip.Infrastructure.Caching
{
    public class MemoryMarketDataCache : IMarketDataCache
    {
        private readonly ConcurrentDictionary<string, PriceDto> _store = new();

        public PriceDto? Get(string symbol)
        {
            _store.TryGetValue(symbol.ToUpper(), out var value);
            return value;
        }

        public void Set(string symbol, PriceDto data)
        {
            _store[symbol.ToUpper()] = data;
        }

        public List<PriceDto> GetAll()
        {
            return _store.Values.ToList();
        }
    }
}