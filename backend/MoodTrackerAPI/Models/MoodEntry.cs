using System;
using System.ComponentModel.DataAnnotations;

namespace MoodTrackerAPI.Models
{
    public class MoodEntry
    {
        public int Id { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [MaxLength(20)]
        public string Mood { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Note { get; set; }
    }
}