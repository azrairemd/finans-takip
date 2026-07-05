namespace FinansTakip.Application.DTOs
{
    public class PriceDto
    {
        public string Symbol { get; set; } = string.Empty;   
        public decimal LastPrice { get; set; }
        public decimal PriceChangePercent { get; set; }
        public decimal HighPrice24h { get; set; }
        public decimal LowPrice24h { get; set; }
        public decimal Volume24h { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}