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
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateRestaurant([FromBody]CreateRestaurantDto request) 
        {
            var userId = User.FindFirst("userId")?.Value;
            if (userId is null) return Unauthorized();
            var response = await _repository.CreateAsync(request, int.Parse(userId));
            return Ok(response);
        } 

        
    }
}
