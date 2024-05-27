import React, { useEffect, useRef } from 'react';

const GameOverScreen = ({score}) => {
  const vantaRef = useRef(null);

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
          highlightColor: 0xff0077,
          midtoneColor: 0x841e10,
          lowlightColor: 0xff00d1,
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
  }, []);

  // Handle navigation to game screen
  const navigateToGame = () => {
    window.location.reload();
  };

  return (
    <div ref={vantaRef} className="flex items-center justify-center min-h-screen w-full">
      <div className="text-center bg-gray-900 bg-opacity-80 rounded-lg p-8">
        <h1 className="text-white text-6xl mb-8">Thank you for playing!!!</h1>
        <h3 className="text-white text-3xl">Final Score: {score}</h3>
        <button onClick={navigateToGame} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-8">
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;
