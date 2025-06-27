import React, {useState, useCallback} from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";

const containerStyle = {
  width: "800px",
  height: "600px",
  margin: "20px auto",
};

const center = {
  lat: 28.6562, // Center on Delhi
  lng: 77.241,
};

const RoadChainage = () => {
  const [origin, setOrigin] = useState({lat: 28.6562, lng: 77.241}); // Delhi (Red Fort)
  const [destination, setDestination] = useState({lat: 31.634, lng: 74.8723}); // Amritsar (Golden Temple)
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [chainageMarkers, setChainageMarkers] = useState([]);
  const [error, setError] = useState("");
  const [fetchDirections, setFetchDirections] = useState(false);

  // Haversine distance calculation
  const haversineDistance = (coord1, coord2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371000; // Earth's radius in meters
    const dLat = toRad(coord2.lat - coord1.lat);
    const dLng = toRad(coord2.lng - coord1.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(coord1.lat)) *
        Math.cos(toRad(coord2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Generate chainage points
  const generateChainagePoints = (path, interval = 100) => {
    const chainagePoints = [];
    let accumulatedDistance = 0;
    let chainageDistance = 0;

    for (let i = 0; i < path.length - 1; i++) {
      const start = path[i];
      const end = path[i + 1];
      const segmentDistance = haversineDistance(start, end);

      if (accumulatedDistance + segmentDistance >= chainageDistance) {
        while (accumulatedDistance + segmentDistance >= chainageDistance) {
          const fraction =
            (chainageDistance - accumulatedDistance) / segmentDistance;
          const lat = start.lat + (end.lat - start.lat) * fraction;
          const lng = start.lng + (end.lng - start.lng) * fraction;
          chainagePoints.push({
            position: {lat, lng},
            label: `${(chainageDistance / 1000).toFixed(2)} km`,
          });
          chainageDistance += interval;
        }
      }
      accumulatedDistance += segmentDistance;
    }
    return chainagePoints;
  };

  // Directions callback
  const directionsCallback = useCallback((result, status) => {
    if (status === "OK") {
      setDirectionsResponse(result);
      setError("");
      const route = result.routes[0].overview_path;
      const markers = generateChainagePoints(
        route.map((point) => ({
          lat: point.lat(),
          lng: point.lng(),
        })),
        100
      );
      setChainageMarkers(markers);
    } else {
      setError(`Directions API Error: ${status}`);
      setDirectionsResponse(null);
      setChainageMarkers([]);
    }
    setFetchDirections(false); // Reset trigger
  }, []);

  // Handle input changes
  const handleInputChange = (e, type, field) => {
    const value = parseFloat(e.target.value);
    if (type === "origin") {
      setOrigin((prev) => ({...prev, [field]: isNaN(value) ? "" : value}));
    } else {
      setDestination((prev) => ({...prev, [field]: isNaN(value) ? "" : value}));
    }
  };

  // Validate coordinates
  const isValidCoords = () => {
    return (
      typeof origin.lat === "number" &&
      typeof origin.lng === "number" &&
      typeof destination.lat === "number" &&
      typeof destination.lng === "number" &&
      origin.lat >= -90 &&
      origin.lat <= 90 &&
      origin.lng >= -180 &&
      origin.lng <= 180 &&
      destination.lat >= -90 &&
      destination.lat <= 90 &&
      destination.lng >= -180 &&
      destination.lng <= 180
    );
  };

  // Trigger directions fetch
  const handleFetchDirections = () => {
    if (isValidCoords()) {
      setFetchDirections(true);
    } else {
      setError("Please enter valid coordinates");
    }
  };

  return (
    <div style={{padding: "20px"}}>
      <h1>Road Chainage Overlay</h1>
      <div style={{marginBottom: "20px"}}>
        <h3>Origin (e.g., Delhi)</h3>
        <input
          type="number"
          placeholder="Latitude"
          value={origin.lat}
          onChange={(e) => handleInputChange(e, "origin", "lat")}
          style={{marginRight: "10px"}}
        />
        <input
          type="number"
          placeholder="Longitude"
          value={origin.lng}
          onChange={(e) => handleInputChange(e, "origin", "lng")}
        />
      </div>
      <div style={{marginBottom: "20px"}}>
        <h3>Destination (e.g., Amritsar)</h3>
        <input
          type="number"
          placeholder="Latitude"
          value={destination.lat}
          onChange={(e) => handleInputChange(e, "destination", "lat")}
          style={{marginRight: "10px"}}
        />
        <input
          type="number"
          placeholder="Longitude"
          value={destination.lng}
          onChange={(e) => handleInputChange(e, "destination", "lng")}
        />
      </div>
      <button onClick={handleFetchDirections} style={{marginBottom: "20px"}}>
        Get Route
      </button>
      {error && <p style={{color: "red"}}>{error}</p>}
      <LoadScript googleMapsApiKey="AIzaSyADsDeet4Re2Yt-lGU83dyLeMmXeaXrPfg">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={6}>
          {fetchDirections && isValidCoords() && (
            <DirectionsService
              options={{
                origin: {lat: origin.lat, lng: origin.lng},
                destination: {lat: destination.lat, lng: destination.lng},
                travelMode: "DRIVING",
              }}
              callback={directionsCallback}
            />
          )}
          {directionsResponse && (
            <DirectionsRenderer
              options={{
                directions: directionsResponse,
              }}
            />
          )}
          {chainageMarkers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              label={{
                text: marker.label,
                color: "black",
                fontWeight: "bold",
                fontSize: "12px",
              }}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "red",
                fillOpacity: 1,
                strokeColor: "white",
                strokeWeight: 2,
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
      {directionsResponse && (
        <div>
          <p>
            Total Distance: {directionsResponse.routes[0].legs[0].distance.text}
          </p>
          <p>Duration: {directionsResponse.routes[0].legs[0].duration.text}</p>
        </div>
      )}
    </div>
  );
};

export default RoadChainage;
