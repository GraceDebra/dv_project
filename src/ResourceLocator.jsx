"use client"

import { useState, useRef } from "react"
import "./ResourceLocator.css"
import { Search, MapPin, X, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

const ResourceLocator = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState("shelters") // Default to shelters
  const mapRef = useRef(null)
  const navigate = useNavigate()

  const updateMap = (location, type) => {
    if (mapRef.current) {
      setLoading(true)
      const query = `${type} near ${location}`
      const encodedQuery = encodeURIComponent(query)
      // Original map URL structure maintained
      const mapUrl = `https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=$${encodedQuery}`
      mapRef.current.src = mapUrl
      mapRef.current.onload = () => {
        setLoading(false)
      }
      mapRef.current.onerror = () => {
        setLoading(false)
        alert("Failed to load map. Please check your internet connection or try again later.")
      }
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
          alert("Unable to get your location. Please enable location services or enter it manually.")
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    } else {
      alert("Geolocation is not supported by your browser. Please enter your location manually.")
    }
  }

  return (
    <div className="resource-locator-container">
      <div className="header-actions">
        <button
          className="back-to-dashboard-button"
          onClick={() => navigate("/dashboard")}
          aria-label="Back to Dashboard"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
        <button
          className="quick-exit-button"
          onClick={() => (window.location.href = "https://weather.com")}
          aria-label="Quick Exit"
        >
          Quick Exit <X size={18} />
        </button>
      </div>

      <header className="resource-header">
        <h1>Find Local Resources</h1>
        <p>Locate nearby shelters and hospitals to get the help you need.</p>
      </header>

      <section className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Enter your location or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="location-input"
            />
            {/* Search icon and clear button at the end */}
            {searchQuery && (
              <button
                type="button"
                className="clear-search-button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search query"
              >
                <X size={18} />
              </button>
            )}
            <button type="submit" className="search-icon-button" aria-label="Search">
              <Search size={20} />
            </button>
          </div>
          {/* Moved 'Use Current Location' button to its own container for centering */}
          <div className="use-location-button-container">
            <button type="button" className="button secondary-button" onClick={handleUseCurrentLocation}>
              <MapPin size={18} /> Use Current Location
            </button>
          </div>
        </form>
      </section>

      <section className="filter-section">
        <button
          className={`filter-toggle ${selectedType === "shelters" ? "active" : ""}`}
          onClick={() => {
            setSelectedType("shelters")
            if (searchQuery) updateMap(searchQuery, "shelters")
          }}
        >
          Shelters
        </button>
        <button
          className={`filter-toggle ${selectedType === "hospitals" ? "active" : ""}`}
          onClick={() => {
            setSelectedType("hospitals")
            if (searchQuery) updateMap(searchQuery, "hospitals")
          }}
        >
          Hospitals
        </button>
        <button
          className={`filter-toggle ${selectedType === "police stations" ? "active" : ""}`}
          onClick={() => {
            setSelectedType("police stations")
            if (searchQuery) updateMap(searchQuery, "police stations")
          }}
        >
          Police Stations
        </button>
      </section>

      <section className="map-section">
        {loading && (
          <div className="map-loading-overlay">
            <div className="spinner"></div>
            <p>Loading map and searching for {selectedType}...</p>
          </div>
        )}
        <iframe
          ref={mapRef}
          title="Resource Map"
          width="100%"
          height="500"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=shelters" // Initial map
        ></iframe>
      </section>

      <footer className="resource-footer">
        <p>© 2025 SafeSpace. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default ResourceLocator;