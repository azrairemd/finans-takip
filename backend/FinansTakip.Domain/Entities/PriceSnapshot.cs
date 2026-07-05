namespace FinansTakip.Domain.Entities
{
    public class PriceSnapshot
    {
        public Guid Id { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public decimal LastPrice { get; set; }
        public decimal PriceChangePercent { get; set; }
        public decimal HighPrice24h { get; set; }
        public decimal LowPrice24h { get; set; }
        public decimal Volume24h { get; set; }
        public DateTime FetchedAt { get; set; } = DateTime.UtcNow;
    }
}