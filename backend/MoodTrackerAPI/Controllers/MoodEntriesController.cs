using Microsoft.AspNetCore.Mvc;
using MoodTrackerAPI.Models;
using MoodTrackerAPI.Services;

namespace MoodTrackerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoodEntriesController : ControllerBase
    {
        private readonly MoodEntryService _service;

        public MoodEntriesController(MoodEntryService service)
        {
            _service = service;
        }

        // GET: api/MoodEntries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MoodEntry>>> GetMoodEntries()
        {
            return Ok(await _service.GetAllAsync());
        }

        // GET: api/MoodEntries/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<MoodEntry>> GetMoodEntry(Guid id)
        {
            var moodEntry = await _service.GetByIdAsync(id);

            if (moodEntry == null)
            {
                return NotFound();
            }

            return Ok(moodEntry);
        }

        // POST: api/MoodEntries
        [HttpPost]
        public async Task<ActionResult<MoodEntry>> CreateMoodEntry([FromBody] MoodEntry moodEntry)
        {
            var created = await _service.CreateAsync(moodEntry);

            return CreatedAtAction(nameof(GetMoodEntry), new { id = created.Id }, created);
        }

        // DELETE: api/MoodEntries/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMoodEntry(Guid id)
        {
            var deleted = await _service.DeleteAsync(id);

            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}