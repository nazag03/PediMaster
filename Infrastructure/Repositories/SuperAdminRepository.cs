
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class SuperAdminRepository : ISuperAdminRepository
    {
        private readonly ApplicationDbContext _context;

        public SuperAdminRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<SuperAdmin> GetByIdAsync(int id)
        {
            return await _context.SuperAdmin.FindAsync(id);
        }

        public async Task<IEnumerable<SuperAdmin>> GetAllAsync()
        {
            return await _context.SuperAdmin.ToListAsync();
        }

        public async Task<SuperAdmin> AddAsync(SuperAdmin product)
        {
            await _context.SuperAdmin.AddAsync(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task UpdateAsync(SuperAdmin product)
        {
            _context.SuperAdmin.Update(product);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var product = await GetByIdAsync(id);
            _context.SuperAdmin.Remove(product);
            await _context.SaveChangesAsync();
        }
    }
}
