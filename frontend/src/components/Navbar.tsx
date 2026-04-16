export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm border-b border-slate-200/50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <span className="text-2xl group-hover:animate-pulse transition-all">✨</span>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent tracking-tight">
            Daily Mood
          </h1>
        </div>

        <div className="flex gap-4 items-center">
          
          <button className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl font-medium transition-all duration-200">
            History
          </button>
          
          <button className="bg-gradient-to-r from-indigo-600 to-violet-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-200 hover:-translate-y-0.5 active:scale-95 transition-all duration-200">
            + Add Mood
          </button>
          
        </div>
      </div>
    </nav>
  );
}