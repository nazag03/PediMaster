
namespace WebApi.Controllers
{
    internal interface ICategoryRepository
    {
        Task GetByIdAsync(int categoryId);
    }
}