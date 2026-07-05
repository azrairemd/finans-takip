using FinansTakip.Domain.Entities;

namespace FinansTakip.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByGoogleIdAsync(string googleId);
        Task<User?> CreateAsync(User user);
    }
}
