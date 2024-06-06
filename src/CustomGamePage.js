import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import WAVES from 'vanta/dist/vanta.waves.min';
import './CustomGamePage.css';
import ProgressBar from './ProgressBar';
import FileUploadStep from './FileUploadStep';
import LocationSelectionStep from './LocationSelectionStep';
import CustomizationStep from './CustomizationStep';
import ExifReader from 'exifreader';
import CustomLevelProgress from './CustomLevelProgress';
import axios from 'axios';
import CopyLinkStep from './CopyLinkStep';

const CustomGamePage = () => {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [vantaHighlight, setVantaHighlight] = useState('#ff0077');
  const [vantaMidtone, setVantaMidtone] = useState('#841e10');
  const [vantaLowlight, setVantaLowlight] = useState('#ff00d1');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();
  const vantaRef = useRef(null);
  let hasNullLocation = false;
  const [customLink, setCustomLink] = useState(null); // Use state variable

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
          highlightColor: vantaHighlight,
          midtoneColor: vantaMidtone,
          lowlightColor: vantaLowlight,
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
  }, [vantaHighlight, vantaMidtone, vantaLowlight]);

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    if(step === 3 && !hasNullLocation) {
        setStep(1);
    }else {
    setStep(prev => prev - 1);
    }
  };

  const handleFileChange = (files) => {
    setImages(files);
    extractMetadata(files);
  };

  const extractMetadata = (files) => {
    const metaDataArray = [];
    hasNullLocation = false;
  
    // Map each file to an array of promises
    const promises = files.map(file =>
      ExifReader.load(file, { expanded: true })
        .then(result => {
          const gps = result.gps;
          metaDataArray.push({
            file,
            latitude: gps.Latitude,
            longitude: gps.Longitude,
          });
        })
        .catch(error => {
          console.log("Error loading GPS data:", error);
          metaDataArray.push({
            file,
            latitude: null,
            longitude: null,
          });
          hasNullLocation = true; // Set flag if metadata is null
        })
    );
  
    // Wait for all promises to settle
    Promise.all(promises).then(() => {
      console.log("Metadata Array:", metaDataArray);
      setMetadata(metaDataArray);
      console.log("Has Null Location:", hasNullLocation);
      if (hasNullLocation) {
        setShowMap(true);
        setStep(2); // Move to location selection step
      } else {
        // If all metadata is available, move to next step
         setStep(3);
      }
    });
  };
  
  

  const handleLocationSelect = (location) => {
    const updatedMetadata = [...metadata];
    updatedMetadata[currentImageIndex].location = location;
    setMetadata(updatedMetadata);

    if (currentImageIndex < metadata.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setShowMap(false);
      nextStep();
    }
  };

  const handleCreateGame = async () => {
    const formData = new FormData();
    images.forEach((image, index) => {
      console.log(`Appending image: ${image.name}`);
      formData.append('images', image, image.name);
    });
  
    const metadataArray = metadata.map((data) => ({
      latitude: data.latitude,
      longitude: data.longitude
    }));
  
    formData.append('vantaColors', JSON.stringify([vantaHighlight, vantaMidtone, vantaLowlight]));
    formData.append('menuMessage', loadingMessage);
    formData.append('metadata', JSON.stringify(metadataArray));
  
    try {
      console.log('Sending form data to server');
      const response = await axios.post('http://localhost:8080/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      console.log('Game created:', response.data); 
      console.log(response.data)
      setCustomLink(response.data); 
      nextStep();
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };


  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div ref={vantaRef} className="flex flex-col items-center justify-center min-h-screen w-full">
              <div className="bg-gray-900 bg-opacity-50 rounded-lg p-6 w-full max-w-3xl">
                  <ProgressBar step={step} />
                  <FileUploadStep handleFileChange={handleFileChange} />
                  {step > 1 && (
                  <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300 mt-4">
                      Back
                  </button>
                  )}
              </div>
          </div>
        );
      case 2:
        return (
            <>
                <LocationSelectionStep
                    metadata={metadata}
                    setMetadata={setMetadata}
                    completeStep={nextStep}
                />
            </>
            );
      case 3:
        return (
          <div ref={vantaRef} className="flex flex-col items-center justify-center min-h-screen w-full">
              <div className="bg-gray-900 bg-opacity-50 rounded-lg p-6 w-full max-w-3xl">
                  <ProgressBar step={step} />
                  <CustomizationStep
                  loadingMessage={loadingMessage}
                  setLoadingMessage={setLoadingMessage}
                  vantaHighlight={vantaHighlight}
                  setVantaHighlight={setVantaHighlight}
                  vantaMidtone={vantaMidtone}
                  setVantaMidtone={setVantaMidtone}
                  vantaLowlight={vantaLowlight}
                  setVantaLowlight={setVantaLowlight}
                  handleCreateGame={handleCreateGame}
                  />
                  <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300 mt-4">
                      Back
                  </button>
              </div>
          </div>
          // <CustomizationStep
          //   loadingMessage={loadingMessage}
          //   setLoadingMessage={setLoadingMessage}
          //   vantaColor={vantaColor}
          //   setVantaColor={setVantaColor}
          //   handleCreateGame={handleCreateGame}
          // />
        );
      case 4: // 3. Add a new case for the CopyLinkStep
        return (
          <div ref={vantaRef} className="flex flex-col items-center justify-center min-h-screen w-full">
            <div className="bg-gray-900 bg-opacity-50 rounded-lg p-6 w-full max-w-3xl">
              <ProgressBar step={step} />
              <CopyLinkStep data={customLink} /> {/* Pass data to the CopyLinkStep */}
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300 mt-4">
                Back
              </button>
            </div>
          </div>
        );
      default:
        // Do Nothing
    }
  };

  return (
        renderStep()
  );
};

export default CustomGamePage;
