
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.Services
{
    public class SuperAdminService : ISuperAdmintService
    {
        private readonly ISuperAdminRepository _repository;

        public SuperAdminService(ISuperAdminRepository repository)
        {
            _repository = repository;
        }

        public async Task<SuperAdminDto> GetByIdAsync(int id)
        {
            var user = await _repository.GetByIdAsync(id);
            return new SuperAdminDto(user.Username);
        }

        public async Task<SuperAdminDto> CreateAsync(CreateSuperAdminDto dto)
        {
            var user = new SuperAdmin
            { Username = dto.Username, Password = dto.Password };
            var created = await _repository.AddAsync(user);
            return new SuperAdminDto(created.Username);
        }

        //public async Task UpdateAsync(int id, UpdateProductDto dto)
        //{
        //    var product = await _productRepository.GetByIdAsync(id);
        //    product.UpdateDetails(dto.Name, dto.Description, dto.Price);
        //    await _productRepository.UpdateAsync(product);
        //}

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
