using Microsoft.EntityFrameworkCore;
using MoodTrackerAPI.Data;
using MoodTrackerAPI.Models;

namespace MoodTrackerAPI.Services
{
    public class MoodEntryService
    {
        private readonly AppDbContext _context;

        public MoodEntryService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<MoodEntry>> GetAllAsync()
        {
            return await _context.MoodEntries.ToListAsync();
        }

        public async Task<MoodEntry?> GetByIdAsync(Guid id)
        {
            return await _context.MoodEntries.FindAsync(id);
        }

        public async Task<MoodEntry> CreateAsync(MoodEntry moodEntry)
        {
            _context.MoodEntries.Add(moodEntry);
            await _context.SaveChangesAsync();
            return moodEntry;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var moodEntry = await _context.MoodEntries.FindAsync(id);
            if (moodEntry == null)
                return false;

            _context.MoodEntries.Remove(moodEntry);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}