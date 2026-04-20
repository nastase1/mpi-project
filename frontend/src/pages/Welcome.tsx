import { Link } from 'react-router-dom';

export default function Welcome() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] text-center px-4 overflow-hidden">
      
      {/* 1. Background Ambient Glows (Lumini ambientale) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-violet-400/20 blur-[80px] rounded-full pointer-events-none animate-pulse" />

      {/* 2. Welcome Pill cu punct care pulsează */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-indigo-100 text-indigo-600 text-sm font-bold mb-8 shadow-sm relative z-10 hover:scale-105 transition-transform cursor-default">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        Your Personal Emotion Tracker
      </div>

      {/* 3. Main Icon */}
      <div className="relative mb-6 group cursor-default z-10">
        <div className="absolute -inset-6 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition duration-700"></div>
        <span className="relative text-7xl inline-block group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 drop-shadow-xl">✨</span>
      </div>

      {/* 4. Heading */}
      <h1 className="text-5xl md:text-7xl font-black text-slate-800 mb-6 tracking-tight z-10 leading-tight">
        How are you feeling <br /> 
        <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
          today truly?
        </span>
      </h1>

      <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-12 leading-relaxed font-medium z-10">
        Daily Mood helps you visualize your emotions in an interactive way. 
        Drop a ball into the jar, leave a note, and track your emotional journey over time.
      </p>

      {/* 5. Butoane premium */}
      <div className="flex flex-col sm:flex-row gap-5 z-10 w-full sm:w-auto px-4">
        <Link 
          to="/jar" 
          className="group relative px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all w-full sm:w-auto overflow-hidden shadow-[0_0_40px_rgba(79,70,229,0.3)]"
        >
          {/* Shine effect (Raza de lumină la hover) */}
          <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[30deg] group-hover:left-[200%] transition-all duration-1000 ease-in-out"></div>
          <span className="relative flex items-center justify-center gap-2">
            Open the Mood Jar 🫙
          </span>
        </Link>
        
        <Link 
          to="/history" 
          className="px-8 py-4 bg-white/80 backdrop-blur-md text-slate-700 rounded-2xl font-bold text-lg border-2 border-slate-100 hover:border-indigo-200 hover:bg-white hover:-translate-y-1 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          See Your History 📅
        </Link>
      </div>

      {/* 6. Emoji Dock (Stil Mac OS) */}
      <div className="mt-16 bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl rounded-3xl p-3 flex gap-2 z-10">
        {['🤩', '🙂', '😐', '😕', '😭'].map((emoji, idx) => (
          <div 
            key={idx} 
            className="w-14 h-14 flex items-center justify-center text-3xl bg-white/50 rounded-2xl cursor-default grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:scale-[1.3] hover:-translate-y-4 hover:bg-white hover:shadow-xl hover:border hover:border-slate-100 transition-all duration-300 ease-out"
          >
            {emoji}
          </div>
        ))}
      </div>
      
    </div>
  );
}