using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Identity;
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

        public AuthController(IUserService repositroy, ILogger<AuthController> logger, IAuthService authService)
        {
            _repositroy = repositroy;
            _logger = logger;
            _authService = authService;
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
            var jwt = _authService.GenerateJwtToken(user);
            return Ok(new LoginUserResponseDto(jwt, DateTime.UtcNow));

        }
    }
}
