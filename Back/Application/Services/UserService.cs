using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly PasswordHasher<User> _passwordHasher;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<User>();
        }

        public async Task<UserResponseDto> CreateAsync(CreateUserDto dto)
        {
            var exists = await _context.Users.AnyAsync(u => u.Email == dto.Email);
            if (exists)
            {
                throw new InvalidOperationException("Email was registered");
            }

            var user = new User
            {
                Email = dto.Email,
                Name = dto.UserName,
                activo = true,
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserResponseDto(user.Name, user.Email);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> LoginAsync(string email, string password)
        {
            var user = await GetUserByEmailAsync(email);
            if (user is null) return null;

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            if (result == PasswordVerificationResult.Failed) return null;

            return user;
        }

        public async Task<UserResponseDto> GetUserAsync(int Id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(c => c.UserId == Id);
            if (user is null) return null;
            return new UserResponseDto(user.Name, user.Email);
        }

        // 🔥 AGREGADO: usado por AuthController.Google
        public async Task<User?> GetByEmailAsync(string email)
        {
            // Reutilizamos la misma lógica que GetUserByEmailAsync
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        // 🔥 AGREGADO: crear usuario cuando viene por Google
        public async Task<User> CreateGoogleUserAsync(CreateUserDto dto)
        {
            var user = new User
            {
                Email = dto.Email,
                Name = dto.UserName,
                activo = true,
                // Usuario creado por Google → no necesita contraseña para login normal
                PasswordHash = string.Empty
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }
    }
}
