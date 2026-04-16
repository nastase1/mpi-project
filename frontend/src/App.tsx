import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/60 via-slate-50 to-slate-100">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
        
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl shadow-indigo-100/40 border border-white p-10 text-center mt-10 transition-all duration-300 hover:shadow-indigo-200/50">
          
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner rotate-3 hover:rotate-0 transition-transform">
            <span className="text-3xl drop-shadow-sm">🤔</span>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">
            How do you feel today?
          </h2>
          
          <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
            Choose the mood that best represents you right now.
          </p>

          <div className="flex justify-center gap-3 sm:gap-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 inline-flex">
            {['😭', '😕', '😐', '🙂', '🤩'].map((emoji, index) => (
              <button 
                key={index}
                className="text-4xl sm:text-5xl hover:-translate-y-2 hover:scale-110 transition-all duration-300 cursor-pointer opacity-70 hover:opacity-100 drop-shadow-sm hover:drop-shadow-lg"
              >
                {emoji}
              </button>
            ))}
          </div>

        </div>

      </main>
    </div>
  );
}

export default App;