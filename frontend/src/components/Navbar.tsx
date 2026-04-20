import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm border-b border-slate-200/50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo-ul duce mereu spre Acasă (Borcan) */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <span className="text-2xl group-hover:animate-pulse transition-all">✨</span>
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent tracking-tight">
            Daily Mood
          </h1>
        </Link>

        <div className="flex gap-4 items-center">
          
          {/* Butonul de History */}
          <Link 
            to="/history"
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              location.pathname === '/history'
                ? 'text-indigo-700 bg-indigo-100/80 shadow-inner' // Stare activă
                : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50' // Stare normală (designul tău)
            }`}
          >
            History
          </Link>
          
          {/* Butonul + Add Mood (designul tău original spectaculos) */}
          <Link 
            to="/"
            className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center ${
              location.pathname === '/'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-200' // Când ești pe borcan
                : 'bg-white text-indigo-600 border border-indigo-100 hover:shadow-md hover:-translate-y-0.5' // Când ești pe history
            }`}
          >
            + Add Mood
          </Link>
          
        </div>
      </div>
    </nav>
  );
}