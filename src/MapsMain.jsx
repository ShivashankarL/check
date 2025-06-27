import React, {useState, useCallback} from "react";
import {GoogleMap, LoadScript} from "@react-google-maps/api";
import geoJsonData from "./your-geojson-file.json"; // Assuming your GeoJSON is in a file

const center = {
  lat: -3.745,
  lng: -38.523,
};

function MapComponent() {
  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
    mapInstance.data.addGeoJson(geoJsonData); // Add your GeoJSON data

    // Optional: Style the GeoJSON features
    mapInstance.data.setStyle(function (feature) {
      return {
        fillColor: feature.getProperty("color") || "green", // Use a 'color' property from GeoJSON or default to blue
        strokeWeight: 1,
        strokeColor: "green",
        fillOpacity: 0.5,
        backgroundColor: "green",
      };
    });
  }, []);

  const onUnmount = useCallback(function callback(mapInstance) {
    setMap(null);
  }, []);

  const containerStyle = {
    width: "100%",
    height: "400px",
    // You can add more styles here for the map container itself
    backgroundColor: "green",
    // borderRadius: "8px",
    border: "1px solid red",
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyADsDeet4Re2Yt-lGU83dyLeMmXeaXrPfg">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Child components can go here */}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;
