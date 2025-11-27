using Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    internal interface IDayliMenuService
    {
        Task<DayliMenuResponseDto> CreateAsync(CreateDayliMenuDto dto);
        Task<DayliMenuResponseDto?> GetByIdAsync(int id);
        Task<IEnumerable<DayliMenuResponseDto>> GetAllAsync();
        Task<DayliMenuResponseDto?> UpdateAsync(int id, UpdateDayliMenuDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
