namespace Application.DTOs
{
    public record SuperAdminDto(string Username);

    public record CreateSuperAdminDto(string Username, string Password);

    public record UpdateSuperAdminDto(string Username, string Password);
}
