using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class TagService : ITagService
    {
        private readonly ApplicationDbContext _context;

        public TagService(ApplicationDbContext context)
        {
            _context = context;
        }

        // CREATE
        public async Task<TagResponseDto> CreateAsync(CreateTagDto dto)
        {
            var tag = new Tag
            {
                Name = dto.Name,
                RestaurantId = dto.RestaurantId  // puede ser null → tag global
            };

            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();

            return MapToDto(tag);
        }

        // GET ALL
        public async Task<IEnumerable<TagResponseDto>> GetAllAsync()
        {
            return await _context.Tags
                .Select(t => MapToDto(t))
                .ToListAsync();
        }

        // GET BY ID
        public async Task<TagResponseDto?> GetByIdAsync(int id)
        {
            var tag = await _context.Tags.FindAsync(id);
            return tag == null ? null : MapToDto(tag);
        }

        // GET BY RESTAURANT
        public async Task<IEnumerable<TagResponseDto>> GetByRestaurantAsync(int restaurantId)
        {
            return await _context.Tags
                .Where(t => t.RestaurantId == restaurantId)
                .Select(t => MapToDto(t))
                .ToListAsync();
        }

        // UPDATE
        public async Task<TagResponseDto?> UpdateAsync(int id, UpdateTagDto dto)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null) return null;

            tag.Name = dto.Name;

            await _context.SaveChangesAsync();

            return MapToDto(tag);
        }

        // DELETE
        public async Task<bool> DeleteAsync(int id)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null) return false;

            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();

            return true;
        }

        // MAPPER
        private static TagResponseDto MapToDto(Tag tag)
        {
            return new TagResponseDto(
                tag.TagId,
                tag.Name,
                tag.RestaurantId   // ahora es int?
            );
        }
    }
}
