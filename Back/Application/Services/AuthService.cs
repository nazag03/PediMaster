using Application.Interfaces;
using Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System;
using System.Security.Claims;
using System.Text;

namespace Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _config;

        public AuthService(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateJwtToken(User user)
        {
            var keyString = _config["Jwt:Key"];

            if (string.IsNullOrWhiteSpace(keyString))
            {
                throw new InvalidOperationException("La clave JWT (Jwt:Key) no está configurada.");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Usamos el Role como string directamente
            var rawRole = (user.Role ?? "").Trim();
            string roleName;

            // Permitimos tanto números ("0","1","2") como nombres ("SuperAdmin","Admin","Customer")
            switch (rawRole)
            {
                case "0":
                case "SuperAdmin":
                    roleName = "SuperAdmin";
                    break;

                case "1":
                case "Admin":
                    roleName = "Admin";
                    break;

                case "2":
                case "Customer":
                case "User":
                    roleName = "Customer";
                    break;

                default:
                    roleName = "Customer";
                    break;
            }

            var claims = new[]
            {
                new Claim("userId", user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, roleName),
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
