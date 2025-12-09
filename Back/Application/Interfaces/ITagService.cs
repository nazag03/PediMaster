using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOs;

namespace Application.Interfaces
{
    public interface ITagService
    {
        Task<TagResponseDto> CreateAsync(CreateTagDto dto);
        Task<IEnumerable<TagResponseDto>> GetAllAsync();
        Task<TagResponseDto?> GetByIdAsync(int id);
        Task<IEnumerable<TagResponseDto>> GetByRestaurantAsync(int restaurantId);
        Task<TagResponseDto?> UpdateAsync(int id, UpdateTagDto dto);
        Task<bool> DeleteAsync(int id);
    }
}

