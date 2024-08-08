import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Game from './Game';
import CustomGamePage from './custom/CustomGamePage';
import LoadingScreen from './LoadingScreen';
import './App.css';
import axios from 'axios';
import { ThreeDots } from 'react-loader-spinner';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';

function App() {
  const [loading, setLoading] = useState(true);
  const [custom, setCustom] = useState(null);
  const [vantaColors, setVantaColors] = useState([process.env.REACT_APP_VANTA_HIGHLIGHT, process.env.REACT_APP_VANTA_MIDTONE, process.env.REACT_APP_VANTA_LOWLIGHT]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  useEffect(() => {
    const location = window.location;
    const params = new URLSearchParams(location.search);
    const customID = params.get('custom');
    console.log("Getting game...", customID);

    const fetchData = async () => {
      try {
        if (customID) {
          const response = await axios.get(`https://memorymap-4ed7565da8e8.herokuapp.com/game/${customID}`);
          const receivedGameData = response.data;
          setCustom(receivedGameData);
          setVantaColors(receivedGameData.vantaColors);
          console.log("received", receivedGameData);
        } else {
          console.log("No customID provided in URL.");
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
        setErrorMessage(error.stack);
        setIsErrorOpen(true);
      } finally {
        console.log("loaded");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function closeErrorPopup() {
    setIsErrorOpen(false);
  }

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <ThreeDots
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            radius="9"
            ariaLabel="three-dots-loading"
          />
        </div>
      ) : (
        <>
          <Router basename="memorymap">
            <Routes>
              <Route path="/" element={<LoadingScreen custom={custom} colors={vantaColors} />} />
              <Route path="game/" element={<Game custom={custom} colors={vantaColors} />} />
              <Route path="custom/" element={<CustomGamePage colors={vantaColors} />} />
            </Routes>
          </Router> 
          {isErrorOpen && (
            <Transition appear show={isErrorOpen}>
              <Dialog as="div" className="relative z-10 focus:outline-none" onClose={closeErrorPopup}>
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
                          Sorry! There was an error accessing the custom game data.
                        </DialogTitle>
                        <p className="mt-2 text-sm/6 text-white/50">
                          {errorMessage}
                        </p>
                        <div className="mt-4">
                          <button
                            className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                            onClick={closeErrorPopup}
                          >
                            Close
                          </button>
                        </div>
                      </DialogPanel>
                    </TransitionChild>
                  </div>
                </div>
              </Dialog>
            </Transition>
          )}
        </>
      )}
    </div>
  );
}

export default App;
