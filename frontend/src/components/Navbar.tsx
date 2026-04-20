import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    // Wrapper-ul care ține navbar-ul "plutitor" (floating pill)
    <div className="sticky top-4 z-50 px-4 w-full max-w-4xl mx-auto transition-all duration-500">
      
      {/* Navbar-ul propriu-zis (Sticlă Mată) */}
      <nav className="bg-white/60 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/80 rounded-[2rem] px-5 py-3 flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer group outline-none">
          <div className="relative">
            {/* Glow efect in spatele stelutei la hover */}
            <div className="absolute inset-0 bg-indigo-400 blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            <span className="relative text-2xl sm:text-3xl inline-block group-hover:rotate-[15deg] group-hover:scale-110 transition-all duration-300 drop-shadow-sm">✨</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-500 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
            Daily Mood
          </h1>
        </Link>

        {/* LINK-URI */}
        <div className="flex gap-2 sm:gap-4 items-center">
          
          {/* Buton History */}
          <Link 
            to="/history"
            className={`px-4 sm:px-5 py-2.5 rounded-2xl font-bold transition-all duration-300 ease-out flex items-center gap-2 outline-none ${
              isActive('/history')
                ? 'bg-white shadow-sm border border-indigo-50/50 text-indigo-700 scale-105' 
                : 'text-slate-500 hover:text-indigo-600 hover:bg-white/50 active:scale-95'
            }`}
          >
            <span className={`text-lg transition-opacity ${isActive('/history') ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>📅</span>
            <span className="hidden sm:inline">History</span>
          </Link>
          
          {/* Buton Add Mood */}
          <Link 
            to="/jar"
            className={`group relative px-5 sm:px-6 py-2.5 rounded-2xl font-bold transition-all duration-300 ease-out active:scale-95 flex items-center justify-center overflow-hidden outline-none ${
              isActive('/jar')
                ? 'bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] scale-105' 
                : 'bg-white text-indigo-600 border border-indigo-100 hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5'
            }`}
          >
            {/* Efectul de Shine (Raza de lumina la hover) */}
            <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[30deg] group-hover:left-[200%] transition-all duration-700 ease-in-out"></div>
            
            <span className="relative flex items-center gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-xl leading-none">🫙</span>
              <span className="hidden sm:inline">Add Mood</span>
            </span>
          </Link>
          
        </div>
      </nav>
    </div>
  );
}