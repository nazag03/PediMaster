using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Order
    {
        public int OrderId { get; set; }
        public int RestaurantId { get; set; }
        public int UserId { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;
        public DeliveryTipe DeliveryTipe { get; set; }
        public string? DeliveryAddress { get; set; }
        public decimal Total { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        public Restaurant Restaurant { get; set; } = null!;
        public User Client { get; set; } = null!;
        public ICollection<DetailOrder>? Details { get; set; }
    }
    public enum DeliveryTipe
    {
        Delivery,
        TakeAway
    }
    public enum OrderStatus
    {
        Pending,
        confirmed,
        InPreparation,
        sent,
        delivered,
        canceled
    }
}
