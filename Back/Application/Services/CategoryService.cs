using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ApplicationDbContext _context;

        public CategoryService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CategoryResponseDto> CreateAsync(CreateCategoryDto dto)
        {
            var category = new Category
            {
                Name = dto.Name,
                RestaurantId = dto.RestaurantId,
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return new CategoryResponseDto(category.CategoryId, category.Name);
        }

        public async Task<CategoryResponseDto?> GetByIdAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return null;

            return new CategoryResponseDto(category.CategoryId, category.Name);
        }

        public async Task<IEnumerable<CategoryResponseDto>> GetAllAsync()
        {
            return await _context.Categories
                .Select(c => new CategoryResponseDto(c.CategoryId, c.Name))
                .ToListAsync();
        }
        public async Task<IEnumerable<CategoryResponseDto>> GetByRestaurantAsync(int restaurantId)
        {
            return await _context.Categories
                .Where(c => c.RestaurantId == restaurantId)
                .Select(c => new CategoryResponseDto(c.CategoryId, c.Name))
                .ToListAsync();
        }

        public async Task<CategoryResponseDto?> UpdateAsync(int id, UpdateCategoryDto dto)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return null;

            category.Name = dto.Name;

            await _context.SaveChangesAsync();

            return new CategoryResponseDto(category.CategoryId, category.Name);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null) return false;

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
