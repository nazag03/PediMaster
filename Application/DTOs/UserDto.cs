using Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs
{
    public record CreateUserDto(
     [EmailAddress, Required] string Email,
     [MinLength(6), MaxLength(50), Required] string Password,
     [MinLength(2), MaxLength(100), Required] string UserName
    
    );
    public record UserResponseDto(string UserName, string Email, DateTime CreatedAt);

    public record LoginRequestDto([EmailAddress, Required] string Email, [MinLength(6),MaxLength(50), Required] string Password);
    public record LoginUserResponseDto(string JwtToken, DateTime LoggedAt);
}
