using Application.DTOs;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface IUserService 
    {
        // Crear usuario con email/contraseña normal
        Task<UserResponseDto> CreateAsync(CreateUserDto dto);

        // Método que ya usás en LoginAsync internamente
        Task<User?> GetUserByEmailAsync(string email);

        // Login con email/contraseña
        Task<User?> LoginAsync(string email, string password);

        // 🔥 Usado por AuthController para login con Google
        Task<User?> GetByEmailAsync(string email);

        // 🔥 Usado por AuthController para crear usuario cuando viene de Google
        Task<User> CreateGoogleUserAsync(CreateUserDto request);

        // Obtener usuario por Id y devolver DTO
        Task<UserResponseDto> GetUserAsync(int Id);
    }
}
