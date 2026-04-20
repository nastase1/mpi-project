import Navbar from './components/Navbar';
import MoodJar from './components/MoodJar'; // 1. Importăm componenta noastră

function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/60 via-slate-50 to-slate-100">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
        
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl shadow-indigo-100/40 border border-white p-6 sm:p-10 text-center mt-10 transition-all duration-300">
          
          {/* Am schimbat iconița pentru a se potrivi mai bine cu bolul */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner rotate-3 hover:rotate-0 transition-transform">
            <span className="text-3xl drop-shadow-sm">✨</span>
          </div>

          <h2 className="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">
            Your Mood Jar
          </h2>
          
          <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
            Drop a mood into the jar to see your emotional history.
          </p>

          {/* 2. Am înlocuit div-ul vechi cu emoji-uri cu componenta interactivă */}
          <div className="flex justify-center w-full">
            <MoodJar />
          </div>

        </div>

      </main>

    </div>
  );
}

export default App;