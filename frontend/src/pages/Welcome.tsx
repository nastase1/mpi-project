import { Link } from 'react-router-dom';

export default function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 animate-fade-in">
      <div className="relative mb-8">
        <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-full animate-pulse"></div>
        <span className="relative text-8xl">✨</span>
      </div>

      <h1 className="text-5xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight">
        How are you feeling <br /> 
        <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
          today truly?
        </span>
      </h1>

      <p className="text-lg text-slate-600 max-w-lg mb-10 leading-relaxed font-medium">
        Daily Mood helps you visualize your emotions in an interactive way. 
        Add a ball to the jar, leave a note and track your progress over time.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          to="/jar" 
          className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all"
        >
          Open the Mood Jar🫙
        </Link>
        
        <Link 
          to="/history" 
          className="px-10 py-4 bg-white text-slate-600 rounded-2xl font-bold text-lg border border-slate-200 hover:bg-slate-50 hover:shadow-sm hover:-translate-y-1 active:scale-95 transition-all"
        >
          See Your History 📅
        </Link>
      </div>

      <div className="mt-16 flex gap-6 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
        <span className="text-3xl">🤩</span>
        <span className="text-3xl">🙂</span>
        <span className="text-3xl">😐</span>
        <span className="text-3xl">😕</span>
        <span className="text-3xl">😭</span>
      </div>
    </div>
  );
}