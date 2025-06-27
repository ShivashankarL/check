import React from "react";
import "./App.css";
import RoadChainage from "./RoadChainage";
import {LoadScript} from "@react-google-maps/api";
import MapComponent from "./MapsMain";

function App() {
  return (
    <div className="App">
      <h1>Road Chainage Osfdsverlay</h1>
      {/* <RoadChainage /> */}
      <MapComponent />
    </div>
  );
}

export default App;
