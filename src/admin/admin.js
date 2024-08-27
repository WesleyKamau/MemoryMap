import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import data from '../images.json';

const pin = '/pins/pin.png';
const markerSize = {
    width: 55,
    height: 95,
};

function Admin({ custom }) {
    const [mapOptions, setMapOptions] = useState({
        center: { lat: 39.9612, lng: -82.9988 },
        zoom: 11,
    });
    const [gameData, setGameData] = useState([]);
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    });
    const mapRef = useRef(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [triggerRender, setTriggerRender] = useState(false);
    const [hoveredMarkerIndex, setHoveredMarkerIndex] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);

    useEffect(() => {
        if (custom && custom.images) {
            setGameData(custom.images);
        } else {
            setGameData(data);
        }
        console.log("data loaded");
        setDataLoaded(true);

        setTimeout(() => {
            setTriggerRender(true);
        }, 100);
    }, [custom]);

    useEffect(() => {
        if (hoveredMarkerIndex !== null && gameData.length > 0) {
            const imageUrl = custom 
                ? "https://memorymap-4ed7565da8e8.herokuapp.com/image/" + gameData[hoveredMarkerIndex].fileId
                : gameData[hoveredMarkerIndex].filename;
            setCurrentImage(imageUrl);
        } else {
            setCurrentImage(null);
        }
        // console.log(currentImage)
    }, [hoveredMarkerIndex, custom, gameData]);

    useEffect(() => {
        if (gameData.length > 0) {
            const latitudes = gameData.map(item => item.latitude).filter(lat => lat != null);
            const longitudes = gameData.map(item => item.longitude).filter(lng => lng != null);

            if (latitudes.length > 0 && longitudes.length > 0) {
                const averageLat = latitudes.reduce((acc, lat) => acc + lat, 0) / latitudes.length;
                const averageLng = longitudes.reduce((acc, lng) => acc + lng, 0) / longitudes.length;
                setMapOptions(prevOptions => ({
                    ...prevOptions,
                    center: { lat: averageLat, lng: averageLng },
                }));
            }
        }
    }, [gameData]);

    const handleMarkerClick = (index) => {
        setHoveredMarkerIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative', zIndex: '0', display: 'block' }}>
            {isLoaded ? (
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={mapOptions.center}
                    zoom={mapOptions.zoom}
                    options={{
                        mapTypeControl: true,
                        disableDefaultUI: true,
                    }}
                    onLoad={(map) => (mapRef.current = map)}
                >
                    {(dataLoaded && triggerRender) && (
                        <>
                            {gameData.map((item, index) => (
                                <React.Fragment key={index}>
                                    <Marker
                                        position={{ lat: item.latitude, lng: item.longitude }}
                                        onClick={() => handleMarkerClick(index)}
                                        // icon={{
                                        //     url: pin,
                                        //     scaledSize: new window.google.maps.Size(markerSize.width, markerSize.height),
                                        // }}
                                    />
                                    {hoveredMarkerIndex === index && currentImage && (
                                        <OverlayView
                                            position={{ lat: item.latitude, lng: item.longitude }}
                                            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                        >
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    transform: 'translate(-50%, -100%)',
                                                    backgroundColor: 'white',
                                                    padding: '5px',
                                                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
                                                    zIndex: 100,
                                                }}
                                            >
                                                <img
                                                    src={currentImage}
                                                    alt="Marker"
                                                    style={{ width: '150px', height: 'auto' }}
                                                />
                                                image {index} <br /> {item.latitude}, {item.longitude}
                                            </div>
                                        </OverlayView>
                                    )}
                                </React.Fragment>
                            ))}
                        </>
                    )}
                </GoogleMap>
            ) : (
                <div>Loading Map...</div>
            )}
        </div>
    );
}

export default Admin;
