import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Game from './Game';
import CustomGamePage from './custom/CustomGamePage';
import LoadingScreen from './LoadingScreen';
import './App.css';

function AppRoutes() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const custom = params.get('custom');

  return (
    <Routes>
      <Route path="/" element={<LoadingScreen custom={custom} />} />
      <Route path="game/" element={<Game custom={custom} />} />
      <Route path="custom/" element={<CustomGamePage />} />
    </Routes>
  );
}

function App() {
  return (
    <Router basename="/memorymap">
      <AppRoutes />
    </Router>
  );
}

export default App;
