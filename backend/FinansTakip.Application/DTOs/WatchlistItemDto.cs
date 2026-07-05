namespace FinansTakip.Application.DTOs
{
    public class WatchlistItemDto
    {
        public Guid Id { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public DateTime AddedAt { get; set; }
    }

    public class AddWatchlistItemRequest
    {
        public string Symbol { get; set; } = string.Empty;
    }
}