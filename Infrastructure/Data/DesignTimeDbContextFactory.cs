using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Infrastructure.Data
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

            // Usa la misma cadena de conexión que tu appsettings.json
            optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=PediMaster;Username=postgres;Password=admin");

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
