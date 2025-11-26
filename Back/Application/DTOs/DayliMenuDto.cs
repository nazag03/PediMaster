using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public record CreateDayliMenuDto(
        string Name,
        int RestaurantId,
        List<int> FoodIds
    );

    public record UpdateDayliMenuDto(
        string Name,
        List<int> FoodIds
    )
    {
        public int RestaurantId { get; set; }
    }

    public record DayliMenuResponseDto(
        int DayliMenuId,
        string Name,
        int RestaurantId,
        List<int> FoodIds
    );
}
