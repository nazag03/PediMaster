namespace Application.DTOs
{
    public record CreateRestaurantRequestDto(
        string Name,
        string Address,
        string Telephone,
        List<string> ImagesUrl,
        string Description,
        AvailabilityRequestDto Availability);

    public record RestaurantResponseDto(int RestaurantId,
        string Name,
        string Address,
        string Telephone,
        string Description
        );

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
            TimeSpan Init,
            TimeSpan End
    );

}