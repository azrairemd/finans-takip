using System.ComponentModel.DataAnnotations;

namespace FinansTakip.Domain.Entities
{
    public class User
    {
        [Key]
        public Guid UserId { get; set; }
        public string GoogleId { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Name { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<WatchlistItem> WatchlistItems { get; set; } = new HashSet<WatchlistItem>();
    }
}