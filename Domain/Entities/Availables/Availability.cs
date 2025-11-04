using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.Availables
{
    public class Availability
    {
        public int Id { get; set; }
        public List<AvailabilityOnTheDay> AvailabilityOnTheDays { get; set; } = new();
    }

    public class AvailabilityOnTheDay
    {
        public int Id { get; set; }
        public DayOfWeek Day { get; set; }  // <-- Mucho mejor que string
        public bool Active { get; set; }
        public bool AllDay { get; set; }
        public List<AvailabilityHours>? AvailabilityHours { get; set; }
    }

    public class AvailabilityHours
    {
        public int Id { get; set; }
        public TimeSpan Init { get; set; }
        public TimeSpan End { get; set; }
    }
    public enum DayOfWeek
    {
        Sunday = 0,
        Monday = 1,
        Tuesday = 2,
        Wednesday = 3,
        Thursday = 4,
        Friday = 5,
        Saturday = 6
    }

}
