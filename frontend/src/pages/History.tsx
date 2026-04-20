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

  if (loading) return (
    <div className="flex flex-col items-center justify-center mt-20 gap-4">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <div className="text-indigo-600 font-bold animate-pulse">Se încarcă istoricul...</div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/60 p-6 sm:p-10 mt-6 relative overflow-hidden">
      
      {/* Glow ambiental intern */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-violet-400/20 blur-[80px] rounded-full pointer-events-none" />

      {/* HEADER NAVIGARE */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <button 
          onClick={() => setCurrentMonthDate(new Date(year, month - 1, 1))} 
          className="w-12 h-12 flex items-center justify-center bg-white/80 hover:bg-white text-indigo-600 rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95 border border-white"
        >
          &larr;
        </button>
        
        <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-500 bg-clip-text text-transparent capitalize tracking-tight drop-shadow-sm">
          {currentMonthDate.toLocaleString('ro-RO', { month: 'long', year: 'numeric' })}
        </h2>
        
        <button 
          onClick={() => setCurrentMonthDate(new Date(year, month + 1, 1))} 
          disabled={new Date(year, month + 1, 1) > new Date()} 
          className="w-12 h-12 flex items-center justify-center bg-white/80 hover:bg-white text-indigo-600 rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95 border border-white disabled:opacity-30 disabled:hover:scale-100 disabled:shadow-none"
        >
          &rarr;
        </button>
      </div>

      {/* FILTRE (Dock iOS style) */}
      <div className="flex justify-center gap-3 mb-10 bg-white/40 backdrop-blur-md p-3 rounded-3xl border border-white/60 shadow-inner max-w-fit mx-auto relative z-10">
        {(Object.keys(MOODS) as MoodType[]).map(m => (
          <button 
            key={m} 
            onClick={() => setActiveFilter(activeFilter === m ? null : m)} 
            className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center transition-all duration-300 ease-out ${
              activeFilter === m 
                ? 'bg-white shadow-[0_10px_20px_rgba(0,0,0,0.1)] border border-indigo-100 scale-110 -translate-y-1' 
                : 'opacity-50 hover:opacity-100 hover:bg-white/50 hover:scale-105'
            }`}
            title={MOODS[m].label}
          >
            {MOODS[m].emoji}
          </button>
        ))}
      </div>

      {/* CALENDAR GRID */}
      <div className="grid grid-cols-7 gap-3 sm:gap-4 relative z-10">
        {/* Zilele Săptămânii */}
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, idx) => (
          <div key={idx} className="text-center text-indigo-900/40 font-black text-xs tracking-widest uppercase mb-2">
            {d}
          </div>
        ))}
        
        {/* Căsuțele Zilelor */}
        {daysArray.map(day => {
          const dayEntries = getEntriesForDay(day);
          const hasEntries = dayEntries.length > 0;
          const matches = activeFilter ? dayEntries.some(e => e.mood.toLowerCase() === activeFilter) : true;
          const dominant = getDominantMood(dayEntries);
          
          // Culoare heatmap + transparență
          const heatColor = hasEntries && matches && dominant ? MOODS[dominant].color + '40' : ''; // 40 e hex ptr ~25% opacitate

          return (
            <div 
              key={day} 
              onClick={() => hasEntries && matches && setSelectedDay(day)}
              style={{ backgroundColor: heatColor }}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 backdrop-blur-sm border border-white/50 relative group
                ${hasEntries && matches 
                  ? 'cursor-pointer hover:scale-110 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:z-10 hover:border-white' 
                  : 'bg-white/30 opacity-40 grayscale'}
              `}
            >
              <span className={`text-sm font-bold z-10 ${hasEntries && matches ? 'text-slate-800' : 'text-slate-400'}`}>
                {day}
              </span>
              {hasEntries && matches && (
                <div className="absolute bottom-1 text-[10px] drop-shadow-md transition-transform group-hover:-translate-y-1">
                  {MOODS[dominant!].emoji}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL: LISTA ZILEI */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setSelectedDay(null)}></div>
          <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl z-10 w-full max-w-sm flex flex-col gap-4 border border-white animate-pop-in">
            <h3 className="font-black text-center text-xl text-slate-800 border-b border-slate-100 pb-4 tracking-tight">
              {selectedDay} {currentMonthDate.toLocaleString('ro-RO', { month: 'long' })}
            </h3>
            
            <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {getEntriesForDay(selectedDay).filter(e => !activeFilter || e.mood.toLowerCase() === activeFilter).map(entry => (
                <button 
                  key={entry.id} 
                  onClick={() => setInspectEntry(entry)} 
                  className="group flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:bg-indigo-50 hover:border-indigo-100 hover:shadow-md transition-all hover:translate-x-1 text-left"
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner border-2 border-white" 
                    style={{ backgroundColor: MOODS[entry.mood.toLowerCase() as MoodType].color }}
                  >
                    {MOODS[entry.mood.toLowerCase() as MoodType].emoji}
                  </div>
                  <div className="flex-1">
                    <div className="font-extrabold text-slate-700 capitalize text-lg leading-none">{entry.mood}</div>
                    <div className="text-xs text-indigo-400 font-bold mt-1">{formatTime(entry.date)}</div>
                  </div>
                  <span className="text-slate-300 font-bold text-xl group-hover:text-indigo-400 transition-colors">›</span>
                </button>
              ))}
            </div>
            
            <button onClick={() => setSelectedDay(null)} className="w-full py-4 rounded-xl bg-slate-50 hover:bg-slate-100 font-bold text-slate-500 transition-colors active:scale-95">
              Înapoi la Calendar
            </button>
          </div>
        </div>
      )}

      {/* MODAL: INSPECȚIE DETALIATĂ + ȘTERGERE */}
      {inspectEntry && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setInspectEntry(null)}></div>
          <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl z-10 w-full max-w-sm text-center border border-white animate-pop-in relative overflow-hidden">
            
            {/* Glow efect in spatele emoji-ului */}
            <div 
              className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-32 blur-[40px] opacity-30 rounded-full pointer-events-none"
              style={{ backgroundColor: MOODS[inspectEntry.mood.toLowerCase() as MoodType].color }}
            />

            <div 
              className="relative w-24 h-24 rounded-full flex items-center justify-center text-6xl mx-auto mb-4 shadow-inner border-4 border-white transform hover:rotate-12 transition-transform" 
              style={{ backgroundColor: MOODS[inspectEntry.mood.toLowerCase() as MoodType].color }}
            >
              {MOODS[inspectEntry.mood.toLowerCase() as MoodType].emoji}
            </div>
            
            <h3 className="text-3xl font-black uppercase tracking-tight text-slate-800">{inspectEntry.mood}</h3>
            <p className="text-sm font-bold text-indigo-500 mb-6 mt-1 bg-indigo-50 inline-block px-4 py-1 rounded-full">
              {new Date(inspectEntry.date).toLocaleString('ro-RO')}
            </p>
            
            <div className="bg-white p-5 rounded-2xl text-left border border-slate-100 shadow-inner mb-8 relative">
              <span className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">Notiță</span>
              <p className="italic text-slate-600 font-medium text-lg leading-relaxed">
                {inspectEntry.note ? `"${inspectEntry.note}"` : <span className="text-slate-400">Fără notiță adăugată.</span>}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={handleDeleteEntry} 
                className="flex-1 py-4 bg-rose-50 text-rose-600 rounded-2xl font-bold border border-rose-100 hover:bg-rose-100 hover:shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>🗑️</span>
              </button>
              <button 
                onClick={() => setInspectEntry(null)} 
                className="flex-[3] py-4 bg-gradient-to-r from-indigo-600 to-violet-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                Închide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}