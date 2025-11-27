namespace Application.DTOs
{
    public class CreateFoodDto
    {
        public int RestaurantId { get; set; }
        public int CategoryId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public bool Available { get; set; } = true;
    }

    public class UpdateFoodDto
    {
        public int CategoryId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public bool Available { get; set; } = true;
    }

    public class FoodResponseDto
    {
        public int FoodId { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public bool Available { get; set; }
        public int RestaurantId { get; set; }
        public int CategoryId { get; set; }

        public FoodResponseDto() { }

        public FoodResponseDto(int id, string name, string? desc, decimal price,
            string? img, bool available, int restaurantId, int categoryId)
        {
            FoodId = id;
            Name = name;
            Description = desc;
            Price = price;
            ImageUrl = img;
            Available = available;
            RestaurantId = restaurantId;
            CategoryId = categoryId;
        }
    }
}
