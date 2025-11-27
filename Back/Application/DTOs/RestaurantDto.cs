namespace Application.DTOs
{
    using System.ComponentModel.DataAnnotations;

    public record CreateRestaurantRequestDto(
        [Required]
    [Range(1, int.MaxValue, ErrorMessage = "UserId must be a positive integer.")]
    int UserId,

        [Required, MinLength(2), MaxLength(100)]
    [RegularExpression(@"^[\w\s\-\.\,]+$", ErrorMessage = "Name contains invalid characters.")]
    string Name,

        [Required, MinLength(5), MaxLength(255)]
    string Address,

        [Required]
    [Phone]
    [MaxLength(20)]
    string Telephone,

        [Required, MinLength(10), MaxLength(500)]
    string Description,

    string LogoUrl,

    List<string>? Images,

        List<string>? Tags,

        [Range(0, int.MaxValue)]
    int? MinOrder,

        [Range(0, 1000)]
    decimal DeliveryCost,

        [Phone]
    [MaxLength(20)]
    string? WhatsappNumber,

        [Required]
    [Url]
    string Slug,

        List<PaymentMethod>? PaymentMethod,

        [Required]
    AvailabilityRequestDto Availability
    );

    public record RestaurantResponseDto(
     int RestaurantId,
     string Name,
     string Address,
     string Telephone,
     string Description,
     string LogoUrl,
     List<string>? Images,
     List<string>? Tags,
     decimal DeliveryCost,
     int? MinOrder,
     string Slug
 );

    public record UpdateRestaurantRequestDto(
      [Required]
      [Range(1, int.MaxValue, ErrorMessage = "UserId must be a positive integer.")]
      int UserId,

     [Required, MinLength(2), MaxLength(100)]
    [RegularExpression(@"^[\w\s\-\.\,]+$", ErrorMessage = "Name contains invalid characters.")]
    string Name,

     [Required, MinLength(5), MaxLength(255)]
    string Address,

     [Required]
    [Phone]
    [MaxLength(20)]
    string Telephone,

     [Required, MinLength(10), MaxLength(500)]
    string Description,

    string LogoUrl,
    List<string> Images,

     List<string>? Tags,

     [Range(0, int.MaxValue)]
    int? MinOrder,

     [Range(0, 1000)]
    decimal DeliveryCost,

     [Phone]
    [MaxLength(20)]
    string? WhatsappNumber,

     [Required]
    [RegularExpression(@"^[a-z0-9]+(?:-[a-z0-9]+)*$",
    ErrorMessage = "Slug must contain only lowercase letters, numbers and hyphens.")]
    string Slug,


     List<PaymentMethod>? PaymentMethod
 );

    public enum PaymentMethod
    {
        Cash = 0,
        Card = 1,
        Transfer = 2,
    }

    public record AvailabilityRequestDto
    (

        List<DayAvailabilityRequestDto> AvailabilityOnTheDays
    );

    public record DayAvailabilityRequestDto
    (
         DayOfWeek Day,
         bool Active,
         bool AllDay,
         List<HourAvailabilityRequestDto>? AvailabilityHours

    );

    public record HourAvailabilityRequestDto
    (
            string Init,
            string End
    );
}