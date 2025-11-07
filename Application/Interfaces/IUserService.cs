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
    public interface IUserService 
    {
        Task<UserResponseDto> CreateAsync(CreateUserDto dto);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> LoginAsync(string email, string password);
    }
}
