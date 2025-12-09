using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/v1/tags")]
    public class TagController : ControllerBase
    {
        private readonly ITagService _service;
        private readonly IRestaurantService _restaurantService;
        private readonly ILogger<TagController> _logger;

        public TagController(ITagService service,
                             IRestaurantService restaurantService,
                             ILogger<TagController> logger)
        {
            _service = service;
            _restaurantService = restaurantService;
            _logger = logger;
        }

        // CREATE
        [HttpPost]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateTagDto dto)
        {
            var restaurant = await _restaurantService.GetByIdAsync(dto.RestaurantId);
            if (restaurant == null)
                return NotFound("Restaurant not found");

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
            var tag = await _service.GetByIdAsync(id);
            return tag == null ? NotFound() : Ok(tag);
        }

        // GET BY RESTAURANT
        [HttpGet("restaurant/{restaurantId:int}")]
        public async Task<IActionResult> GetByRestaurant(int restaurantId)
        {
            return Ok(await _service.GetByRestaurantAsync(restaurantId));
        }

        // UPDATE
        [HttpPut("{id:int}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTagDto dto)
        {
            var response = await _service.UpdateAsync(id, dto);
            return response == null ? NotFound() : Ok(response);
        }

        // DELETE
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "SuperAdmin,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}
