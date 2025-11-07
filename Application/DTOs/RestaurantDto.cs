using Domain.Entities.Availables;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
 
    
        public record CreateRestaurantDto(
            string Name,
            string Address,
            string Telephone,
            string Description,
            Availability Availability);

        public record RestaurantResponseDto(string Name,
            string Address,
            string Telephone,
            string Description
            );

    
}
