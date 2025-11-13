using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class DayliMenu
    {
        public int DayliMenuId { get; set; }
        public int RestaurantId { get; set; }
        public string Name { get; set; } = null!;

        public Restaurant Restaurant { get; set; } = null!;
        public ICollection<MenuFood>? Foods { get; set; }
    }
    public class MenuFood
    {
        public int MenuFoodId { get; set; }
        public int DayliMenuId { get; set; }
        public int FoodId { get; set; }

        public DayliMenu DayliMenu { get; set; } = null!;
        public Food Food { get; set; } = null!;
    }
}
