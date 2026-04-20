import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MoodJar from './components/MoodJar';
import History from './pages/History'; 
import Welcome from './pages/Welcome';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/60 via-slate-50 to-slate-100">
        <Navbar />
        
        <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
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