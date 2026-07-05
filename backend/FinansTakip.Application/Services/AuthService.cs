using FinansTakip.Application.DTOs;
using FinansTakip.Application.Interfaces;
using FinansTakip.Domain.Entities;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;

namespace FinansTakip.Application.Services
{
    public class AuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<AuthResult> LoginWithGoogleAsync(string googleIdToken)
        {
            var clientId = _configuration["Google:ClientId"];

            var payload = await GoogleJsonWebSignature.ValidateAsync(
                googleIdToken,
                new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { clientId }
                });

            if (payload == null)
            {
                throw new Exception("Geçersiz Google ID Token");
            }

            var existingUser = await _userRepository.GetByGoogleIdAsync(payload.Subject);

            if (existingUser != null)
            {
                return new AuthResult { User = existingUser, IsNewUser = false };
            }

            var newUser = new User
            {
                GoogleId = payload.Subject,
                Email = payload.Email,
                Name = payload.Name
            };

            var createdUser = await _userRepository.CreateAsync(newUser);

            return new AuthResult { User = createdUser, IsNewUser = true };
        }
    }
}