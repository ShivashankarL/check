import React, {useState, useEffect} from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

const MapComponent = () => {
  const [directions, setDirections] = useState(null);
  const center = {lat: 43.6532, lng: -79.3832}; // Center on Toronto
  const waypoints = [
    {location: {lat: 43.6777, lng: -79.6248}}, // Brampton
    {location: {lat: 43.8561, lng: -79.3389}}, // Markham
  ];
  const destination = {lat: 43.8561, lng: -79.3389}; // Ending point
  const origin = {lat: 43.6777, lng: -79.6248}; // Starting point

  const directionsOptions = {
    origin: origin,
    destination: destination,
    waypoints: waypoints,
    travelMode: "DRIVING", // Options: DRIVING, WALKING, BICYCLING, TRANSIT
  };

  const directionsCallback = (response) => {
    if (response !== null && response.status === "OK") {
      setDirections(response);
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyADsDeet4Re2Yt-lGU83dyLeMmXeaXrPfg">
      <GoogleMap
        mapContainerStyle={{height: "400px", width: "100%"}}
        center={center}
        zoom={10}
      >
        {directions && <DirectionsRenderer directions={directions} />}
        {!directions && (
          <DirectionsService
            options={directionsOptions}
            callback={directionsCallback}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
