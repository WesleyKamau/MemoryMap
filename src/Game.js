import React, { useState, useEffect } from 'react';
import Scoreboard from './Scoreboard';
import SwitchViewButton from './ui/SwitchViewButton';
import SubmitGuessButton from './ui/SubmitGuessButton';
import ContinueButton from './ui/ContinueButton';
import ImageView from './ImageView';
import MapView from './MapView';
import data from './images.json';
import GameOverScreen from './GameOverScreen'; // Import the GameOverScreen component
import scoreData from './scores.json'; // Import the JSON file
import axios from 'axios';
import { Buffer } from 'buffer';

function Game({custom}) {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(0); // State for the current level
  const [isMapView, setIsMapView] = useState(false); // State for toggling between image and map views
  const [guessSubmitted, setGuessSubmitted] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null); // State to store selected location from MapView
  const [secondMarkerPosition, setSecondMarkerPosition] = useState(null);
  const [isGameOver, setGameOver] = useState(false); // Track game over state
  const [gameData, setGameData] = useState(null);
  const [currentLevelData, setCurrentLevelData] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const switchView = () => {
    setIsMapView(prevIsMapView => !prevIsMapView); // Toggle between image and map views
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make API call to retrieve game data
        const response = await axios.get(`http://localhost:8080/game/${custom}`);
        // Assuming the server responds with the game object
        const receivedGameData = response.data;
        console.log("received", receivedGameData);
        return receivedGameData.images;
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };

    const initializeData = async () => {
      if (custom == null || custom == undefined) {
        console.log("custom is null or undefined");
        setGameData(data);
        setCurrentLevelData(data[level]);
        
      } else {
        const fetchedGameData = await fetchData();
        console.log("fetched", fetchedGameData);
        setGameData(fetchedGameData);
        if (fetchedGameData && fetchedGameData[level]) {
          // const imageData = await getImage(fetchedGameData[level].fileId);
          setCurrentLevelData(fetchedGameData[level]);
          setCurrentImage("http://localhost:8080/image/" + fetchedGameData[level].fileId);
        }
        console.log("custom is not null or undefined");
      }
      setLoading(false);
    };

    initializeData();
  }, [custom, data, level]);

  // useEffect(() => {
  //   let audio = new Audio('music.mp3');
  //   audio.loop = true; // Loop the music
  //   audio.volume = 0; // Start volume at 0

  //   const increaseVolume = () => {
  //     let volume = 0;
  //     const interval = setInterval(() => {
  //       volume += 0.004; // Increase volume by 0.004 every second
  //       if (volume >= 0.3) {
  //         volume = 0.3;
  //         clearInterval(interval);
  //       }
  //       audio.volume = volume;
  //     }, 1000);
  //   };

  //   const playAudio = () => {
  //     audio.play().then(() => {
  //       increaseVolume();
  //     }).catch(error => {
  //       console.error('Audio playback failed:', error);
  //     });
  //   };

  //   // Attach event listener for user interaction
  //   const handleUserInteraction = () => {
  //     playAudio();
  //     document.removeEventListener('click', handleUserInteraction);
  //   };

  //   document.addEventListener('click', handleUserInteraction);

  //   return () => {
  //     if (audio) {
  //       audio.pause();
  //       audio = null;
  //     }
  //     document.removeEventListener('click', handleUserInteraction);
  //   };
  // }, []);

  const calculateScore = () => {
    if (selectedLocation) {
      const actualLocation = {
        latitude: currentLevelData.latitude,
        longitude: currentLevelData.longitude
      };

      // Calculate distance between selected location and actual location
      const distance = calculateDistance(selectedLocation, actualLocation);
    
      console.log(`Distance: ${distance} km`);
      // Define scoring mechanism based on distance
      // For example, add points for being closer to the actual location
      // You can adjust these values to fit your game's logic
      let scoreChange = 0;
      scoreData.distances.forEach(entry => {
        if (distance < entry.value) {
          if (entry.score > scoreChange) {
            scoreChange = entry.score;
          }
        }
      });

      // Update score by adding the score change
      const newScore = score + scoreChange;
      setScore(newScore);
    }
  };

  // Function to calculate distance between two points using Haversine formula
  const calculateDistance = (point1, point2) => {
    const earthRadiusKm = 6371; // Radius of the Earth in kilometers
    const deg2rad = (deg) => deg * (Math.PI / 180); // Function to convert degrees to radians
  
    const lat1Rad = deg2rad(point1.latitude);
    const lon1Rad = deg2rad(point1.longitude);
    const lat2Rad = deg2rad(point2.latitude);
    const lon2Rad = deg2rad(point2.longitude);
  
    const deltaLat = lat2Rad - lat1Rad;
    const deltaLon = lon2Rad - lon1Rad;
  
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1Rad) * Math.cos(lat2Rad) *
              Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    console.log("c: ", c);
  
    const distance = earthRadiusKm * c; // Distance in kilometers
    return distance;
  };

  const submitGuess = () => {
    if (selectedLocation !== null) {
      createSecondMarkerAndLine(currentLevelData.latitude, currentLevelData.longitude);
      // Implement guess submission logic
      // Calculate score and show street view
      calculateScore();

      setGuessSubmitted(true);
    }
  };

  const continueToNextLevel = () => {
    // If there are more levels, increment the level state
    if (level < gameData.length - 1) {
      setLevel(prevLevel => prevLevel + 1);
      setIsMapView(false); // Reset view to image
      setGuessSubmitted(false); // Reset guessSubmitted state
      setSelectedLocation(null);
      setSecondMarkerPosition(null);
    } else {
      gameOver(); // Call gameOver function if there are no more levels
    }
  };

  const gameOver = () => {
    // Implement game over logic
    console.log('Game Over');
    // You can perform any actions you want when the game is over
    setGameOver(true);
  };

  const createSecondMarkerAndLine = (lat, lng) => {
    console.log("Creating second marker and line");
    console.log(lat, lng);
    setSecondMarkerPosition({ lat, lng });
  };

  return (
    <div style={{ width: '100%', height: '100%' }}> {/* Set parent div dimensions */}
      {loading ? (
          <div>Loading...</div>
      ) : (
        <>
          {isGameOver ? (
            // Render GameOverScreen component if game is over
            <GameOverScreen score={score} />
          ) : (
            <>
              <Scoreboard 
                score={score} 
                level={level} 
                totalLevels={gameData.length} 
                positionClasses={isMapView ? 'absolute top-4 right-4 md:absolute md:top-4 md:left-1/2 md:transform md:-translate-x-1/2' : 'absolute top-4 left-1/2 transform -translate-x-1/2'} 
              />
              <div style={{ position: 'relative', width: '100%', height: '100%' }}> {/* Adjust height as needed */}
                <ImageView image={"http://localhost:8080/image/" + gameData[level].fileId} isVisible={!isMapView} />
                <MapView onLocationSelected={setSelectedLocation} secondMarkerPosition={secondMarkerPosition} isVisible={isMapView} />
              </div>
              {!guessSubmitted && <SwitchViewButton onClick={switchView} />}
              {!guessSubmitted && <SubmitGuessButton onClick={submitGuess} />}
              {guessSubmitted && <ContinueButton onClick={continueToNextLevel} />}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Game;
