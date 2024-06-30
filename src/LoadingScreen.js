import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';

const LoadingScreen = ({ custom }) => {
  const navigate = useNavigate();
  const vantaRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState(null);
  const [vantaEffect, setVantaEffect] = useState([0xff0077,0x841e10,0xff00d1]);
  const [menuMessage, setMenuMessage] = useState("Loading...");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make API call to retrieve game data
        const response = await axios.get(`https://memorymap-4ed7565da8e8.herokuapp.com/game/${custom}`);
        // Assuming the server responds with the game object
        const receivedGameData = response.data;
        // Update state with received game data
        setGameData(receivedGameData);
        console.log("received", receivedGameData)
        setLoading(false); // Set loading to false once data is received
        setVantaEffect(receivedGameData.vantaColors)
      } catch (error) {
        console.error('Error fetching game data:', error);
        setLoading(false); // Set loading to false if an error occurs
      }
      console.log("loaded", loading)
    };

    fetchData();
    console.log("custom", custom)
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
  }, [loading]);



  const handleStart = () => {
    navigate('/game'+(custom ? `?custom=${custom}` : ''));
  };

  return (
    <>
      <div className="loading-container flex flex-col items-center justify-center min-h-screen w-full z--4">
        {loading ? (
          // Show loading circle while data is being fetched
          <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#4fa94d"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
          />
        ) : (
        <>
          <h1 className="text-white text-4xl md:text-6xl lg:text-8xl font-bold mb-4 md:mb-6 lg:mb-8 text-center px-2">
          {custom ? 
            "Memory Map" : 
            "Hailey's Anniverary Game!"
          }
          </h1>
          
          <div className="text-center bg-black bg-opacity-70 p-4 md:p-6 lg:p-8 rounded-lg shadow-lg max-w-[85%]">
            <h2 className="text-white text-lg md:text-2xl lg:text-4xl mb-4">
            {custom ? 
              gameData.menuMessage  : 
              <>
                This game was created for our 2 year anniversary. <br />
                I wanted to make a fun game to capture some of our memories together. <br />
                You'll first be shown a photo, then you can switch between views to select where the photo was taken on the map. <br />
                When you're confident in your answer, press the "Submit Guess" button. You'll be given a score based on how close you were.<br />
                I'm working on making this game publicly available, where you can submit your own photos and share a link to a custom game. <br />
                For now, check it out! <br /> Press the button below to start.
                <br /> - <i>Wesley</i>
              </>
            }
            </h2>
            <button
              onClick={handleStart}
              className="px-3 py-2 md:px-4 md:py-2 lg:px-6 lg:py-3 bg-pink-500 text-4xl text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 transition duration-300"
            >
              Start!
            </button>
          </div>
          {!custom && (
            <Link to="/custom">
              <button className="px-3 py-2 md:px-4 md:py-2 lg:px-6 lg:py-3 bg-pink-500 text-4xl text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
                Create Custom Game
              </button>
            </Link>
          )}
        </>
        )}
      </div>
      <div ref={vantaRef} className="vanta-container"></div>
    </>
  );
};

export default LoadingScreen;
