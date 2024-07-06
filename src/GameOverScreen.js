import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const GameOverScreen = ({score, custom}) => {
  const vantaRef = useRef(null);
  const navigate = useNavigate();
  const [vantaEffect, setVantaEffect] = useState([0xff0077,0x841e10,0xff00d1]);
  const [menuMessage, setMenuMessage] = useState("Loading...");

  useEffect(() => {
    if (custom) {
      setVantaEffect(custom.vantaColors);
    }
  }, []);

  useEffect(() => {
    const loadVanta = () => {
      if (window.VANTA) {
        window.VANTA.FOG({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          highlightColor: vantaEffect[0],
          midtoneColor: vantaEffect[1],
          lowlightColor: vantaEffect[2],
        });
      }
    };

    if (window.VANTA) {
      loadVanta();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js';
      script.onload = loadVanta;
      document.body.appendChild(script);
    }

    return () => {
      if (vantaRef.current && vantaRef.current.vantaEffect) {
        vantaRef.current.vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  // Add some lovey dovey stuff here.
  // Handle navigation to game screen
  const navigateToGame = () => {
    window.location.reload();
  };
 
  return (
    <div ref={vantaRef} className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="text-center bg-black bg-opacity-70 p-4 md:p-6 lg:p-8 rounded-lg shadow-lg max-w-[85%]">
        <h1 className="text-white text-5xl mb-8">Thank you for playing!!!</h1>
        <h3 className="text-white text-4xl">Final Score: {score}</h3>
        <button onClick={navigateToGame} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-8"
        style={{ backgroundColor: `${vantaEffect[0].toString(16)}` }}>
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
