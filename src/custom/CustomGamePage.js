import React, { useState, useEffect, useRef } from 'react';
import './CustomGamePage.css';
import ProgressBar from '../ProgressBar';
import FileUploadStep from './FileUploadStep';
import LocationSelectionStep from './LocationSelectionStep';
import CustomizationStep from './CustomizationStep';
import ExifReader from 'exifreader';
import axios from 'axios';
import CopyLinkStep from './CopyLinkStep';
import { Button, Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'

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
  const [customLink, setCustomLink] = useState(null); // Use state variable
  let [isOpen, setIsOpen] = useState(false);

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
  }, [vanta]);

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    if(step === 3 && !hasNullLocation) {
        setStep(1);
    } else {
    setStep(prev => prev - 1);
    }
  };

  const handleFileChange = (files) => {
    console.log("Handle File Change called.")
    setImages(files);
    extractMetadata(files);
  };

  const extractMetadata = (files) => {
    const metaDataArray = [];
    let currentHasNullLocation = false;
  
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
          currentHasNullLocation = true; // Set flag if metadata is null
        })
    );
  
    // Wait for all promises to settle
    Promise.all(promises).then(() => {
      console.log("Metadata Array:", metaDataArray);
      setMetadata(metaDataArray);
      setHasNullLocation(currentHasNullLocation)
      console.log("Has Null Location:", currentHasNullLocation);
      if (currentHasNullLocation) {
        // setShowMap(true);
        setIsOpen(true);
        // setStep(2); // Move to location selection step
      } else {
        // If all metadata is available, move to next step
         setStep(3);
      }
    });
  };
  

  const handleCreateGame = async () => {
    const formData = new FormData();
    images.forEach((image, index) => {
      console.log(`Appending image: ${image.name}`);
      formData.append('images', image, image.name);
    });

    setProgress(3.25)
  
    const metadataArray = metadata.map((data) => ({
      latitude: data.latitude,
      longitude: data.longitude
    }));

    setProgress(3.5)
  
    formData.append('vantaColors', JSON.stringify(vanta));
    formData.append('menuMessage', loadingMessage);
    formData.append('creator', creator);
    formData.append('metadata', JSON.stringify(metadataArray));

    setProgress(3.75)
  
    try {
      console.log('Sending form data to server');
      const response = await axios.post('https://memorymap-4ed7565da8e8.herokuapp.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setProgress(3.95)
  
      console.log('Game created:', response.data); 
      console.log(response.data)
      setCustomLink(response.data); 
      nextStep();
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  function close() {
    setIsOpen(false)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
          {isOpen && (
            <>
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
                            {"One or more of your images had no location data. You will now have to select the location of the image(s) on the map."} <br />
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
            </>
          )}
          <>
            <ProgressBar step={progress} />
            <FileUploadStep handleFileChange={handleFileChange} />
            {/* {step > 1 && (
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300 mt-4">
                Back
              </button>
            )} */}
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
                />
              </div>
            );
      case 3:
        return (
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
                  />
                  {/* <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300 mt-4">
                      Back
                  </button> */}
          </>
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
            <div className="z-50">
              <ProgressBar step={progress} />
              <CopyLinkStep data={customLink} /> {/* Pass data to the CopyLinkStep */}
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
    }
  }


  return (
    <>
      <div ref={vantaRef} className="absolute flex flex-col items-center justify-center min-h-screen w-full h-full -z-50"></div>
      <div className="flex flex-col items-center justify-center min-h-screen w-full h-full z-10">
        <div className={step === 2 ? '' : 'flow-root max-w-[85%] bg-gray-900 bg-opacity-50 rounded-lg p-6 w-full max-w-3xl' }>
          {renderStep()}
          {step > 2 && <button onClick={prevStep} className="float-left px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300 mt-4"
          style={{ backgroundColor: `${buttonColor.toString(16)}` }}>
            Back
          </button>}
          {step !== 2 && step !== 4 &&
          <button onClick={() => {
            if(images.length > 0) {
              if(step === 1 && !hasNullLocation){
                console.log("Moving to step 3!")
                console.log(hasNullLocation)
                setStep(3)
              } else if (!(step === 3 && !customLink)) {
                nextStep()
              }
            }
          }} 
          className="float-right px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300 mt-4"
          style={{ backgroundColor: `${buttonColor.toString(16)}` }}>
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
