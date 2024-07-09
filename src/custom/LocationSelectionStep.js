import React, { useState, useEffect } from 'react';
import MapView from '../MapView';
import ImageView from '../ImageView';
import LeftButton from '../ui/LeftButton';
import RightButton from '../ui/RightButton';
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
    <div style={{ width: '100vw', height: '100vh' }}> {/* Set parent div dimensions */}
      <CustomLevelProgress 
        index={currentIndex} 
        length={metadata.length}
        positionClasses={isMapView ? 'absolute top-4 right-4 md:absolute md:top-4 md:left-1/2 md:transform md:-translate-x-1/2' : 'absolute top-4 left-1/2 transform -translate-x-1/2' }
      />
      <div style={{ position: 'relative', width: '100vw', height: '100vh' }}> {/* Adjust height as needed */}
        <ImageView image={URL.createObjectURL(metadata[currentIndex].file)} isVisible={!isMapView} />
        <MapView onLocationSelected={setSelectedLocation}  isVisible={isMapView}  />
      </div>
        <LeftButton onClick={switchView} text={"Switch View"} />
        <RightButton onClick={handleSubmit} text={"Submit Location"}/>
    </div>
  );
};

export default LocationSelectionStep;
