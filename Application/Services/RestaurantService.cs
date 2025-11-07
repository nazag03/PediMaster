using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Services
{
    public class RestaurantService : IRestaurantService
    {
        private readonly ApplicationDbContext _context;
        
        public RestaurantService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<RestaurantResponseDto> CreateAsync(CreateRestaurantDto dto, int UserId)
        {
            var restaurant = new Restaurant
            {
                CreatedByUserId = UserId,
                Name = dto.Name,
                Address = dto.Address,
                Telephone = dto.Telephone,
                Description = dto.Description,
                Availability = dto.Availability,
            };
            _context.Restaurants.Add(restaurant);
            await _context.SaveChangesAsync();

            return new RestaurantResponseDto(restaurant.Name,
                restaurant.Address,
                restaurant.Telephone,
                restaurant.Description);

        }
    }
}
