using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class FoodService : IFoodService
    {
        private readonly ApplicationDbContext _context;
        public FoodService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<FoodResponseDto> CreateAsync(CreateFoodDto dto)
        {
            // validar restaurante
            var restaurant = await _context.Restaurants.FindAsync(dto.RestaurantId);
            if (restaurant == null)
                throw new Exception("Restaurant not found.");

            // validar categoría
            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null)
                throw new Exception("Category not found.");

            if (category.RestaurantId != dto.RestaurantId)
                throw new Exception("Category does not belong to this restaurant.");

            var food = new Food
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                ImageUrl = dto.ImageUrl,
                Available = dto.Available,
                RestaurantId = dto.RestaurantId,
                CategoryId = dto.CategoryId
            };

            _context.Foods.Add(food);
            await _context.SaveChangesAsync();

            return MapToDto(food);
        }

        public async Task<FoodResponseDto?> GetByIdAsync(int id)
        {
            var food = await _context.Foods.FindAsync(id);
            return food == null ? null : MapToDto(food);
        }

        public async Task<IEnumerable<FoodResponseDto>> GetAllAsync()
        {
            return await _context.Foods
                .Select(f => MapToDto(f))
                .ToListAsync();
        }

        public async Task<IEnumerable<FoodResponseDto>> GetByRestaurantAsync(int restaurantId)
        {
            return await _context.Foods
                .Where(f => f.RestaurantId == restaurantId)
                .Select(f => MapToDto(f))
                .ToListAsync();
        }

        public async Task<IEnumerable<FoodResponseDto>> GetByCategoryAsync(int categoryId)
        {
            return await _context.Foods
                .Where(f => f.CategoryId == categoryId)
                .Select(f => MapToDto(f))
                .ToListAsync();
        }

        public async Task<FoodResponseDto?> UpdateAsync(int id, UpdateFoodDto dto)
        {
            var food = await _context.Foods.FindAsync(id);
            if (food == null) return null;

            // validar categoría
            var category = await _context.Categories.FindAsync(dto.CategoryId);
            if (category == null)
                throw new Exception("Category not found.");

            food.Name = dto.Name;
            food.Description = dto.Description;
            food.Price = dto.Price;
            food.ImageUrl = dto.ImageUrl;
            food.Available = dto.Available;
            food.CategoryId = dto.CategoryId;

            await _context.SaveChangesAsync();
            return MapToDto(food);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var food = await _context.Foods.FindAsync(id);
            if (food == null) return false;

            _context.Foods.Remove(food);
            await _context.SaveChangesAsync();
            return true;
        }

        private static FoodResponseDto MapToDto(Food food)
        {
            return new FoodResponseDto(
                food.FoodId,
                food.Name,
                food.Description,
                food.Price,
                food.ImageUrl,
                food.Available,
                food.RestaurantId,
                food.CategoryId
            );
        }
    }
}
