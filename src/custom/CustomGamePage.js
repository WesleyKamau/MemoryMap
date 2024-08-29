import React, { useState, useEffect, useRef } from 'react';
import './CustomGamePage.css';
import ProgressBar from '../ProgressBar';
import FileUploadStep from './FileUploadStep';
import LocationSelectionStep from './LocationSelectionStep';
import CustomizationStep from './CustomizationStep';
import ExifReader from 'exifreader';
import axios from 'axios';
import CopyLinkStep from './CopyLinkStep';
import { Button, Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';

const CustomGamePage = ({colors}) => {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(1);
  const [images, setImages] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [creator, setCreator] = useState('');
  const [vanta, setVanta] = useState(colors);
  const [buttonColor, setButtonColor] = useState(colors[0]);
  const vantaRef = useRef(null);
  const [hasNullLocation,setHasNullLocation] = useState(false);
  const [customLink, setCustomLink] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [nullImageCount, setNullImageCount] = useState(0);

  useEffect(() => {
    setProgress(step);
  }, [step]);

  useEffect(() => {
    const initializeVanta = () => {
      console.log('Initializing Vanta effect');
      const loadVanta = () => {
        if (window.VANTA) {
          window.VANTA.FOG({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            highlightColor: vanta[0],
            midtoneColor: vanta[1],
            lowlightColor: vanta[2],
          });
        }
      };
      if (vantaRef.current) {
        if (window.VANTA) {
          loadVanta();
        } else {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js';
          script.onload = loadVanta;
          document.body.appendChild(script);
        }
      }
    };
    initializeVanta();
  }, [vanta,step]);

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  // const prevStep = () => {
  //   if(step === 3 && !hasNullLocation) {
  //       setStep(1);
  //   } else {
  //       setStep(prev => prev - 1);
  //   }
  // };

  const handleFileChange = (files) => {
    console.log("Handle File Change called.")
    setImages(files);
    extractMetadata(files);
    console.log("Images:", files);
    console.log("Metadata:", metadata);
  };

  const extractMetadata = (files) => {
    const metaDataArray = [];
    let currentHasNullLocation = false;

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
          currentHasNullLocation = true; 
          setNullImageCount(nullImageCount => nullImageCount + 1);
          console.log(nullImageCount);
        })
    );

    Promise.all(promises).then(() => {
      console.log("Metadata Array:", metaDataArray);
      setMetadata(metaDataArray);
      setHasNullLocation(currentHasNullLocation);
      console.log("Has Null Location:", currentHasNullLocation);
      if (currentHasNullLocation) {
        setIsOpen(true);
      } else {
        setStep(3);
      }
    });
  };

  const handleCreateGame = async () => {
    setIsCreating(true); // Start loading state
    const formData = new FormData();
    
    metadata.forEach((data, index) => {
      console.log(`Appending image: ${data.file.name}`);
      formData.append('images', data.file, data.file.name);
    });
  
    setProgress(3.25);
  
    const metadataArray = metadata.map((data) => ({
      latitude: data.latitude,
      longitude: data.longitude
    }));
  
    setProgress(3.5);
  
    formData.append('vantaColors', JSON.stringify(vanta));
    formData.append('menuMessage', loadingMessage);
    formData.append('creator', creator);
    formData.append('metadata', JSON.stringify(metadataArray));
  
    setProgress(3.75);
  
    try {
      console.log('Sending form data to server');
      const response = await axios.post('https://memorymap-4ed7565da8e8.herokuapp.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      setProgress(3.95);
      console.log('Game created:', response.data); 
      setCustomLink(response.data); 
      
      setButtonColor(colors[0]); // Reset button color
      setIsCreating(false); // End loading state
      
      // Wait 0.5 seconds before moving to the next step
      setTimeout(() => {
        nextStep();
      }, 500);
    } catch (error) {
      console.error('Error creating game:', error);
      setError(error);
      setLoadingMessage('Error creating game. Please see the message below.');
      setButtonColor(colors[0]); // Reset button color
      setIsCreating(false); // End loading state
      setIsOpen(true); // Show error popup
    }
  };
  

  function close() {
    setIsOpen(false);
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            {isOpen && (
              <Transition appear show={isOpen}>
                <Dialog as="div" className="relative z-10 focus:outline-none" onClose={close}>
                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                      <TransitionChild
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 transform-[scale(95%)]"
                        enterTo="opacity-100 transform-[scale(100%)]"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 transform-[scale(100%)]"
                        leaveTo="opacity-0 transform-[scale(95%)]"
                      >
                        <DialogPanel className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl">
                          <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                            GPS Data Missing
                          </DialogTitle>
                          <p className="mt-2 text-sm/6 text-white/50">
                            {nullImageCount === 1 ?
                              <>1 image had no location data. </> 
                            : 
                              <>{nullImageCount} images had no location data. </>
                            }
                            You will now have to select the location of the image(s) on the map. <br />
                            First you'll be shown the photo, then you can switch between views to select where the photo was taken.
                          </p>
                          <div className="mt-4">
                            <Button
                              className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                              onClick={() => {
                                close();
                                setStep(2);
                              }}
                            >
                              Got it, thanks!
                            </Button>
                          </div>
                        </DialogPanel>
                      </TransitionChild>
                    </div>
                  </div>
                </Dialog>
              </Transition>
            )}
            <>
              <ProgressBar step={progress} />
              <FileUploadStep handleFileChange={handleFileChange} />
            </>
          </>
        );
      case 2:
          return (
            <div>
              <LocationSelectionStep
                metadata={metadata}
                setMetadata={setMetadata}
                completeStep={nextStep}
                nullCount={nullImageCount}
              />
            </div>
          );
      case 3:
        return (
          <>
            {isOpen && (
              <Transition appear show={isOpen}>
                <Dialog as="div" className="relative z-10 focus:outline-none" onClose={close}>
                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                      <TransitionChild
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 transform-[scale(95%)]"
                        enterTo="opacity-100 transform-[scale(100%)]"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 transform-[scale(100%)]"
                        leaveTo="opacity-0 transform-[scale(95%)]"
                      >
                        <DialogPanel className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl">
                          <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                            There was an error. Please screenshot this message and send it to Wesley.
                          </DialogTitle>
                          <p className="mt-2 text-sm/6 text-white/50">
                            {error?.message}
                          </p>
                          <p className="mt-2 text-sm/6 text-red-400">
                            {error?.stack || "An unexpected error occurred."}
                          </p>
                          <div className="mt-4">
                            <Button
                              className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                              onClick={close}
                            >
                              Close
                            </Button>
                          </div>
                        </DialogPanel>
                      </TransitionChild>
                    </div>
                  </div>
                </Dialog>
              </Transition>
            )}
            <>
              <ProgressBar step={progress} />
              <CustomizationStep
                setLoadingMessage={setLoadingMessage}
                setCreator={setCreator}
                vanta={vanta}
                setVanta={setVanta}
                buttonColor={buttonColor}
                setButtonColor={setButtonColor}
                handleCreateGame={handleCreateGame}
                isCreating={isCreating}
              />
            </>
          </>
        );
      case 4:
        return (
          <div className="z-50">
            <ProgressBar step={progress} />
            <CopyLinkStep data={customLink} />
          </div>
        );
      default:
        // Do Nothing
    }
  };

  const tip = () => {
    switch(step){
      case 1:
        return <>
          Upload images to create a custom memory map. <br /> 
          The location data will be extracted from these images if possible, and the rest will be manually selected. <br /> 
          The whole point of the game is to guess where these photos were taken, so choose a variety of locations and memories!
        </>
      case 3:
        return <>
          Customize your loading screen. <br />
          Your name and the loading message will be displayed on the loading screen, and the colors you select will apply throughout the game.
        </>
      case 4:
        return <>
          You can also play the game yourself by clicking the link. I'll add a leaderboard later.
        </>
      default:
        // Do nothing
    }
  };

  return (
    <>
      {step !== 2 && <div ref={vantaRef} className="absolute flex flex-col items-center justify-center min-h-screen w-full h-full -z-50"></div>}
      <div className="flex flex-col items-center justify-center min-h-screen w-full h-full z-10">
        <div className={step === 2 ? '' : 'flow-root max-w-[85%] bg-gray-900 bg-opacity-50 rounded-lg p-6 w-full max-w-3xl' }>
          {renderStep()}
          {step !== 2 && step !== 4 &&
          <button onClick={() => {
            if(images.length > 0) {
              if(step === 1 && !hasNullLocation){
                console.log("Moving to step 3!")
                console.log(hasNullLocation)
                setStep(3)
              } else if (step === 3) {
                handleCreateGame()
              } else {
                nextStep()
              }
            }
          }} 
          className={`float-right px-4 py-2 font-semibold rounded-lg shadow-md transition duration-300 mt-4 ${
            isCreating ? 'bg-gray-400' : 'bg-gray-500 hover:bg-gray-600 text-white'
          }`}
          style={{ backgroundColor: isCreating ? '#cccccc' : `${buttonColor.toString(16)}` }}>
            Next
          </button>}
        </div>
        {step !== 2 &&
        <h1 className="text-center bg-gray-900 bg-opacity-70 p-4 md:p-6 lg:p-8 rounded-lg shadow-lg max-w-[85%] text-white text-xs md:text-xl">
          {tip()}
        </h1>}
      </div>
    </>
  );  
};

export default CustomGamePage;
