using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class DetailOrder
    {
        public int DetailOrderId { get; set; }
        public int OrderId { get; set; }
        public int FoodId { get; set; }

        public int Quantity { get; set; }
        public decimal Subtotal { get; set; }

        public Order Orders { get; set; } = null!;
        public Food Foods { get; set; } = null!;
    }
}
