using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Entities.Availables;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class RestaurantService : IRestaurantService
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserService _userRepository;

        public RestaurantService(ApplicationDbContext context, IUserService userRepository)
        {
            _context = context;
            _userRepository = userRepository;
        }

        public async Task<RestaurantResponseDto> CreateAsync(CreateRestaurantRequestDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == dto.UserId);

            if (user is null)
                throw new KeyNotFoundException("User not found");

            var restaurant = new Restaurant
            {
                CreatedForUserId = dto.UserId,
                CreatedFor = user,
                Name = dto.Name,
                Address = dto.Address,
                Telephone = dto.Telephone,
                Description = dto.Description,
                LogoUrl = dto.LogoUrl,
                Images = dto.Images,
                Tags = dto.Tags,
                MinOrder = dto.MinOrder,
                DeliveryCost = dto.DeliveryCost,
                WhatsappNumber = dto.WhatsappNumber,
                PaymentMethod = dto.PaymentMethod?
                    .Select(pm => pm.ToString())
                    .ToList()
                    ?? new List<string>(),
                Slug = dto.Slug,
                Availability = new Availability(),
                CreatedAt = DateTime.UtcNow
            };

            // Availability
            foreach (var dayDto in dto.Availability.AvailabilityOnTheDays)
            {
                var dayEntity = new AvailabilityOnTheDay
                {
                    Day = dayDto.Day,
                    Active = dayDto.Active,
                    AllDay = dayDto.AllDay,
                    AvailabilityHours = new List<AvailabilityHours>()
                };

                if (!dayDto.AllDay && dayDto.AvailabilityHours != null)
                {
                    foreach (var hourDto in dayDto.AvailabilityHours)
                    {
                        dayEntity.AvailabilityHours.Add(new AvailabilityHours
                        {
                            Init = TimeSpan.TryParse(hourDto.Init, out var init)
                                ? init
                                : throw new Exception("Invalid Init value"),
                            End = TimeSpan.TryParse(hourDto.End, out var end)
                                ? end
                                : throw new Exception("Invalid End value")
                        });
                    }
                }

                restaurant.Availability.AvailabilityOnTheDays.Add(dayEntity);
            }

            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();

            return new RestaurantResponseDto(
                restaurant.RestaurantId,
                restaurant.Name,
                restaurant.Address,
                restaurant.Telephone ?? string.Empty,
                restaurant.Description ?? string.Empty,
                restaurant.LogoUrl,
                restaurant.Images,
                restaurant.Tags,
                restaurant.DeliveryCost,
                restaurant.MinOrder,
                restaurant.Slug,
                // dueño
                restaurant.CreatedForUserId,
                user.Name ?? user.Email,
                user.Email
            );
        }

        public async Task<IEnumerable<RestaurantResponseDto>> GetAllAsync()
        {
            var restaurants = await _context.Restaurants
                .Include(r => r.CreatedFor)
                .ToListAsync();

            return restaurants.Select(restaurant =>
                new RestaurantResponseDto(
                    restaurant.RestaurantId,
                    restaurant.Name,
                    restaurant.Address,
                    restaurant.Telephone ?? string.Empty,
                    restaurant.Description ?? string.Empty,
                    restaurant.LogoUrl,
                    restaurant.Images,
                    restaurant.Tags,
                    restaurant.DeliveryCost,
                    restaurant.MinOrder,
                    restaurant.Slug,
                    // dueño
                    restaurant.CreatedForUserId,
                    restaurant.CreatedFor != null
                        ? (restaurant.CreatedFor.Name ?? restaurant.CreatedFor.Email)
                        : null,
                    restaurant.CreatedFor?.Email
                )
            );
        }

        public async Task<RestaurantResponseDto?> GetByIdAsync(int id)
        {
            var restaurant = await _context.Restaurants
                .Include(r => r.CreatedFor)
                .Include(r => r.Availability)
                .FirstOrDefaultAsync(r => r.RestaurantId == id);

            if (restaurant == null) return null;

            return new RestaurantResponseDto(
                restaurant.RestaurantId,
                restaurant.Name,
                restaurant.Address,
                restaurant.Telephone ?? string.Empty,
                restaurant.Description ?? string.Empty,
                restaurant.LogoUrl,
                restaurant.Images,
                restaurant.Tags,
                restaurant.DeliveryCost,
                restaurant.MinOrder,
                restaurant.Slug,
                // dueño
                restaurant.CreatedForUserId,
                restaurant.CreatedFor != null
                    ? (restaurant.CreatedFor.Name ?? restaurant.CreatedFor.Email)
                    : null,
                restaurant.CreatedFor?.Email
            );
        }

        public async Task<RestaurantResponseDto?> UpdateAsync(int id, UpdateRestaurantRequestDto dto)
        {
            var restaurant = await _context.Restaurants
                .Include(r => r.Availability)
                .Include(r => r.CreatedFor)
                .FirstOrDefaultAsync(r => r.RestaurantId == id);

            if (restaurant == null)
                return null;

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == dto.UserId);

            if (user is null)
                throw new KeyNotFoundException("User not found");

            restaurant.Name = dto.Name;
            restaurant.Address = dto.Address;
            restaurant.Telephone = dto.Telephone;
            restaurant.Description = dto.Description;
            restaurant.LogoUrl = dto.LogoUrl;
            restaurant.Images = dto.Images;
            restaurant.Tags = dto.Tags;
            restaurant.MinOrder = dto.MinOrder;
            restaurant.DeliveryCost = dto.DeliveryCost;
            restaurant.WhatsappNumber = dto.WhatsappNumber;
            restaurant.Slug = dto.Slug;

            // reasignar dueño
            restaurant.CreatedForUserId = dto.UserId;
            restaurant.CreatedFor = user;

            await _context.SaveChangesAsync();

            return new RestaurantResponseDto(
                restaurant.RestaurantId,
                restaurant.Name,
                restaurant.Address,
                restaurant.Telephone ?? string.Empty,
                restaurant.Description ?? string.Empty,
                restaurant.LogoUrl,
                restaurant.Images,
                restaurant.Tags,
                restaurant.DeliveryCost,
                restaurant.MinOrder,
                restaurant.Slug,
                // dueño
                restaurant.CreatedForUserId,
                user.Name ?? user.Email,
                user.Email
            );
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);
            if (restaurant == null) return false;

            _context.Restaurants.Remove(restaurant);
            await _context.SaveChangesAsync();
            return true;
        }

        public Task GetByIdAsync(object restaurantId)
        {
            throw new NotImplementedException();
        }
    }
}
