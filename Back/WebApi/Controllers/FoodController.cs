using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/v1/foods")]
    public class FoodController : ControllerBase
    {
        private readonly IFoodService _service;
        private readonly IRestaurantService _restaurantService;
        private readonly ICategoryService _categoryService;
        private readonly ILogger<FoodController> _logger;

        public FoodController(
            IFoodService service,
            IRestaurantService restaurantService,
            ICategoryService categoryService,
            ILogger<FoodController> logger)
        {
            _service = service;
            _restaurantService = restaurantService;
            _categoryService = categoryService;
            _logger = logger;
        }

        // CREATE
        [HttpPost]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateFoodDto dto)
        {
            var restaurant = await _restaurantService.GetByIdAsync(dto.RestaurantId);
            if (restaurant == null)
            {
                return NotFound("No se encontró el restaurante");
            }

            var category = await _categoryService.GetByIdAsync(dto.CategoryId);
            if (category == null)
            {
                return NotFound("No se encontró la categoría");
            }

            if (category.RestaurantId != dto.RestaurantId)
            {
                return BadRequest("La categoría no pertenece al restaurante seleccionado");
            }

            var response = await _service.CreateAsync(dto);
            return Ok(response);
        }

        // GET ALL
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var foods = await _service.GetAllAsync();
            return Ok(foods);
        }

        // GET BY ID
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var food = await _service.GetByIdAsync(id);
            if (food == null) return NotFound();
            return Ok(food);
        }

        // GET BY RESTAURANT
        [HttpGet("restaurant/{restaurantId:int}")]
        public async Task<IActionResult> GetByRestaurant(int restaurantId)
        {
            var foods = await _service.GetByRestaurantAsync(restaurantId);
            return Ok(foods);
        }

        // GET BY CATEGORY
        [HttpGet("category/{categoryId:int}")]
        public async Task<IActionResult> GetByCategory(int categoryId)
        {
            var foods = await _service.GetByCategoryAsync(categoryId);
            return Ok(foods);
        }

        // UPDATE
        [HttpPut("{id:int}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateFoodDto dto)
        {
            var category = await _categoryService.GetByIdAsync(dto.CategoryId);
            if (category == null)
            {
                return NotFound("No se encontró la categoría");
            }

            var response = await _service.UpdateAsync(id, dto);
            if (response == null) return NotFound();

            return Ok(response);
        }

        // DELETE
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
