using Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICategoryService
    {
        Task<CategoryResponseDto> CreateAsync(CreateCategoryDto dto);
        Task<CategoryResponseDto?> GetByIdAsync(int id);
        Task<IEnumerable<CategoryResponseDto>> GetAllAsync();
        Task<IEnumerable<CategoryResponseDto>> GetByRestaurantAsync(int restaurantId);
        Task<CategoryResponseDto?> UpdateAsync(int id, UpdateCategoryDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
