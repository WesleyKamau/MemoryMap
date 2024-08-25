import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, Polyline, useJsApiLoader, Circle, OverlayView } from '@react-google-maps/api';
import scoresData from './scores.json';
import ToggleLandmarksButton from './ui/ToggleLandmarksButton';

const starpin = "pins/starpin.png"; // Add the path to the star image
const pin = "pins/pin.png" // Add the path to the star image




const markerSize = {
  width: 55 , // Adjust the width of the marker
  height: 95 , // Adjust the height of the marker
};

function MapView({ onLocationSelected, isVisible, secondMarkerPosition, isCustomGame, mapOptions, inCustom}) {

  const customMapStyles = [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: inCustom ? 'on' : 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'administrative',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ];

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  const [showLandmarks, setShowLandmarks] = useState(true);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [showPath, setShowPath] = useState(true);
  const [showOverlays, setShowOverlays] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    console.log("Second Marker Position: ", secondMarkerPosition);
    if (secondMarkerPosition === null || secondMarkerPosition === undefined) {
      setMarkerPosition(null);
      setShowPath(false);
    } else {
      setShowPath(true);
    }

    if(isCustomGame === undefined){
      isCustomGame = false;
    }
  }, [secondMarkerPosition]);

  const handleMapClick = (e) => {
    if (!showPath) {
      setMarkerPosition({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
      onLocationSelected({ latitude: e.latLng.lat(), longitude: e.latLng.lng() });
    }
  };

  const toggleLandmarks = () => {
    setShowLandmarks((prev) => !prev);
  };

  const handleZoomChanged = () => {
    if (mapRef.current) {
      const zoomLevel = mapRef.current.getZoom();
      console.log('Zoom Level:', zoomLevel);
      setShowOverlays(zoomLevel >= 15); // Adjust the zoom level condition as needed
    }
    console.log("showPath: ", showPath, "showOverlays: ", showOverlays);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', zIndex: '0', display: isVisible ? 'block' : 'none' }}>
      {!showPath && !isCustomGame &&  (
        <ToggleLandmarksButton onClick={toggleLandmarks}  showLandmarks={showLandmarks}/>
      )}
      {isLoaded ? (
        <>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={mapOptions.center}
            zoom={mapOptions.zoom}
            options={{
              styles: showLandmarks ? customMapStyles : [],
              mapTypeControl: true,
              disableDefaultUI: true, // Disable default UI
            }}
            onClick={handleMapClick}
            onZoomChanged={handleZoomChanged}
            onLoad={(map) => (mapRef.current = map)}
          >
            {markerPosition && (
              <Marker
                position={markerPosition}
                icon={{
                  url: pin,
                  scaledSize: markerSize, // Set the size of the marker
                }}
              />
            )}
            {markerPosition && secondMarkerPosition && (
              <>
                <Marker
                  position={secondMarkerPosition}
                  icon={{
                    url: starpin,
                    scaledSize: markerSize, // Set the size of the marker
                  }}
                  key={secondMarkerPosition}
                />
                <Polyline
                  path={[markerPosition, secondMarkerPosition]}
                  options={{
                    strokeColor: "#FF69B4", // Pink color
                    strokeOpacity: 1,
                    strokeWeight: 3,
                    visible: showPath,
                  }}
                />
                {scoresData.distances
                  .filter((distanceData) => distanceData.value < 4) // Filter distances under 4 km
                  .map((distanceData, index) => {
                    // Calculate the position of the overlayView vertically away from the markerPosition
                    const distanceFromMarker = distanceData.value * 1000; // Convert kilometers to meters
                    const angle = Math.PI / 2; // 90 degrees
                    const offsetX = distanceFromMarker * Math.cos(angle);
                    const offsetY = distanceFromMarker * Math.sin(angle);
                    const position = {
                      lat: secondMarkerPosition.lat + (offsetY / 111111), // 1 degree of latitude is approximately 111111 meters
                      lng: secondMarkerPosition.lng + (offsetX / (111111 * Math.cos(markerPosition.lat * (Math.PI / 180)))), // Adjust longitude for latitude
                    };

                    return (
                      <>
                        <Circle
                          key={index}
                          center={secondMarkerPosition}
                          radius={distanceFromMarker}
                          options={{
                            strokeColor: '#FF69B4', // Pink color
                            strokeOpacity: 1,
                            strokeWeight: 3,
                            fillColor: '#FF69B4', // Pink color
                            fillOpacity: 0.1, // 20% opacity
                            visible: showPath,
                          }}
                        />
                        {showPath && showOverlays && (
                          <OverlayView
                            key={`overlay-${index}`}
                            position={position}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                          >
                            <div key={`div-${index}`} style={{ color: '#FF69B4', fontWeight: 'bold', fontSize: '16px', padding: '8px' }}>{distanceData.score} points</div>
                          </OverlayView>
                        )}
                      </>
                    );
                  })}
              </>
            )}
          </GoogleMap>
        </>
      ) : (
        <div>Loading Map...</div>
      )}
    </div>
  );
}

export default MapView;
