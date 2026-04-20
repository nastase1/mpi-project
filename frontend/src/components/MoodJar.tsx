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
  id?: string;
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
  const soundCooldowns = useRef<WeakMap<Matter.Body, number>>(new WeakMap());

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
      const freq = 300 + Math.random() * 200;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(vol * 0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  useEffect(() => {
    if (!sceneRef.current) return;
    const engine = engineRef.current;
    
    const render = Matter.Render.create({
      element: sceneRef.current, engine,
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
        const { bodyA, bodyB } = pair;
        const speed = Math.max(bodyA.speed, bodyB.speed);
        const now = Date.now();
        if (now - (soundCooldowns.current.get(bodyA) ?? 0) > 80 && now - (soundCooldowns.current.get(bodyB) ?? 0) > 80) {
          playBounce(speed);
          soundCooldowns.current.set(bodyA, now); soundCooldowns.current.set(bodyB, now);
        }
      });
    });

    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    const fetchMoods = async () => {
      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error("Eroare server");
        const data = await response.json();
        if (data && data.length > 0) {
           data.forEach((entry: MoodEntry, index: number) => {
               const normalizedMood = entry.mood.toLowerCase() as MoodType;
               if(MOODS[normalizedMood]) {
                   setTimeout(() => addBallPhysically(normalizedMood, entry), index * 120); 
               }
           });
        }
        setIsLoading(false);
      } catch (error) {
        setConnectionError(true); setIsLoading(false);
      }
    };

    fetchMoods();

    return () => {
      Matter.Render.stop(render); Matter.Runner.stop(runner);
      Matter.Engine.clear(engine); render.canvas.remove();
    };
  }, []);

  const addBallPhysically = (mood: MoodType, entryData: MoodEntry) => {
    const engine = engineRef.current;
    const radius = 22;
    const randomX = 160 + (Math.random() * 20 - 10);
    const texture = createEmojiTexture(MOODS[mood].emoji, MOODS[mood].color, radius);

    const ball = Matter.Bodies.circle(randomX, -20, radius, {
      restitution: 0.6, friction: 0.05, density: 0.05, sleepThreshold: 30,
      render: { sprite: { texture, xScale: 1, yScale: 1 } },
      plugin: { data: entryData }
    });
    Matter.Composite.add(engine.world, ball);
  };

  const openDraftModal = (mood: MoodType) => {
    const engine = engineRef.current;
    const dynamicBodies = Matter.Composite.allBodies(engine.world).filter(b => !b.isStatic);
    if (dynamicBodies.length > 0 && Math.min(...dynamicBodies.map(b => b.position.y)) < 80) {
      setIsFull(true); return; 
    }
    setDraftMood(mood);
    setDraftNote("");
  };

  const handleSaveMood = async () => {
    if (!draftMood) return;
    setIsSaving(true);
    const newEntry: MoodEntry = {
      date: new Date().toISOString(),
      mood: draftMood,
      note: draftNote
    };
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
    } catch (error) {
       alert("Eroare de conexiune.");
    } finally {
      setIsSaving(false);
    }
  };

 const closeInspect = () => {
  setSelectedEntry(null);
  if (mouseConstraintRef.current) {
    mouseConstraintRef.current.body = null;
    mouseConstraintRef.current.mouse.button = -1;
  }
};

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto relative">

      {draftMood && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm rounded-3xl" onClick={() => setDraftMood(null)}></div>
          <div className="bg-white p-6 rounded-3xl shadow-2xl z-10 w-full max-w-sm border border-slate-100 flex flex-col gap-4">
            <h3 className="font-bold text-slate-800 text-lg">Cum a fost ziua ta?</h3>
            <textarea 
              autoFocus
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none min-h-[100px] text-slate-700"
              placeholder="Notiță..."
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDraftMood(null)} className="px-4 py-2 rounded-xl text-slate-500 font-medium">Anulează</button>
              <button onClick={handleSaveMood} disabled={isSaving} className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold shadow-md disabled:opacity-50">
                {isSaving ? "Salvare..." : "Adaugă"}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedEntry && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm rounded-3xl" onClick={closeInspect}></div>
          <div className="bg-white p-6 rounded-3xl shadow-2xl z-10 w-full max-w-sm border border-slate-100 flex flex-col gap-3 text-center">
            <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center text-4xl shadow-inner border-4 border-white mb-2" style={{ backgroundColor: MOODS[selectedEntry.mood.toLowerCase() as MoodType]?.color }}>
              {MOODS[selectedEntry.mood.toLowerCase() as MoodType]?.emoji}
            </div>
            <h3 className="font-black text-slate-800 text-2xl uppercase">{selectedEntry.mood}</h3>
            <p className="text-xs text-indigo-500 font-bold bg-indigo-50 px-3 py-1 rounded-full inline-block mx-auto">
              {new Date(selectedEntry.date).toLocaleString('ro-RO')}
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl text-slate-700 text-left border border-slate-100 min-h-[60px]">
              {selectedEntry.note || <span className="text-slate-400 italic">Fără notiță</span>}
            </div>
            <button onClick={closeInspect} className="mt-4 w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-colors">
              Închide
            </button>
          </div>
        </div>
      )}

      <div className="h-4 w-full text-center">
        {connectionError && <span className="text-red-500 font-medium text-sm">⚠️ Eroare de conexiune</span>}
        {isFull && <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-xs font-bold">Borcanul e plin!</span>}
      </div>

      <div className={`relative w-[320px] h-[450px] cursor-pointer ${draftMood || selectedEntry ? 'pointer-events-none' : ''}`}>
        <div ref={sceneRef} className="absolute inset-0 z-10" />
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-white/10 backdrop-blur-[2px] border-2 border-white/40 rounded-t-md z-20 shadow-sm" />
          <div className="absolute top-5 left-0 w-full h-[425px] bg-white/10 backdrop-blur-[2px] border-[3px] border-white/50 rounded-3xl rounded-b-[40px] shadow-[inset_0_-10px_20px_rgba(255,255,255,0.2)] overflow-hidden">
            <div className="absolute top-0 left-4 w-6 h-full bg-gradient-to-r from-white/40 to-transparent -skew-x-[10deg] mix-blend-overlay" />
          </div>
        </div>
      </div>

      <div className="w-full bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-xl border border-white/80 flex justify-between px-4 sm:px-8 z-30">
        {(Object.keys(MOODS) as MoodType[]).map((moodKey) => (
          <button
            key={moodKey}
            onClick={() => openDraftModal(moodKey)}
            disabled={isLoading || connectionError || isFull}
            className="flex flex-col items-center gap-3 group outline-none disabled:opacity-50"
          >
            <div className="w-14 h-14 rounded-full shadow-md flex items-center justify-center text-2xl hover:-translate-y-1 active:scale-95 transition-all border-2 border-white/80" style={{ backgroundColor: MOODS[moodKey].color }}>
              <span className="drop-shadow-sm z-10">{MOODS[moodKey].emoji}</span>
            </div>
            <span className="text-[12px] font-extrabold text-slate-400 uppercase tracking-wider group-hover:text-slate-700">{MOODS[moodKey].label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}