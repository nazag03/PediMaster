using Application.DTOs;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface IUserService
    {
        Task<UserResponseDto> CreateAsync(CreateUserDto dto);
        Task<IEnumerable<UserListResponseDto>> GetAllAsync();
        Task<UserResponseDto?> GetUserAsync(int Id);
        Task<UserResponseDto?> UpdateAsync(int id, UpdateUserDto dto);
        Task<bool> DeleteAsync(int id);

        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> LoginAsync(string email, string password);
        Task<User?> GetByEmailAsync(string email);
        Task<User> CreateGoogleUserAsync(CreateUserDto request);
    }
}
