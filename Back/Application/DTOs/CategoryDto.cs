using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public record CreateCategoryDto(string Name, int RestaurantId);
    public record UpdateCategoryDto(string Name);

    public record CategoryResponseDto(
        int CategoryId,
        string Name
    );
}

