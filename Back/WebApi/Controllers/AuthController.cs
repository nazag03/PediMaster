using Application.DTOs;
using Application.Interfaces;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/v1/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _repositroy;
        private readonly ILogger<AuthController> _logger;
        private readonly IAuthService _authService;
        private readonly IConfiguration _config;

        public AuthController(
            IUserService repositroy,
            ILogger<AuthController> logger,
            IAuthService authService,
            IConfiguration config)
        {
            _repositroy = repositroy;
            _logger = logger;
            _authService = authService;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Create([FromBody] CreateUserDto request)
        {
            var response = await _repositroy.CreateAsync(request);
            if (response is null) return BadRequest();

            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            if (request is null) return BadRequest();

            var user = await _repositroy.LoginAsync(request.Email, request.Password);
            if (user is null) return Unauthorized("Login failed");
            if (user.AuthProvider != "local") throw new InvalidOperationException("User must log in with Google");

            var jwt = _authService.GenerateJwtToken(user);
            return Ok(new LoginUserResponseDto(jwt, DateTime.UtcNow));
        }

        [HttpPost("google")]
        public async Task<IActionResult> LoginWithGoogle([FromBody] GoogleLoginRequestDto request)
        {
            _logger.LogInformation("📦 Raw request: {@Request}", request);
            _logger.LogInformation("🟢 Token: {Token}", request.IdToken);

            if (string.IsNullOrWhiteSpace(request.IdToken))
                return BadRequest("IdToken is required.");

            GoogleJsonWebSignature.Payload payload;
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { _config["Google:ClientId"] }
                };

                payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, settings);
            }
            catch (InvalidJwtException ex)
            {
                _logger.LogWarning(ex, "Invalid Google token");
                return Unauthorized("Invalid Google token");
            }

            if (payload == null || string.IsNullOrEmpty(payload.Email))
                return Unauthorized("Google response without email");

            if (payload.EmailVerified != true)
                return Unauthorized("Google email is not verified");

            var user = await _repositroy.GetUserByEmailAsync(payload.Email);

            if (user is null)
            {
                var createDto = new CreateGoogleUserDto(
                    payload.Email,
                    payload.Subject,
                    payload.Name ?? payload.Email
                );

                user = await _repositroy.CreateGoogleUserAsync(createDto);
            }

            var jwt = _authService.GenerateJwtToken(user);

            return Ok(new LoginUserResponseDto(jwt, DateTime.UtcNow));
        }
    }
}
