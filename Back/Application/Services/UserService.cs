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

        // CREATE
        public async Task<UserResponseDto> CreateAsync(CreateUserDto dto)
        {
            var exists = await _context.Users.AnyAsync(u => u.Email == dto.Email);
            if (exists) throw new InvalidOperationException("Email already registered");

            
            var user = new User
            {
                Email = dto.Email,
                Name = dto.UserName,
                activo = true,
                AuthProvider = "local",
                Role = UserRole.Admin.ToString()
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserResponseDto(user.Name, user.Email);
        }

        // READ ALL
        public async Task<IEnumerable<UserListResponseDto>> GetAllAsync()
        {
            return await _context.Users
                .Select(u => new UserListResponseDto(
                    u.UserId,
                    u.Name,
                    u.Email,
                    u.Role.ToString(),
                    u.activo
                )).ToListAsync();
        }

        // READ BY ID
        public async Task<UserResponseDto?> GetUserAsync(int Id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == Id);
            if (user == null) return null;

            return new UserResponseDto(user.Name, user.Email);
        }

        // UPDATE
        public async Task<UserResponseDto?> UpdateAsync(int id, UpdateUserDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null) return null;

            if (dto.Name != null) user.Name = dto.Name;
            if (dto.Email != null) user.Email = dto.Email;
            if (dto.Activo != null) user.activo = dto.Activo.Value;

            await _context.SaveChangesAsync();

            return new UserResponseDto(user.Name, user.Email);
        }

        // DELETE
        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        // LOGIN
        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> LoginAsync(string email, string password)
        {
            var user = await GetUserByEmailAsync(email);
            if (user is null) return null;

            if (string.IsNullOrEmpty(user.PasswordHash))
            {
                return null;
            }

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            if (result == PasswordVerificationResult.Failed) return null;

            return user;
        }


        public async Task<User> CreateGoogleUserAsync(CreateGoogleUserDto dto)
        {
            var user = new User
            {
                Email = dto.Email,
                Name = dto.Username,
                activo = true,
                PasswordHash = null,
                ProviderId = dto.ProviderId,
                AuthProvider = "google",
                Role=UserRole.Client.ToString(),
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }
    }
}
