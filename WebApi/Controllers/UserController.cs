using Application.DTOs;
using Application.Interfaces;
using Infrastructure.Migrations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("/api/v1/users")]

    public class UserController : ControllerBase
    {
        private readonly IUserService _repository;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService repository, ILogger<UserController> logger)
        {
            _repository = repository;
            _logger = logger;
        }
        [Authorize(Roles ="SuperAdmin, Admin")]
        [HttpGet("{Id:int}")]
        public async Task<IActionResult> GetUserAsync([FromRoute] int Id)
        {
            var user = await _repository.GetUserAsync(Id);
            if (user == null) return NotFound();
            _logger.LogInformation("Get user ok");
            return Ok(user);
        }
    }    
}
