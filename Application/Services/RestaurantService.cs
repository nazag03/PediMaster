using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs;
using Domain.Entities.Availables;

namespace Application.Services
{
    public class RestaurantService : IRestaurantService
    {
        private readonly ApplicationDbContext _context;
        
        public RestaurantService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<RestaurantResponseDto> CreateAsync(CreateRestaurantRequestDto dto, int UserId)
        {
            var restaurant = new Restaurant
            {
                CreatedByUserId = UserId,
                Name = dto.Name,
                Address = dto.Address,
                Telephone = dto.Telephone,
                Image = dto.ImagesUrl,
                Description = dto.Description,
                Availability = new Availability(),
            };

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
                            Init = hourDto.Init,
                            End = hourDto.End
                        });
                    }
                }

                restaurant.Availability.AvailabilityOnTheDays.Add(dayEntity);
            }
            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();

            return new RestaurantResponseDto(restaurant.Name,
                restaurant.Address,
                restaurant.Telephone,
                restaurant.Description);

        }
    }
}
