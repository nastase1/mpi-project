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

            // Configure logging
            builder.Logging.ClearProviders();
            builder.Logging.AddConsole();
            builder.Logging.AddDebug();
            builder.Logging.SetMinimumLevel(LogLevel.Information);

            // Add services to the container.
            builder.Services.AddControllers();

            var logger = LoggerFactory.Create(config => config.AddConsole()).CreateLogger<Program>();

            // Get connection string - Render uses DATABASE_URL, local uses DefaultConnection
            var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL")
                ?? builder.Configuration.GetConnectionString("DefaultConnection");

            // Convert Render's PostgreSQL URL format to Npgsql connection string format
            if (!string.IsNullOrEmpty(connectionString) && connectionString.StartsWith("postgresql://"))
            {
                var uri = new Uri(connectionString);
                var port = uri.Port > 0 ? uri.Port : 5432; // Default PostgreSQL port
                var userInfo = uri.UserInfo.Split(':');
                connectionString = $"Host={uri.Host};Port={port};Database={uri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Require;Trust Server Certificate=true";
                logger.LogInformation("[STARTUP] Converted DATABASE_URL from postgres:// format to Npgsql format");
            }

            // Log connection string status (without exposing password)
            if (string.IsNullOrEmpty(connectionString))
            {
                logger.LogError("[STARTUP] Connection string is null or empty!");
                logger.LogWarning("[STARTUP] DATABASE_URL env var: {Status}", Environment.GetEnvironmentVariable("DATABASE_URL") != null ? "SET" : "NOT SET");
                logger.LogWarning("[STARTUP] DefaultConnection config: {Status}", builder.Configuration.GetConnectionString("DefaultConnection") != null ? "SET" : "NOT SET");
            }
            else
            {
                logger.LogInformation("[STARTUP] Connection string loaded successfully (length: {Length})", connectionString.Length);
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
                var scopeLogger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
                try
                {
                    scopeLogger.LogInformation("[DATABASE] Starting database migration...");
                    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    dbContext.Database.Migrate();
                    scopeLogger.LogInformation("[DATABASE] Migration completed successfully");
                }
                catch (Exception ex)
                {
                    scopeLogger.LogError(ex, "[DATABASE] Error during migration: {ErrorMessage}", ex.Message);
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