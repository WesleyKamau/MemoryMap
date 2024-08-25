import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoadingScreen = ({ custom, colors }) => {
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
          highlightColor: colors[0],
          midtoneColor: colors[1],
          lowlightColor: colors[2],
        });
      }
    };

    console.log(colors);

    if (colors && window.VANTA) {
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
  });

  const handleStart = () => {
    navigate('/game' + (custom ? `?custom=${custom.gameId}` : ''));
  };

  return (
    <>
      <div className="loading-container flex flex-col items-center justify-center min-h-screen w-full z--4">
        <h1 className="bg-black bg-opacity-70 px-2 py-4 lg:py-8 lg:px-4 rounded-lg text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 lg:mb-8 text-center px-2">
          MemoryMap
        </h1>

        <div className="text-center bg-black bg-opacity-70 p-4 md:p-6 lg:p-8 rounded-lg shadow-lg max-w-[85%]">
          <h2 className="text-white text-xs md:text-base lg:text-2xl mb-4">
            {custom ?
              <>
              {custom.menuMessage.length !== 0 ? 
              <>
                Custom message: <br /> <br />
                <blockquote>
                  {custom.menuMessage} 
                </blockquote>
                
                <br /> <br />

                You'll first be shown a photo, then you can switch between views to select where the photo was taken on the map. <br />
                When you're confident in your answer, press the "Submit Guess" button. You'll be given a score based on how close you were.<br />
              </>
              :
              <>
                This game was custom created for you! <br />
                You'll first be shown a photo, then you can switch between views to select where the photo was taken on the map. <br />
                When you're confident in your answer, press the "Submit Guess" button. You'll be given a score based on how close you were.<br />
                Have fun! <br /> Press the button below to start.
                <br /> - <i>Wesley</i>
              </>}
              </> :
              <>
                This game was created for our 2 year anniversary. <br />
                I wanted to make a fun game to capture some of our memories together. <br />
                You'll first be shown a photo, then you can switch between views to select where the photo was taken on the map. <br />
                When you're confident in your answer, press the "Submit Guess" button. You'll be given a score based on how close you were.<br />
                {/* I'm working on making this game publicly available, where you can submit your own photos and share a link to a custom game. <br /> */}
                For now, check it out! <br /> Press the button below to start, and the button under it if you'd like to create your own game.
                <br /> - <i>Wesley</i>
              </>
            }
          </h2>
          <button
            onClick={handleStart}
            className="px-3 py-2 md:px-4 md:py-2 lg:px-6 lg:py-3 text-2xl md:text-3xl lg:text-4xl text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 transition duration-300"
            style={{ backgroundColor: `${colors[0].toString(16)}` }}
          >
            Start!
          </button>
        </div>
        {!custom ? (
          <Link to="/custom">
            <button className="px-3 py-2 md:px-4 md:py-2 lg:px-6 lg:py-3 bg-pink-500 text-2xl md:text-3xl lg:text-4xl text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            style={{ backgroundColor: `${colors[0].toString(16)}` }}>
              Create Custom Game
            </button>
          </Link>
        ) :
        <>
          {custom.creator && (
          <h1 className="text-center bg-black bg-opacity-70 p-2 md:p-6 lg:p-8 rounded-lg shadow-lg max-w-[85%] text-white text-lg md:text-2xl lg:text-4xl mb-1">
            This custom game was created by {custom.creator}! <br />
          </h1>)}
        </>
        }
        <h1 className="text-center bg-black bg-opacity-70 p-2 md:p-6 lg:p-8 rounded-lg shadow-lg max-w-[85%] text-white text-md md:text-xl lg:text-3xl mb-1">
          This game was made with love by Wesley Kamau.
        </h1>
      </div>
      <div ref={vantaRef} className="vanta-container"></div>
    </>
  );
};

export default LoadingScreen;
