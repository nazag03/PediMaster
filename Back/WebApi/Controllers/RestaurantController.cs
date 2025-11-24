using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("/api/v1/restaurants")]
    public class RestaurantController : ControllerBase
    {
        private readonly IRestaurantService _repository;
        private readonly IUserService _userRepository;
        private readonly ILogger<RestaurantController> _logger;

        public RestaurantController(IRestaurantService repository, ILogger<RestaurantController> logger
            , IUserService userService)
        {
            _repository = repository;
            _logger = logger;
            _userRepository = userService;
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpPost]
        public async Task<IActionResult> CreateRestaurant([FromBody] CreateRestaurantRequestDto request)
        {
         
            var userId = await _userRepository.GetUserAsync(request.UserId);
            if (userId is null) return NotFound("User not found");
            var response = await _repository.CreateAsync(request);
            _logger.LogInformation("Restaurant '{Name}' created for user {UserId}", request.Name, userId.UserName);

            return Ok(response);
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpGet]
        public async Task<IActionResult> GetAllRestaurants()
        {
            var restaurants = await _repository.GetAllAsync();
            if (!restaurants.Any())
                return NoContent();

            return Ok(restaurants);
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetRestaurantById(int id)
        {
            var restaurant = await _repository.GetByIdAsync(id);
            if (restaurant == null)
                return NotFound($"Restaurant with ID {id} not found");

            return Ok(restaurant);
        }

        [Authorize(Roles = "SuperAdmin, Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateRestaurant(int id, [FromBody] UpdateRestaurantRequestDto request)
        {

            var user = await _userRepository.GetUserAsync(request.UserId);
            if (user is null) return NotFound("User not found");

            var updatedRestaurant = await _repository.UpdateAsync(id, request);
            if (updatedRestaurant == null)
            return NotFound($"Restaurant with ID {id} not found");

            _logger.LogInformation("Restaurant {Id} updated", id);
            return Ok(updatedRestaurant);
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteRestaurant(int id)
        {
            var success = await _repository.DeleteAsync(id);
            if (!success)
                return NotFound($"Restaurant with ID {id} not found");

            _logger.LogWarning("Restaurant {Id} deleted", id);
            return NoContent();
        }
    }
}
