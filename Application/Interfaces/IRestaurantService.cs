using Application.DTOs;
using Domain.Entities;
using Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IRestaurantService
    {
        Task<RestaurantResponseDto> CreateAsync(CreateRestaurantDto dto, int UserId);
    }
}
