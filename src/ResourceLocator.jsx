"use client"

import { useState, useRef } from "react"
import "./ResourceLocator.css"
import { Search, MapPin, X, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom";

const ResourceLocator = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState("shelters")
  const mapRef = useRef(null)
  const navigate = useNavigate();

  const updateMap = (location, type) => {
    if (mapRef.current) {
      setLoading(true)
      const query = `${type} near ${location}`
      const encodedQuery = encodeURIComponent(query)
      const mapUrl = `https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedQuery}`
      mapRef.current.src = mapUrl
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery) {
      updateMap(searchQuery, selectedType)
    }
  }

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const location = `${latitude},${longitude}`
          setSearchQuery(location)
          updateMap(location, selectedType)
        },
        (error) => {
          console.error("Error getting location:", error)
          setLoading(false)
          alert("Unable to get your location. Please enter it manually.")
        },
      )
    } else {
      alert("Geolocation is not supported by your browser. Please enter your location manually.")
    }
  }

  return (
    <div className="resource-locator">
    <div className="safety-exit">
      <button
        className="exit-button"
        onClick={() => (window.location.href = "https://weather.com")}
        aria-label="Exit to weather website"
      >
        <X /> Quick Exit
      </button>

      <button
        className="dashboard-button"
        onClick={() => navigate("/dashboard")}
        aria-label="Back to Dashboard"
      >
        <ArrowLeft /> Back to Dashboard
      </button>
    </div>
  

      <div className="header">
        <h1>Find Help</h1>
        <p>Find shelters and hospitals near you</p>
      </div>

      <div className="search-container">
        <form onSubmit={handleSearch}>
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Enter your location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="search-buttons">
            <button type="submit" className="search-button">
              Search
            </button>
            <button type="button" className="location-button" onClick={handleUseCurrentLocation}>
              <MapPin size={16} /> Use my location
            </button>
          </div>
        </form>
      </div>

      <div className="filter-container">
        <button
          className={`filter-button ${selectedType === "shelters" ? "active" : ""}`}
          onClick={() => {
            setSelectedType("shelters")
            if (searchQuery) updateMap(searchQuery, "shelters")
          }}
        >
          Shelters
        </button>
        <button
          className={`filter-button ${selectedType === "hospitals" ? "active" : ""}`}
          onClick={() => {
            setSelectedType("hospitals")
            if (searchQuery) updateMap(searchQuery, "hospitals")
          }}
        >
          Hospitals
        </button>
        
      </div>

      <div className="map-container">
        <iframe
          ref={mapRef}
          width="100%"
          height="450"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src="https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=shelters"
        ></iframe>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Searching for resources...</p>
        </div>
      )}

      <div className="footer">
        <p>
          If you're in immediate danger, please call 911 or the National Domestic Violence Hotline at 1195.
        </p>
        <p>This tool is confidential and does not store your location information.</p>
      </div>
    </div>
  )
}

export default ResourceLocator

