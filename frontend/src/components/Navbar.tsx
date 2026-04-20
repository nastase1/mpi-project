import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm border-b border-slate-200/50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">✨</span>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent tracking-tight">
            Daily Mood
          </h1>
        </Link>

        <div className="flex gap-4 items-center">
          
          <Link 
            to="/history"
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              isActive('/history')
                ? 'text-indigo-700 bg-indigo-100/80 shadow-inner' 
                : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            History
          </Link>
          
          <Link 
            to="/jar"
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center ${
              isActive('/jar')
                ? 'bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-200' 
                : 'bg-white text-indigo-600 border border-indigo-100 hover:shadow-md hover:-translate-y-0.5'
            }`}
          >
            <span className="mr-1.5">+</span> Add Mood
          </Link>
          
        </div>
      </div>
    </nav>
  );
}