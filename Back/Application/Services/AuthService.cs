using Application.Interfaces;
using Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.JsonWebTokens;
using System.IdentityModel.Tokens.Jwt;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

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
            var roleValue = Convert.ToInt32(user.Role);
            string roleName;

            switch (roleValue)
            {
                case 0:
                    roleName = "SuperAdmin";
                    break;
                case 1:
                    roleName = "Admin";
                    break;
                case 2:
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
           issuer: _config.GetSection("Jwt:Issuer").Value,
           audience: _config.GetSection("Jwt:Audience").Value,
           claims: claims,
           expires: DateTime.UtcNow.AddMinutes(30),
           signingCredentials: creds
              );

            return new JwtSecurityTokenHandler().WriteToken(token);

        }
    }
}
