import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Game from './Game';
import CustomGamePage from './CustomGamePage';
import LoadingScreen from './LoadingScreen';
import './App.css';

function App() {
  return (
    <Router basename="/anniversary">
      <Routes>
        <Route path="/" element={<LoadingScreen />} />
        <Route path="game/" element={<GameWrapper />} />
        <Route path="custom/" element={<CustomGamePage />} />
      </Routes>
    </Router>
  );
}

function GameWrapper() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const custom = params.get('custom');

  return <Game custom={custom} />;
}

export default App;
