import React, { useState, useEffect } from 'react';
import MapView from './MapView';
import ImageView from './ImageView';
import SwitchViewButton from './SwitchViewButton';
import SubmitGuessButton from './SubmitGuessButton';
import CustomLevelProgress from './CustomLevelProgress';

const LocationSelectionStep = ({ metadata, setMetadata, completeStep }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isMapView, setIsMapView] = useState(false); // State for toggling between image and map views

  useEffect(() => {
    const index = metadata.findIndex(item => item.latitude === null || item.longitude === null);
    setCurrentIndex(index);
  }, [metadata, completeStep]);

  const switchView = () => {
    setIsMapView(prevIsMapView => !prevIsMapView); // Toggle between image and map views
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleSubmit = () => {
    if (selectedLocation) {
      const updatedMetadata = [...metadata];
      updatedMetadata[currentIndex].latitude = selectedLocation.latitude;
      updatedMetadata[currentIndex].longitude = selectedLocation.longitude;
      setMetadata(updatedMetadata);
      console.log("Metadata updated:", updatedMetadata);

      const nextIndex = updatedMetadata.findIndex((item, index) => index > currentIndex && (item.latitude === null || item.longitude === null));
      if (nextIndex !== -1) {
        setCurrentIndex(nextIndex);
        setSelectedLocation(null); // Reset selected location
        switchView(); // Switch to image view
      } else {
        completeStep();
      }
    }
  };

  if (currentIndex === -1) {
    return null; // Render nothing if all locations are selected
  }


  return (
    <div style={{ width: '100%', height: '100%' }}> {/* Set parent div dimensions */}
        <CustomLevelProgress 
                index={currentIndex} 
                length={metadata.length}
                positionClasses={'absolute top-4 right-4 md:absolute md:top-4 md:left-1/2 md:transform md:-translate-x-1/2' }
                />
          <div style={{ position: 'relative', width: '100%', height: '100%' }}> {/* Adjust height as needed */}
            <ImageView image={URL.createObjectURL(metadata[currentIndex].file)} isVisible={!isMapView} />
            <MapView onLocationSelected={setSelectedLocation}  isVisible={isMapView} />
          </div>
            <SwitchViewButton onClick={switchView} />
            <SubmitGuessButton onClick={handleSubmit} />
    </div>
  );
};

export default LocationSelectionStep;
