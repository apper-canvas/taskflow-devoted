import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { getIcon } from './utils/iconUtils';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage or user preference
    if (localStorage.getItem('darkMode') === 'true') return true;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Update body class when darkMode changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  
  const SunIcon = getIcon('sun');
  const MoonIcon = getIcon('moon');

  return (
    <div className="min-h-screen">
      {/* Dark Mode Toggle */}
      <button 
        onClick={toggleDarkMode}
        className="fixed z-20 bottom-5 right-5 p-3 rounded-full neu-light"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
      </button>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
        toastClassName="rounded-lg text-sm font-medium"
      />
    </div>
  );
}

export default App;