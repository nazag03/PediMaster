using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Category
    {
        public int CategoryId { get; set; }
        public string Name { get; set; } = default!;
        public int RestaurantId { get; set; }
        public Restaurant Restaurant { get; set; } = default!;
        public ICollection<Food> Foods  { get; set; } = default!;
    }
}
