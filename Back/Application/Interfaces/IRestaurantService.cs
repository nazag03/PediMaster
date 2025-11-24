using Application.DTOs;
using Domain.Entities;
using Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IRestaurantService
    {
        Task<RestaurantResponseDto> CreateAsync(CreateRestaurantRequestDto dto);
        Task<IEnumerable<RestaurantResponseDto>> GetAllAsync();
        Task<RestaurantResponseDto?> GetByIdAsync(int id);
        Task<RestaurantResponseDto?> UpdateAsync(int id, UpdateRestaurantRequestDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
