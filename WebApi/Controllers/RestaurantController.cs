using Application.DTOs;
using Application.Interfaces;
using Infrastructure.Migrations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("/api/v1/restaurants")]
    public class RestaurantController : ControllerBase
    {
        private readonly IRestaurantService _repository;
        private readonly ILogger<RestaurantController> _logger;
        
        public RestaurantController(IRestaurantService repository, ILogger<RestaurantController> logger)
        {
            _repository = repository;
            _logger = logger;
        }
        [Authorize(Roles = "SuperAdmin")]
        [HttpPost]
        public async Task<IActionResult> CreateRestaurant([FromBody] CreateRestaurantRequestDto request) 
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId is null) return Unauthorized();
            var response = await _repository.CreateAsync(request, int.Parse(userId));
  
            return Ok(response);
        } 

        
    }
}
