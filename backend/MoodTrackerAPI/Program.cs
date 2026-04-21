using Microsoft.EntityFrameworkCore;
using MoodTrackerAPI.Data;
using MoodTrackerAPI.Services;

namespace MoodTrackerAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            // Get connection string - Render uses DATABASE_URL, local uses DefaultConnection
            var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") 
                ?? builder.Configuration.GetConnectionString("DefaultConnection");
            
            // Convert Render's PostgreSQL URL format to Npgsql connection string format
            if (!string.IsNullOrEmpty(connectionString) && connectionString.StartsWith("postgresql://"))
            {
                var uri = new Uri(connectionString);
                connectionString = $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={uri.UserInfo.Split(':')[0]};Password={uri.UserInfo.Split(':')[1]};SSL Mode=Require;Trust Server Certificate=true";
                Console.WriteLine("Converted DATABASE_URL from postgres:// format to Npgsql format");
            }
            
            // Debug: Log connection string status (without exposing password)
            if (string.IsNullOrEmpty(connectionString))
            {
                Console.WriteLine("ERROR: Connection string is null or empty!");
                Console.WriteLine($"DATABASE_URL env var: {(Environment.GetEnvironmentVariable("DATABASE_URL") != null ? "SET" : "NOT SET")}");
                Console.WriteLine($"DefaultConnection config: {(builder.Configuration.GetConnectionString("DefaultConnection") != null ? "SET" : "NOT SET")}");
            }
            else
            {
                Console.WriteLine($"Connection string loaded successfully (length: {connectionString.Length})");
            }
            
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(connectionString));
            builder.Services.AddScoped<MoodEntryService>();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp",
                    policy =>
                    {
                        policy.WithOrigins(
                            "http://localhost:5173",
                            "http://localhost:3000",
                            "https://moodtracker-frontend-jbfn.onrender.com")
                              .AllowAnyHeader()
                              .AllowAnyMethod();

                    });
            });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Auto-migrate database on startup
            using (var scope = app.Services.CreateScope())
            {
                try
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    dbContext.Database.Migrate();
                    Console.WriteLine("Database migration completed successfully.");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error during database migration: {ex.Message}");
                    // Don't crash the app, let it try to start anyway
                }
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors("AllowReactApp");

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}