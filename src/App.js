import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Game from './Game';
import CustomGamePage from './CustomGamePage';
import LoadingScreen from './LoadingScreen';
import './App.css';

function App() {
  return (
    <Router basename="/anniversary">
      <Routes>
        <Route path="/" element={<LoadingScreen />} />
        <Route path="game/" element={<Game />} />
        <Route path="custom/" element={<CustomGamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
