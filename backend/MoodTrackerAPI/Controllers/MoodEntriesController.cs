using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoodTrackerAPI.Data;
using MoodTrackerAPI.Models;

namespace MoodTrackerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoodEntriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MoodEntriesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/MoodEntries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MoodEntry>>> GetMoodEntries()
        {
            return await _context.MoodEntries.ToListAsync();
        }

        // GET: api/MoodEntries/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<MoodEntry>> GetMoodEntry(Guid id)
        {
            var moodEntry = await _context.MoodEntries.FindAsync(id);

            if (moodEntry == null)
            {
                return NotFound(); // 404
            }

            return moodEntry; // 200
        }

        // POST: api/MoodEntries
        [HttpPost]
        public async Task<ActionResult<MoodEntry>> CreateMoodEntry([FromBody] MoodEntry moodEntry)
        {
            _context.MoodEntries.Add(moodEntry);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMoodEntry), new { id = moodEntry.Id }, moodEntry); // 201
        }

        // DELETE: api/MoodEntries/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMoodEntry(Guid id)
        {
            var moodEntry = await _context.MoodEntries.FindAsync(id);

            if (moodEntry == null)
            {
                return NotFound(); // 404
            }

            _context.MoodEntries.Remove(moodEntry);
            await _context.SaveChangesAsync();

            return NoContent(); // 204
        }
    }
}