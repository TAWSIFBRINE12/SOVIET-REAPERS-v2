import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Rankings from './pages/Rankings';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const newToken = urlParams.get('token');
    if (newToken) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Routes>
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/chat" element={token ? <Chat /> : <Navigate to="/" />} />
          <Route path="/rankings" element={token ? <Rankings /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;