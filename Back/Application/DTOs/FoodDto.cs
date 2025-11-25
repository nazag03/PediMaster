using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public record CreateFoodDto(
        string Name,
        string? Description,
        decimal Price,
        string? ImageUrl,
        bool Available,
        int RestaurantId,
        int CategoryId
    );

    public record UpdateFoodDto(
        string Name,
        string? Description,
        decimal Price,
        string? ImageUrl,
        bool Available,
        int CategoryId
    );

    public record FoodResponseDto(
        int FoodId,
        string Name,
        string? Description,
        decimal Price,
        string? ImageUrl,
        bool Available,
        int RestaurantId,
        int CategoryId
    );
}

