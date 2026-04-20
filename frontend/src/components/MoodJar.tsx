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
  const engineRef = useRef(
    Matter.Engine.create({
      enableSleeping: true,
      positionIterations: 4,
      velocityIterations: 3,
      constraintIterations: 1,
    })
  );
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundCooldowns = useRef<WeakMap<Matter.Body, number>>(new WeakMap());
  
  // Stare pentru a afișa dacă aplicația se încarcă sau dacă există o eroare de conexiune
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  const playBounce = (speed: number) => {
    try {
      if (!audioCtxRef.current) { audioCtxRef.current = new AudioContext(); }
      const ctx = audioCtxRef.current;
      const vol = Math.min(1, speed / 8);
      if (vol < 0.05) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      const freq = 300 + Math.random() * 200;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(vol * 0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  useEffect(() => {
    if (!sceneRef.current) return;
    const engine = engineRef.current;
    
    // --- SETUP MATTER.JS (Rămâne la fel) ---
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine,
      options: { width: 320, height: 450, background: 'transparent', wireframes: false, pixelRatio: 1, fps: 40 }
    });
    const wallOptions = { isStatic: true, render: { visible: false }, friction: 0.1 };
    const ground    = Matter.Bodies.rectangle(160, 440, 320, 40, wallOptions);
    const leftWall  = Matter.Bodies.rectangle(5,   225, 20, 500, wallOptions);
    const rightWall = Matter.Bodies.rectangle(315, 225, 20, 500, wallOptions);
    Matter.Composite.add(engine.world, [ground, leftWall, rightWall]);

    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        const speed = Math.max(bodyA.speed, bodyB.speed);
        const now = Date.now();
        const lastA = soundCooldowns.current.get(bodyA) ?? 0;
        const lastB = soundCooldowns.current.get(bodyB) ?? 0;
        if (now - lastA > 80 && now - lastB > 80) {
          playBounce(speed);
          soundCooldowns.current.set(bodyA, now);
          soundCooldowns.current.set(bodyB, now);
        }
      });
    });

    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // --- PRELUARE DATE DIN BACKEND LA ÎNCĂRCARE ---
    const fetchMoods = async () => {
      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error("Nu am putut prelua datele");
        
        const data = await response.json();
        
        // Dacă avem date, populăm borcanul
        if (data && data.length > 0) {
           data.forEach((entry: any, index: number) => {
               // Filtrăm stările ca să ne asigurăm că se potrivesc cu opțiunile noastre (lowercase)
               const normalizedMood = entry.mood.toLowerCase() as MoodType;
               
               if(MOODS[normalizedMood]) {
                   // Adăugăm un mic delay pentru a nu supraîncărca motorul de fizică dintr-o dată
                   setTimeout(() => {
                       addBallPhysically(normalizedMood);
                   }, index * 100); 
               }
           });
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Eroare la conectarea cu backend-ul:", error);
        setConnectionError(true);
        setIsLoading(false);
      }
    };

    fetchMoods();

    return () => {
      Matter.Events.off(engine, 'collisionStart');
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  // Funcția pur vizuală care creează bila (extrasă pentru a fi refolosită)
  const addBallPhysically = (mood: MoodType) => {
    const engine = engineRef.current;
    const radius = 22;
    const randomX = 160 + (Math.random() * 20 - 10);
    const texture = createEmojiTexture(MOODS[mood].emoji, MOODS[mood].color, radius);

    const ball = Matter.Bodies.circle(randomX, -20, radius, {
      restitution: 0.6,
      friction: 0.05,
      density: 0.05,
      sleepThreshold: 30,
      render: { sprite: { texture, xScale: 1, yScale: 1 } }
    });
    Matter.Composite.add(engine.world, ball);
  };

  // --- TRIMITERE DATE CĂTRE BACKEND LA CLICK ---
  const handleMoodSelect = async (mood: MoodType) => {
    // 1. Creăm payload-ul conform modelului tău din C#
    const newEntry = {
      date: new Date().toISOString(),
      mood: mood,
      note: "" // Putem lăsa gol momentan
    };

    try {
      // 2. Facem POST către API
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry)
      });

      if (response.ok) {
        // 3. Dacă backend-ul a răspuns cu 201 Created, adăugăm bila vizual în borcan
        addBallPhysically(mood);
      } else {
        // Tratăm cazul de validare eșuată (ex: date invalide trimise la C#)
        const errorData = await response.text();
        console.error("Eroare validare backend:", errorData);
        alert("Eroare la salvare. Te rugăm să încerci din nou.");
      }
    } catch (error) {
       console.error("Nu mă pot conecta la server:", error);
       alert("Eroare de conexiune. Verifică dacă backend-ul este pornit!");
    }
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-md mx-auto">

      {/* Mesaje de stare pentru UX */}
      {isLoading && <p className="text-indigo-500 font-medium">Se încarcă istoricul tău...</p>}
      {connectionError && <p className="text-red-500 font-medium">⚠️ Nu s-a putut conecta la baza de date.</p>}

      <div className="relative w-[320px] h-[450px]">
        <div ref={sceneRef} className="absolute inset-0 z-10" />

        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-purple-400/10 backdrop-blur-[1px] border-2 border-purple-300/40 rounded-t-md z-20" />
          <div className="absolute top-5 left-0 w-full h-[425px] bg-purple-400/10 backdrop-blur-[1px] border-[3px] border-purple-300/40 rounded-3xl rounded-b-[40px] overflow-hidden">
            <div className="absolute top-0 left-4 w-6 h-full bg-gradient-to-r from-purple-200/20 to-transparent -skew-x-[10deg] mix-blend-overlay" />
          </div>
        </div>
      </div>

      <div className="w-full bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-xl border border-white/80 flex justify-between px-4 sm:px-8">
        {(Object.keys(MOODS) as MoodType[]).map((moodKey) => (
          <button
            key={moodKey}
            onClick={() => handleMoodSelect(moodKey)} // Apelăm noua funcție
            disabled={isLoading || connectionError} // Prevenim click-urile dacă nu avem conexiune
            className={`flex flex-col items-center gap-3 group outline-none ${isLoading || connectionError ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div
              className="w-14 h-14 rounded-full shadow-md flex items-center justify-center text-2xl hover:-translate-y-1 active:scale-95 transition-all duration-300 border-2 border-white/80"
              style={{ backgroundColor: MOODS[moodKey].color }}
            >
              <span className="drop-shadow-sm z-10">{MOODS[moodKey].emoji}</span>
            </div>
            <span className="text-[12px] font-extrabold text-slate-400 uppercase tracking-wider group-hover:text-slate-700">
              {MOODS[moodKey].label}
            </span>
          </button>
        ))}
      </div>

    </div>
  );
}