using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public class CreateTagDto
    {
        [Required]
        [MinLength(2), MaxLength(50)]
        public string Name { get; set; } = null!;

        // Puede ser null si el tag es global
        public int? RestaurantId { get; set; }
    }

    public class UpdateTagDto
    {
        [Required]
        [MinLength(2), MaxLength(50)]
        public string Name { get; set; } = null!;
    }

    public class TagResponseDto
    {
        public int TagId { get; set; }
        public string Name { get; set; } = null!;
        public int? RestaurantId { get; set; }

        public TagResponseDto() { }

        public TagResponseDto(int id, string name, int? restaurantId)
        {
            TagId = id;
            Name = name;
            RestaurantId = restaurantId;
        }
    }
}
