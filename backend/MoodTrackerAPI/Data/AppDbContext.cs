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

            // Configure Date column to use timestamp without time zone
            modelBuilder.Entity<MoodEntry>()
                .Property(e => e.Date)
                .HasColumnType("timestamp without time zone");
        }
    }
}