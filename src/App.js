import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Game from './Game';
import CustomGamePage from './custom/CustomGamePage';
import LoadingScreen from './LoadingScreen';
import './App.css';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';

function App() {
  const [loading, setLoading] = useState(true);
  const [custom, setCustom] = useState(null);

  useEffect(() => {
    const location = window.location;
    const params = new URLSearchParams(location.search);
    const customID = params.get('custom');
    console.log("Getting game...", customID)

    const fetchData = async () => {
      try {
        if (customID) {
          const response = await axios.get(`https://memorymap-4ed7565da8e8.herokuapp.com/game/${customID}`);
          const receivedGameData = response.data;
          setCustom(receivedGameData);
          console.log("received", receivedGameData);
        } else {
          console.log("No customID provided in URL.");
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
      } finally {
        console.log("loaded")
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
    {loading ? (
      <div className="flex items-center justify-center h-screen">
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#4fa94d"
          radius="9"
          ariaLabel="three-dots-loading"
        />
      </div>
    ) : (
      <Router basename="/memorymap">
          <Routes>
            <Route path="/" element={<LoadingScreen custom={custom} />} />
            <Route path="game/" element={<Game custom={custom} />} />
            <Route path="custom/" element={<CustomGamePage />} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;