using FinansTakip.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FinansTakip.Infrastructure.Persistence
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

		public DbSet<User> Users => Set<User>();
		public DbSet<WatchlistItem> WatchlistItems => Set<WatchlistItem>();
		public DbSet<PriceSnapshot> PriceSnapshots => Set<PriceSnapshot>();

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<User>()
				.HasIndex(u => u.GoogleId)
				.IsUnique();

			modelBuilder.Entity<User>()
				.HasIndex(u => u.Email)
				.IsUnique();

			modelBuilder.Entity<WatchlistItem>()
				.HasOne(w => w.User)
				.WithMany(u => u.WatchlistItems)
				.HasForeignKey(w => w.UserId);

			base.OnModelCreating(modelBuilder);
		}
	}
}