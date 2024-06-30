import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomGamePage.css';
import ProgressBar from '../ProgressBar';
import FileUploadStep from './FileUploadStep';
import LocationSelectionStep from './LocationSelectionStep';
import CustomizationStep from './CustomizationStep';
import ExifReader from 'exifreader';
import CustomLevelProgress from './CustomLevelProgress';
import axios from 'axios';
import CopyLinkStep from './CopyLinkStep';
import { Button, Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'

const CustomGamePage = () => {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [vantaHighlight, setVantaHighlight] = useState(process.env.REACT_APP_VANTA_HIGHLIGHT);
  const [vantaMidtone, setVantaMidtone] = useState(process.env.REACT_APP_VANTA_MIDTONE);
  const [vantaLowlight, setVantaLowlight] = useState(process.env.REACT_APP_VANTA_LOWLIGHT);
  const [showMap, setShowMap] = useState(false);
  const vantaRef = useRef(null);
  let hasNullLocation = false;
  const [customLink, setCustomLink] = useState(null); // Use state variable
  let [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const initializeVanta = () => {
      console.log('Initializing Vanta effect');
      console.log(vantaRef.current);
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

  function open() {
    setIsOpen(true)
  }

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
                            One or more of your images had no location data. You will now have to select the location of the image on the map.
                          </p>
                          <div className="mt-4">
                            <Button
                              className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                              onClick={() => {
                                close();
                                setStep(2);
                                setShowMap(true);
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
                <div className="bg-gray-900 bg-opacity-50 rounded-lg p-6 w-full max-w-3xl">
                    <ProgressBar step={step} />
                    <FileUploadStep handleFileChange={handleFileChange} />
                    {step > 1 && (
                    <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300 mt-4">
                        Back
                    </button>
                    )}
                </div>
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
            <div className="bg-gray-900 bg-opacity-50 rounded-lg p-6 w-full max-w-3xl z-50">
              <ProgressBar step={step} />
              <CopyLinkStep data={customLink} /> {/* Pass data to the CopyLinkStep */}
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition duration-300 mt-4">
                Back
              </button>
            </div>
        );
      default:
        // Do Nothing
    }
  };


  return (
    <>
      {step !== 2 && <div ref={vantaRef} className="absolute flex flex-col items-center justify-center min-h-screen w-full h-full -z-50"></div>}
      <div className="flex flex-col items-center justify-center min-h-screen w-full h-full z-10">
          {renderStep()}
      </div>
    </>
  );  

};

export default CustomGamePage;
