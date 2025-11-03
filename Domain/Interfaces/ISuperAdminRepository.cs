
using Domain.Entities;

namespace Domain.Interfaces
{
    public interface ISuperAdminRepository
    {
        Task<SuperAdmin> GetByIdAsync(int id);
        Task<IEnumerable<SuperAdmin>> GetAllAsync();
        Task<SuperAdmin> AddAsync(SuperAdmin product);
        Task UpdateAsync(SuperAdmin product);
        Task DeleteAsync(int id);
    }
}
