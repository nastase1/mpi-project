import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

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

const createEmojiTexture = (emoji: string, color: string, radius: number) => {
  const size = radius * 2;
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${radius}" cy="${radius}" r="${radius - 1}" fill="${color}" stroke="rgba(255,255,255,0.8)" stroke-width="2"/>
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-size="${radius + 4}px" font-family="sans-serif">${emoji}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export default function MoodJar() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef(Matter.Engine.create({ enableSleeping: true }));
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const hasFetched = useRef(false);

  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [draftMood, setDraftMood] = useState<MoodType | null>(null);
  const [draftNote, setDraftNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);

  const playBounce = (speed: number) => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      const vol = Math.min(1, speed / 8);
      if (vol < 0.05) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300 + Math.random() * 200, ctx.currentTime);
      gain.gain.setValueAtTime(vol * 0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  useEffect(() => {
    if (!sceneRef.current) return;
    const engine = engineRef.current;
    
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine,
      options: { width: 320, height: 450, background: 'transparent', wireframes: false, pixelRatio: 1 }
    });

    const wallOptions = { isStatic: true, render: { visible: false }, friction: 0.1 };
    Matter.Composite.add(engine.world, [
      Matter.Bodies.rectangle(160, 440, 320, 40, wallOptions),
      Matter.Bodies.rectangle(5, 225, 20, 500, wallOptions),
      Matter.Bodies.rectangle(315, 225, 20, 500, wallOptions)
    ]);

    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } }
    });
    mouseConstraintRef.current = mouseConstraint;
    Matter.Composite.add(engine.world, mouseConstraint);

    Matter.Events.on(mouseConstraint, 'mousedown', (event) => {
      const bodies = Matter.Composite.allBodies(engine.world).filter(b => !b.isStatic);
      const clickedBodies = Matter.Query.point(bodies, event.mouse.position);
      if (clickedBodies.length > 0) {
        const clickedBall = clickedBodies[0];
        if (clickedBall.plugin && clickedBall.plugin.data) {
          setSelectedEntry(clickedBall.plugin.data);
        }
      }
    });

    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const speed = Math.max(pair.bodyA.speed, pair.bodyB.speed);
        if (speed > 1.5) playBounce(speed);
      });
    });

    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    const fetchMoods = async () => {
      if (hasFetched.current) return;
      try {
        const response = await fetch(API_BASE_URL);
        if (response.ok) {
          hasFetched.current = true;
          const data = await response.json();
          data.forEach((entry: MoodEntry, index: number) => {
             const normalizedMood = entry.mood.toLowerCase() as MoodType;
             if(MOODS[normalizedMood]) {
                 setTimeout(() => addBallPhysically(normalizedMood, entry), index * 100); 
             }
          });
        }
        setIsLoading(false);
      } catch (error) {
        setConnectionError(true);
        setIsLoading(false);
      }
    };

    fetchMoods();

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  const addBallPhysically = (mood: MoodType, entryData: MoodEntry) => {
    const radius = 22;
    const randomX = 160 + (Math.random() * 20 - 10);
    const texture = createEmojiTexture(MOODS[mood].emoji, MOODS[mood].color, radius);

    const ball = Matter.Bodies.circle(randomX, -20, radius, {
      restitution: 0.6,
      friction: 0.05,
      density: 0.05,
      render: { sprite: { texture, xScale: 1, yScale: 1 } },
      plugin: { data: entryData }
    });
    Matter.Composite.add(engineRef.current.world, ball);
  };

  const handleSaveMood = async () => {
    if (!draftMood) return;
    setIsSaving(true);
    // Subtract 5 seconds to avoid "date in future" validation error
    const date = new Date();
    date.setSeconds(date.getSeconds() - 5);
    const newEntry = { date: date.toISOString(), mood: draftMood, note: draftNote || "" };
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      });
      if (response.ok) {
        const savedEntry = await response.json(); 
        addBallPhysically(draftMood, savedEntry);
        setDraftMood(null);
      }
    } catch (error) { alert("Eroare de conexiune."); }
    finally { setIsSaving(false); }
  };

  const handleDeleteEntry = async () => {
    if (!selectedEntry) return;
    if (!window.confirm("Sigur vrei să ștergi această bilă?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${selectedEntry.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const engine = engineRef.current;
        const ballToRemove = Matter.Composite.allBodies(engine.world).find(
          b => b.plugin?.data?.id === selectedEntry.id
        );

        if (ballToRemove) {
          Matter.Composite.remove(engine.world, ballToRemove);

          const allBalls = Matter.Composite.allBodies(engine.world);
          allBalls.forEach(body => {
            if (!body.isStatic) {
              Matter.Sleeping.set(body, false);
            }
          });
        }
        
        closeInspect();
      }
    } catch (error) { alert("Eroare la ștergere."); }
  };

  const closeInspect = () => {
    setSelectedEntry(null);
    if (mouseConstraintRef.current) {
      mouseConstraintRef.current.body = undefined as any;
      mouseConstraintRef.current.mouse.button = -1;
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto relative mt-4">

      {/* MODAL 1: ADAUGARE (Glassmorphism Premium) */}
      {draftMood && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setDraftMood(null)}></div>
          <div data-testid="add-mood-modal" className="bg-white/95 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl z-10 w-full max-w-sm border border-white flex flex-col gap-5 animate-pop-in relative overflow-hidden">
             
             {/* Glow decorativ modal */}
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-full pointer-events-none" />

             <div className="flex items-center gap-4 relative z-10">
               <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-inner border-2 border-white" style={{ backgroundColor: MOODS[draftMood].color }}>
                 {MOODS[draftMood].emoji}
               </div>
               <div>
                 <h3 className="font-black text-slate-800 text-xl tracking-tight leading-tight">Cum a fost <br/> ziua ta?</h3>
               </div>
             </div>

             <div className="relative z-10">
               <textarea
                 autoFocus
                 data-testid="note-textarea"
                 className="w-full p-5 rounded-2xl bg-white border border-slate-100 shadow-inner focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none min-h-[120px] text-slate-700 text-lg transition-all resize-none placeholder:text-slate-300"
                 placeholder="Scrie o notiță aici..."
                 value={draftNote}
                 onChange={(e) => setDraftNote(e.target.value)}
               />
             </div>

             <div className="flex gap-3 mt-2 relative z-10">
               <button data-testid="cancel-mood-btn" onClick={() => setDraftMood(null)} className="flex-1 py-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold transition-colors active:scale-95">Anulează</button>
               <button data-testid="save-mood-btn" onClick={handleSaveMood} disabled={isSaving} className="flex-[2] py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white font-bold shadow-lg shadow-indigo-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 transition-all">
                 {isSaving ? "Se salvează..." : "Adaugă în Borcan"}
               </button>
             </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INSPECTARE & STERGERE (Același stil cu History) */}
      {selectedEntry && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={closeInspect}></div>
          <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl z-10 w-full max-w-sm text-center border border-white animate-pop-in relative overflow-hidden">
            
            <div 
              className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-32 blur-[40px] opacity-30 rounded-full pointer-events-none"
              style={{ backgroundColor: MOODS[selectedEntry.mood.toLowerCase() as MoodType].color }}
            />

            <div className="relative w-24 h-24 rounded-full flex items-center justify-center text-6xl mx-auto mb-4 shadow-inner border-4 border-white transform hover:rotate-12 transition-transform" style={{ backgroundColor: MOODS[selectedEntry.mood.toLowerCase() as MoodType]?.color }}>
              {MOODS[selectedEntry.mood.toLowerCase() as MoodType]?.emoji}
            </div>
            
            <h3 className="text-3xl font-black uppercase tracking-tight text-slate-800">{selectedEntry.mood}</h3>
            
            <p className="text-sm font-bold text-indigo-500 mb-6 mt-1 bg-indigo-50 inline-block px-4 py-1 rounded-full">
              {new Date(selectedEntry.date).toLocaleString('ro-RO')}
            </p>
            
            <div className="bg-white p-5 rounded-2xl text-left border border-slate-100 shadow-inner mb-8 relative">
              <span className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">Notiță</span>
              <p className="italic text-slate-600 font-medium text-lg leading-relaxed">
                {selectedEntry.note ? `"${selectedEntry.note}"` : <span className="text-slate-400">Fără notiță adăugată.</span>}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button onClick={handleDeleteEntry} className="flex-1 py-4 bg-rose-50 text-rose-600 rounded-2xl font-bold border border-rose-100 hover:bg-rose-100 hover:shadow-md active:scale-95 transition-all flex items-center justify-center gap-2">
                <span>🗑️</span>
              </button>
              <button onClick={closeInspect} className="flex-[3] py-4 bg-gradient-to-r from-indigo-600 to-violet-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:-translate-y-0.5 active:scale-95 transition-all">
                Închide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Status (Eroare / Borcan Plin) */}
      <div className="h-4 w-full text-center relative z-10">
        {connectionError && <span className="bg-rose-100 text-rose-600 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm animate-pulse">⚠️ Fără conexiune la baza de date</span>}
        {isFull && <span className="bg-rose-100 text-rose-600 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm animate-bounce">Borcanul este plin! 🛑</span>}
      </div>

      {/* BORCANUL FIZIC (Canvas) */}
      <div className={`relative w-[320px] h-[450px] cursor-pointer transition-all duration-500 ${draftMood || selectedEntry ? 'pointer-events-none opacity-40 scale-95' : 'hover:scale-[1.02]'}`}>
        
        {/* Aura luminoasa din spatele borcanului */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[400px] bg-indigo-500/20 blur-[60px] rounded-full pointer-events-none z-0" />
        
        <div ref={sceneRef} className="absolute inset-0 z-10" />
        
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-indigo-400/20 backdrop-blur-[4px] border-2 border-indigo-300/40 rounded-t-md z-20 shadow-sm" />
          <div className="absolute top-5 left-0 w-full h-[425px] bg-indigo-500/10 backdrop-blur-[3px] border-[3px] border-indigo-300/40 rounded-3xl rounded-b-[40px] shadow-[inset_0_-10px_30px_rgba(165,180,252,0.2),0_10px_20px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="absolute top-0 left-4 w-8 h-full bg-gradient-to-r from-indigo-200/30 to-transparent -skew-x-[15deg] mix-blend-overlay" />
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-indigo-400/10 to-transparent" />
          </div>
        </div>
      </div>

      {/* DOCK-ul (Meniul Apple-style de jos) */}
      <div className="w-full max-w-[360px] bg-white/60 backdrop-blur-xl p-4 sm:p-5 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-white flex justify-between px-6 z-30 mt-4">
        {(Object.keys(MOODS) as MoodType[]).map((moodKey) => (
          <button
            key={moodKey}
            data-testid={`mood-btn-${moodKey}`}
            onClick={() => {
              const dynamicBodies = Matter.Composite.allBodies(engineRef.current.world).filter(b => !b.isStatic);
              if (dynamicBodies.length > 0 && Math.min(...dynamicBodies.map(b => b.position.y)) < 80) {
                setIsFull(true); return; 
              }
              setDraftMood(moodKey);
              setDraftNote("");
            }}
            disabled={isLoading || connectionError || isFull}
            className="group outline-none disabled:opacity-50 relative flex flex-col items-center"
          >
            <div 
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-sm border border-white/80 flex items-center justify-center text-2xl sm:text-3xl transition-all duration-300 ease-out group-hover:scale-[1.15] group-hover:-translate-y-3 group-hover:shadow-[0_15px_25px_rgba(0,0,0,0.12)] group-active:scale-95" 
              style={{ backgroundColor: MOODS[moodKey].color }}
            >
              <span className="drop-shadow-sm z-10">{MOODS[moodKey].emoji}</span>
            </div>
            
            {/* Tooltip stil Mac care apare la hover */}
            <span className="absolute -bottom-6 text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {MOODS[moodKey].label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}