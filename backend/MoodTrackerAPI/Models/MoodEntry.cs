using System;
using System.ComponentModel.DataAnnotations;

namespace MoodTrackerAPI.Models
{
    public class MoodEntry
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [MaxLength(20)]
        public string Mood { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Note { get; set; }
    }
}