using Microsoft.EntityFrameworkCore;
using MoodTrackerAPI.Data;
using MoodTrackerAPI.Models;
using MoodTrackerAPI.Services;
using Xunit;

namespace MoodTrackerAPI.Tests
{
    public class MoodEntryServiceTests
    {
        private AppDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new AppDbContext(options);
        }

        [Fact]
        public async Task CreateAsync_AddsEntry()
        {
            var context = GetDbContext();
            var service = new MoodEntryService(context);

            var entry = new MoodEntry
            {
                Date = DateTime.UtcNow,
                Mood = "Happy",
                Note = "Test"
            };

            var result = await service.CreateAsync(entry);

            Assert.NotNull(result);
            Assert.Equal(1, context.MoodEntries.Count());
        }

        [Fact]
        public async Task GetAllAsync_ReturnsEntries()
        {
            var context = GetDbContext();
            var service = new MoodEntryService(context);

            context.MoodEntries.Add(new MoodEntry
            {
                Date = DateTime.UtcNow,
                Mood = "Ok"
            });
            await context.SaveChangesAsync();

            var result = await service.GetAllAsync();

            Assert.Single(result);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsCorrectEntry()
        {
            var context = GetDbContext();
            var service = new MoodEntryService(context);

            var entry = new MoodEntry
            {
                Date = DateTime.UtcNow,
                Mood = "Good"
            };

            context.MoodEntries.Add(entry);
            await context.SaveChangesAsync();

            var result = await service.GetByIdAsync(entry.Id);

            Assert.NotNull(result);
            Assert.Equal(entry.Id, result!.Id);
        }

        [Fact]
        public async Task DeleteAsync_RemovesEntry()
        {
            var context = GetDbContext();
            var service = new MoodEntryService(context);

            var entry = new MoodEntry
            {
                Date = DateTime.UtcNow,
                Mood = "Sad"
            };

            context.MoodEntries.Add(entry);
            await context.SaveChangesAsync();

            var result = await service.DeleteAsync(entry.Id);

            Assert.True(result);
            Assert.Empty(context.MoodEntries);
        }

        [Fact]
        public async Task DeleteAsync_ReturnsFalse_WhenNotFound()
        {
            var context = GetDbContext();
            var service = new MoodEntryService(context);

            var result = await service.DeleteAsync(Guid.NewGuid());

            Assert.False(result);
        }
    }
}