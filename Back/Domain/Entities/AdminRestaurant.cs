using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class AdminRestaurant
    {
        public int AdminRestaurantId { get; set; }
        public int UserId { get; set; }
        public int RestaurantId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public User User { get; set; } = null!;
        public Restaurant Restaurants { get; set; } = null!;
    }
}
