import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, Polyline, useJsApiLoader, Circle, OverlayView } from '@react-google-maps/api';
import scoresData from './scores.json';
import ToggleLandmarksButton from './ToggleLandmarksButton';

const starImage = "pins/starpin.png"; // Add the path to the star image
const haileyImages = ["pins/hailey1.png", "pins/hailey2.png", "pins/hailey3.png"]; // Add the path to the star image

const defaultMapOptions = {
  center: { lat: 39.9612, lng: -82.9988 }, // Columbus, Ohio
  zoom: 12,
};

const customMapStyles = [
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
];

const markerSize = {
  width: 75 * 0.90, // Adjust the width of the marker
  height: 120 * 0.90, // Adjust the height of the marker
};

function MapView({ onLocationSelected, isVisible, secondMarkerPosition }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBmfLP9sgBKPICEdBpewcpaV9cqdHoNghA',
  });

  const [showLandmarks, setShowLandmarks] = useState(true);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [icon, setIcon] = useState(0);
  const [showPath, setShowPath] = useState(true);
  const [showOverlays, setShowOverlays] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    if (secondMarkerPosition === null) {
      setMarkerPosition(null);
      setShowPath(false);
    } else {
      setShowPath(true);
    }
  }, [secondMarkerPosition]);

  const handleMapClick = (e) => {
    if (!showPath) {
      setIcon(Math.floor(Math.random() * haileyImages.length));
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
      setShowOverlays(zoomLevel >= 16); // Adjust the zoom level condition as needed
    }
    console.log("showPath: ", showPath, "showOverlays: ", showOverlays);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: '0', display: isVisible ? 'block' : 'none' }}>
      {!showPath && (
        <ToggleLandmarksButton onClick={toggleLandmarks}  showLandmarks={showLandmarks}/>
      )}
      {isLoaded ? (
        <>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={defaultMapOptions.center}
            zoom={defaultMapOptions.zoom}
            options={{
              styles: showLandmarks ? customMapStyles : [],
            }}
            onClick={handleMapClick}
            onZoomChanged={handleZoomChanged}
            onLoad={(map) => (mapRef.current = map)}
          >
            {markerPosition && (
              <Marker
                position={markerPosition}
                icon={{
                  url: haileyImages[icon],
                  scaledSize: markerSize, // Set the size of the marker
                }}
              />
            )}
            {markerPosition && secondMarkerPosition && (
              <>
                <Marker
                  position={secondMarkerPosition}
                  icon={{
                    url: starImage,
                    scaledSize: markerSize, // Set the size of the marker
                  }}
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
                          key={distanceData.value}
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
                            key={`overlay-${distanceData.score}`}
                            position={position}
                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                          >
                            <div style={{ color: '#FF69B4', fontWeight: 'bold', fontSize: '16px', padding: '8px' }}>{distanceData.score} points</div>
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
