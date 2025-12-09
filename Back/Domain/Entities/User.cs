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
        public string Name { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string? PasswordHash { get; set; }
        public string AuthProvider { get; set; } = default!;
        public string? ProviderId { get; set; }
        public string Role { get; set; } = default!;
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
