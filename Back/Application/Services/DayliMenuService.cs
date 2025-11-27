using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class DayliMenuService : IDayliMenuService
    {
        private readonly ApplicationDbContext _context;

        public DayliMenuService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DayliMenuResponseDto> CreateAsync(CreateDayliMenuDto dto)
        {
            var menu = new DayliMenu
            {
                Name = dto.Name,
                RestaurantId = dto.RestaurantId,
                Foods = dto.FoodIds.Select(id => new MenuFood
                {
                    FoodId = id
                }).ToList()
            };

            _context.DaylisMenu.Add(menu);
            await _context.SaveChangesAsync();

            return new DayliMenuResponseDto(
                menu.DayliMenuId,
                menu.Name,
                menu.RestaurantId,
                dto.FoodIds
            );
        }

        public async Task<DayliMenuResponseDto?> GetByIdAsync(int id)
        {
            var menu = await _context.DaylisMenu
                .Include(m => m.Foods)
                .FirstOrDefaultAsync(m => m.DayliMenuId == id);

            if (menu == null) return null;

            return new DayliMenuResponseDto(
                menu.DayliMenuId,
                menu.Name,
                menu.RestaurantId,
                (menu.Foods ?? Enumerable.Empty<MenuFood>())
                    .Select(f => f.FoodId)
                    .ToList()
            );
        }

        public async Task<IEnumerable<DayliMenuResponseDto>> GetAllAsync()
        {
            return await _context.DaylisMenu
                .Include(m => m.Foods)
                .Select(m => new DayliMenuResponseDto(
                    m.DayliMenuId,
                    m.Name,
                    m.RestaurantId,
                    (m.Foods ?? Enumerable.Empty<MenuFood>())
                        .Select(f => f.FoodId)
                        .ToList()
                ))
                .ToListAsync();
        }

        public async Task<DayliMenuResponseDto?> UpdateAsync(int id, UpdateDayliMenuDto dto)
        {
            var menu = await _context.DaylisMenu
                .Include(m => m.Foods)
                .FirstOrDefaultAsync(m => m.DayliMenuId == id);

            if (menu == null) return null;

            menu.Name = dto.Name;
            menu.Foods ??= new List<MenuFood>();
            menu.Foods.Clear();

         menu.Foods = dto.FoodIds.Select(fid => new MenuFood
{
            FoodId = fid,
            DayliMenuId = menu.DayliMenuId
        }).ToList();

            await _context.SaveChangesAsync();

            return new DayliMenuResponseDto(
                menu.DayliMenuId,
                menu.Name,
                menu.RestaurantId,
                dto.FoodIds
            );
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var menu = await _context.DaylisMenu.FindAsync(id);
            if (menu == null) return false;

            _context.DaylisMenu.Remove(menu);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
