using Application.DTOs;
using Application.Interfaces;
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
        [HttpPost]
        public async Task<ActionResult<UserResponseDto>> CreateUser(CreateUserDto request)
        {
            
            var command = await _repository.CreateAsync(request);
            return command;


        }
    
    
    }    
}
