using FinansTakip.Application.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace FinansTakip.API.Controllers
{
    public class GoogleLoginRequest
    {
        public string IdToken { get; set; } = string.Empty;
    }

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("google")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            try
            {
                var result = await _authService.LoginWithGoogleAsync(request.IdToken);

                return Ok(new
                {
                    userId = result.User.UserId,
                    email = result.User.Email,
                    name = result.User.Name,
                    isNewUser = result.IsNewUser
                });
            }
            catch (Exception ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }
    }
}