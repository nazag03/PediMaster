using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Food
    {
        public int FoodId { get; set; }
        public int RestaurantId { get; set; }
        public int CategoryId { get; set; }

        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public bool Available { get; set; } = true;

        public Restaurant Restaurant { get; set; } = null!;
        public Category Category { get; set; } = null!;
        public ICollection<MenuFood>? Menus { get; set; }
        public ICollection<DetailOrder>? DetailsOrder { get; set; }
    }
}
