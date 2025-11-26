
namespace WebApi.Controllers
{
    internal interface IRestaurantRepository
    {
        Task GetByIdAsync(int restaurantId);
    }
}