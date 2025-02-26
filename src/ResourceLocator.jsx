import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "./ResourceLocator.css";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: -1.286389,
  lng: 36.817223,
};

const ResourceLocator = () => {
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClinics = async () => {
    if (!location) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.example.com/search?location=${location}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    }
    setLoading(false);
  };

  const handleQuickExit = () => {
    window.location.href = "https://weather.com";
  };

  return (
    <div className="search-container">
      <div className="nav-buttons">
        <button className="dashboard-button" onClick={() => window.location.href = "/dashboard"}>Go Back to Dashboard</button>
        <button className="exit-button" onClick={handleQuickExit}>Quick Exit</button>
      </div>
      <h2>Find Clinics & Shelters</h2>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter your location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button onClick={fetchClinics} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap mapContainerStyle={mapContainerStyle} center={defaultCenter} zoom={10}>
          {results.map((place, index) => (
            <Marker key={index} position={{ lat: place.latitude, lng: place.longitude }} />
          ))}
        </GoogleMap>
      </LoadScript>
      <ul>
        {results.map((place, index) => (
          <li key={index}>
            <h3>{place.name}</h3>
            <p>{place.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResourceLocator;
