using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Tag
    {
        public int TagId { get; set; }
        public string Name { get; set; } = null!;

        public int? RestaurantId { get; set; }     // 👈 ahora opcional
        public Restaurant? Restaurant { get; set; } // 👈 también opcional
    }
}

