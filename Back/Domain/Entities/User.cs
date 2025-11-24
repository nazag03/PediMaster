using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class User
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string? PasswordHash { get; set; }
        public string AuthProvider { get; set; }
        public string? ProviderId { get; set; }
        public string Role { get; set; }
        public bool activo { get; set; } = true;

        public ICollection<AdminRestaurant>? AdminRestaurants { get; set; }
        public ICollection<Order>? Orders { get; set; }
    }
    public enum UserRole
    {
        SuperAdmin,
        Admin,
        Client
    }
}
