using Domain.Entities.Availables;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Restaurant
    {
        public int RestaurantId { get; set; }
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
        public string Telephone { get; set; } = null!;
        public List <string>? Image { get; set; } 
        public string? Description { get; set; }
        public Availability Availability { get; set; }

        // FK
        public int CreatedByUserId { get; set; }
        public User CreatedBy { get; set; } = null!;

        // Relaciones
        public ICollection<AdminRestaurant>? AdminRestaurants { get; set; }
        public ICollection<Food>? Foods { get; set; }
        public ICollection<DayliMenu>? DayliMenus { get; set; }
        public ICollection<Order>? Orders { get; set; }

    }
}
