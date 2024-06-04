import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoadingScreen = () => {
  const navigate = useNavigate();
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

  const handleStart = () => {
    navigate('/game');
  };

  return (
    <div ref={vantaRef} className="flex flex-col items-center justify-center min-h-screen w-full">
      <h1 className="text-white text-4xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-6 lg:mb-8 text-center px-2">
        Hailey's Anniversary Game
      </h1>
      <div className="text-center bg-black bg-opacity-70 p-4 md:p-6 lg:p-8 rounded-lg shadow-lg max-w-[85%]">
        <h2 className="text-white text-lg md:text-2xl lg:text-4xl mb-4">
          Welcome to your game, Hailey!
          <br />
          I wanted to make a fun game to capture some of our memories together. <br /> I hope you enjoy it!
          Try your best, and have fun! <br /> Press the button below to start.
          <br />
          I love you! ❤️ - <i>Wesley</i>
        </h2>
        <button
          onClick={handleStart}
          className="px-3 py-2 md:px-4 md:py-2 lg:px-6 lg:py-3 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 transition duration-300"
        >
          Start!
        </button>
      </div>
      <Link to="/custom">
        <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
          Create Custom Game
        </button>
      </Link>
    </div>
  );
};

export default LoadingScreen;
