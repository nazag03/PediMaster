

using Application.DTOs;

namespace Application.Interfaces
{
    public interface ISuperAdmintService
    {
        Task<SuperAdminDto> GetByIdAsync(int id);
       // Task<IEnumerable<SuperAdminDto>> GetAllAsync();
        Task<SuperAdminDto> CreateAsync(CreateSuperAdminDto dto);
        //Task UpdateAsync(int id, UpdateSuperAdminDto dto);
        Task DeleteAsync(int id);
    }
}
