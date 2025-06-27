import React from "react";
import {GoogleMap, Polyline, Marker} from "@react-google-maps/api";

const MapComponent = () => {
  const center = {lat: 43.6532, lng: -79.3832}; // Center on Toronto
  const routes = [
    {lat: 43.6777, lng: -79.6248}, // Brampton
    {lat: 43.6532, lng: -79.3832}, // Toronto
    {lat: 43.8561, lng: -79.3389}, // Markham
  ];

  const pathCoordinates = [
    {lat: 43.6777, lng: -79.6248},
    {lat: 43.6532, lng: -79.3832},
    {lat: 43.8561, lng: -79.3389},
  ];

  return (
    <GoogleMap
      mapContainerStyle={{height: "400px", width: "100%"}}
      center={center}
      zoom={10}
    >
      {/* Polyline for routes */}
      <Polyline
        path={pathCoordinates}
        options={{
          strokeColor: "#00FF00",
          strokeOpacity: 1.0,
          strokeWeight: 2,
        }}
      />
      {/* Markers for key locations */}
      {routes.map((location, index) => (
        <Marker key={index} position={location} />
      ))}
    </GoogleMap>
  );
};

export default MapComponent;
