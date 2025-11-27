using Application.DTOs;
using Application.Interfaces;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/v1/daylimenus")]
    public class DayliMenuController : ControllerBase
    {
        private readonly DayliMenuService _service;
        private readonly IRestaurantService _restaurantService;
        private readonly IFoodService _foodService;

        public DayliMenuController(
            DayliMenuService service,
            IRestaurantService restaurantService,
            IFoodService foodService)
        {
            _service = service;
            _restaurantService = restaurantService;
            _foodService = foodService;
        }

        // CREATE
        [HttpPost]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateDayliMenuDto dto)
        {
            var restaurant = await _restaurantService.GetByIdAsync(dto.RestaurantId);
            if (restaurant == null)
            {
                return NotFound("No se encontró el restaurante");
            }

            var foodsNotFound = new List<int>();

            foreach (var foodId in dto.FoodIds)
            {
                var food = await _foodService.GetByIdAsync(foodId);
                if (food == null)
                {
                    foodsNotFound.Add(foodId);
                }
            }

            if (foodsNotFound.Any())
            {
                return NotFound($"Las siguientes comidas no existen: {string.Join(", ", foodsNotFound)}");
            }

            var response = await _service.CreateAsync(dto);
            return Ok(response);
        }

        // GET ALL
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        // GET BY ID
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound("No se encontró el menú");
            return Ok(result);
        }

        // UPDATE
        [HttpPut("{id:int}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateDayliMenuDto dto)
        {
            var restaurant = await _restaurantService.GetByIdAsync(dto.RestaurantId);
            if (restaurant == null)
            {
                return NotFound("No se encontró el restaurante");
            }

            var foodsNotFound = new List<int>();

            foreach (var foodId in dto.FoodIds)
            {
                var food = await _foodService.GetByIdAsync(foodId);
                if (food == null)
                {
                    foodsNotFound.Add(foodId);
                }
            }

            if (foodsNotFound.Any())
            {
                return NotFound($"Las siguientes comidas no existen: {string.Join(", ", foodsNotFound)}");
            }

            var updated = await _service.UpdateAsync(id, dto);

            if (updated == null)
            {
                return NotFound("No se encontró el menú a actualizar");
            }

            return Ok(updated);
        }

        // DELETE
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);

            if (!deleted)
            {
                return NotFound("No se encontró el menú a eliminar");
            }

            return NoContent();
        }
    }
}
