using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IFoodService
    {
        Task<FoodResponseDto> CreateAsync(CreateFoodDto dto);
        Task<FoodResponseDto?> GetByIdAsync(int id);
        Task<IEnumerable<FoodResponseDto>> GetByRestaurantAsync(int restaurantId);
        Task<IEnumerable<FoodResponseDto>> GetByCategoryAsync(int categoryId);
        Task<IEnumerable<FoodResponseDto>> GetAllAsync();
        Task<FoodResponseDto?> UpdateAsync(int id, UpdateFoodDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
