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
        public DateTime CreatedAt { get; set; }
        public string? Description { get; set; }
        public string Address { get; set; } = null!;
        public string? City { get; set; }
        public string? Telephone { get; set; } = null!;
        public string? WhatsappNumber { get; set; }
        public List<string>? Tags { get; set; }
        public int? MinOrder { get; set; }
        public decimal DeliveryCost { get; set; }
        public string Slug {  get; set; } = default!;
        public string LogoUrl { get; set; } = default!;
        public List <string>? Images { get; set; }
        public List<string>? PaymentMethod { get; set; }
        public Availability Availability { get; set; } = default!;

        // FK
        public int CreatedForUserId { get; set; }
        public User CreatedFor { get; set; } = null!;

        // Relaciones
        public ICollection<AdminRestaurant>? AdminRestaurants { get; set; }
        public ICollection<Food>? Foods { get; set; }
        public ICollection<Category>? Categories { get; set; }
        public ICollection<DayliMenu>? DayliMenus { get; set; }
        public ICollection<Order>? Orders { get; set; }

    }
    public enum PaymentMethod
    {
        Cash = 0,
        Card = 1,
        Transfer = 2,
    }
}
