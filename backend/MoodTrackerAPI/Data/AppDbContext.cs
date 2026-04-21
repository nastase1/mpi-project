using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using MoodTrackerAPI.Models;

namespace MoodTrackerAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<MoodEntry> MoodEntries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Date column to use timestamp with time zone (PostgreSQL best practice)
            modelBuilder.Entity<MoodEntry>()
                .Property(e => e.Date)
                .HasColumnType("timestamp with time zone");
        }
    }
}