import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MoodJar from './components/MoodJar';
import History from './pages/History'; 
import Welcome from './pages/Welcome';

function App() {
  return (
    <Router>
      {/* Main wrapper: 
        Setăm fontul implicit, interzicem overflow-ul orizontal pentru background-uri 
        și personalizăm culoarea de selecție a textului 
      */}
      <div className="relative min-h-screen bg-slate-50/50 text-slate-800 font-sans selection:bg-indigo-200 selection:text-indigo-900 overflow-x-hidden">
        
        <div className="fixed inset-0 w-full h-full pointer-events-none -z-10">
          {/* Lumina de sus-stânga (Indigo) */}
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-400/20 blur-[120px]" />
          
          {/* Lumina de jos-dreapta (Violet) */}
          <div className="absolute top-[50%] right-[-10%] w-[40vw] h-[50vw] rounded-full bg-violet-400/20 blur-[120px]" />
          
          {/* Lumina de accent cald (Galben pastelat) */}
          <div className="absolute top-[20%] left-[50%] w-[30vw] h-[30vw] rounded-full bg-amber-300/10 blur-[100px]" />
          
          {/* Noise texture removed - was causing 404 errors */}
        </div>

        <Navbar />
        
        <main className="relative max-w-5xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center min-h-[calc(100vh-80px)]">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/jar" element={<MoodJar />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
        
      </div>
    </Router>
  );
}

export default App;