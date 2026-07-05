using FinansTakip.Domain.Entities;

namespace FinansTakip.Application.DTOs
{
    public class AuthResult
    {
        public User User { get; set; } = null!;
        public bool IsNewUser { get; set; }
    }
}