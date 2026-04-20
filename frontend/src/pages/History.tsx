import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const MOODS = {
  great:   { color: '#fbbf24', emoji: '🤩', label: 'Great' },
  good:    { color: '#34d399', emoji: '🙂', label: 'Good' },
  neutral: { color: '#94a3b8', emoji: '😐', label: 'Neutral' },
  bad:     { color: '#60a5fa', emoji: '😕', label: 'Bad' },
  awful:   { color: '#a855f7', emoji: '😭', label: 'Awful' }
};

type MoodType = keyof typeof MOODS;

interface MoodEntry {
  id: string;
  date: string;
  mood: MoodType;
  note: string;
}

export default function History() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState<MoodType | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [inspectEntry, setInspectEntry] = useState<MoodEntry | null>(null);

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(API_BASE_URL);
        if (response.ok) {
          const data = await response.json();
          data.sort((a: MoodEntry, b: MoodEntry) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setEntries(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDeleteEntry = async () => {
    if (!inspectEntry) return;
    if (!window.confirm("Sigur vrei să ștergi această înregistrare?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${inspectEntry.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setEntries(prev => prev.filter(e => e.id !== inspectEntry.id));
        setInspectEntry(null);
        if (getEntriesForDay(selectedDay!).length <= 1) {
          setSelectedDay(null);
        }
      } else {
        alert("Eroare la ștergere.");
      }
    } catch (error) {
      alert("Eroare de conexiune.");
    }
  };

  const getEntriesForDay = (day: number) => {
    return entries.filter(entry => {
      const d = new Date(entry.date);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  const getDominantMood = (entryArray: MoodEntry[]): MoodType | null => {
    if (entryArray.length === 0) return null;
    const counts = entryArray.reduce((acc, curr) => {
      const m = curr.mood.toLowerCase() as MoodType;
      acc[m] = (acc[m] || 0) + 1;
      return acc;
    }, {} as Record<MoodType, number>);
    return Object.keys(counts).reduce((a, b) => counts[a as MoodType] > counts[b as MoodType] ? a : b) as MoodType;
  };

  const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });

  if (loading) return <div className="text-indigo-500 font-bold mt-10 text-center">Se încarcă...</div>;

  return (
    <div className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white p-6 sm:p-10 mt-6 relative">
      
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setCurrentMonthDate(new Date(year, month - 1, 1))} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full font-bold">&larr;</button>
        <h2 className="text-2xl font-extrabold text-slate-800 capitalize">{currentMonthDate.toLocaleString('ro-RO', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={() => setCurrentMonthDate(new Date(year, month + 1, 1))} disabled={new Date(year, month + 1, 1) > new Date()} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full font-bold disabled:opacity-20">&rarr;</button>
      </div>

      <div className="flex justify-center gap-2 mb-8 bg-white/50 p-2 rounded-2xl border border-slate-100">
        {(Object.keys(MOODS) as MoodType[]).map(m => (
          <button key={m} onClick={() => setActiveFilter(activeFilter === m ? null : m)} className={`w-10 h-10 rounded-xl text-xl transition-all ${activeFilter === m ? 'bg-slate-800 scale-110 shadow-lg' : 'opacity-40 hover:opacity-100'}`}>{MOODS[m].emoji}</button>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => <div key={d} className="text-center text-slate-400 font-bold text-xs">{d}</div>)}
        {daysArray.map(day => {
          const dayEntries = getEntriesForDay(day);
          const hasEntries = dayEntries.length > 0;
          const matches = activeFilter ? dayEntries.some(e => e.mood.toLowerCase() === activeFilter) : true;
          const dominant = getDominantMood(dayEntries);
          const heatColor = hasEntries && matches && dominant ? MOODS[dominant].color + '33' : '';

          return (
            <div 
              key={day} 
              onClick={() => hasEntries && matches && setSelectedDay(day)}
              style={{ backgroundColor: heatColor }}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${hasEntries && matches ? 'cursor-pointer hover:scale-105 border-2 border-transparent hover:border-indigo-200' : 'bg-slate-50 opacity-30 grayscale'}`}
            >
              <span className="text-sm font-bold">{day}</span>
              {hasEntries && matches && <div className="text-[10px]">{MOODS[dominant!].emoji}</div>}
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedDay(null)}></div>
          <div className="bg-white p-6 rounded-3xl shadow-2xl z-10 w-full max-w-sm flex flex-col gap-3">
            <h3 className="font-bold text-center border-b pb-3">Stări din {selectedDay} {currentMonthDate.toLocaleString('ro-RO', { month: 'long' })}</h3>
            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
              {getEntriesForDay(selectedDay).filter(e => !activeFilter || e.mood.toLowerCase() === activeFilter).map(entry => (
                <button key={entry.id} onClick={() => setInspectEntry(entry)} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all text-left">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: MOODS[entry.mood.toLowerCase() as MoodType].color }}>{MOODS[entry.mood.toLowerCase() as MoodType].emoji}</div>
                  <div className="flex-1 font-bold text-slate-700 capitalize">{entry.mood} <span className="block text-xs text-indigo-400 font-normal">{formatTime(entry.date)}</span></div>
                  <span className="text-slate-300">›</span>
                </button>
              ))}
            </div>
            <button onClick={() => setSelectedDay(null)} className="w-full py-3 rounded-xl bg-slate-100 font-bold text-slate-500">Închide</button>
          </div>
        </div>
      )}

      {inspectEntry && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setInspectEntry(null)}></div>
          <div className="bg-white p-6 rounded-3xl shadow-2xl z-10 w-full max-w-sm text-center animate-pop-in">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-5xl mx-auto mb-4 shadow-inner" style={{ backgroundColor: MOODS[inspectEntry.mood.toLowerCase() as MoodType].color }}>{MOODS[inspectEntry.mood.toLowerCase() as MoodType].emoji}</div>
            <h3 className="text-3xl font-black uppercase mb-1">{inspectEntry.mood}</h3>
            <p className="text-xs font-bold text-indigo-500 mb-4">{new Date(inspectEntry.date).toLocaleString('ro-RO')}</p>
            <div className="bg-slate-50 p-4 rounded-2xl text-left border mb-6 italic text-slate-600">"{inspectEntry.note || 'Fără notiță'}"</div>
            
            <div className="flex gap-2">
              <button onClick={handleDeleteEntry} className="flex-1 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold border border-rose-100 hover:bg-rose-100 transition-all">🗑️ Șterge</button>
              <button onClick={() => setInspectEntry(null)} className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-md">Închide</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}