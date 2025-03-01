"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Map, AlertTriangle, Search } from "lucide-react"
import "./ResourceLocator.css"

const ResourceLocator = () => {
  const navigate = useNavigate()
  const [location, setLocation] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mapCenter, setMapCenter] = useState({ lat: -1.286389, lng: 36.817223 })

  const fetchClinics = async () => {
    if (!location) return
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://api.example.com/search?location=${location}`)
      const data = await response.json()
      setResults(data.results || [])
      if (data.results && data.results.length > 0) {
        setMapCenter({ lat: data.results[0].latitude, lng: data.results[0].longitude })
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again.")
    }
    setLoading(false)
  }

  const handleQuickExit = () => {
    window.location.href = "https://weather.com"
  }

  return (
    <div className="resource-locator">
      <header className="header">
        <h1 className="page-title">Find Clinics & Shelters</h1>
        <div className="header-buttons">
          <button className="nav-link" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>
          <button className="quick-exit-btn" onClick={handleQuickExit}>
            Quick Exit
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="search-container">
          <div className="input-container">
            <input
              type="text"
              placeholder="Enter your location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="text-input"
            />
            <button onClick={fetchClinics} disabled={loading} className="search-button">
              {loading ? "Searching..." : "Search"}
              <Search className="search-icon" />
            </button>
          </div>
          {error && (
            <p className="error">
              <AlertTriangle className="error-icon" /> {error}
            </p>
          )}
        </div>

        <div className="map-container">
          <iframe
            width="100%"
            height="400"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${mapCenter.lat},${mapCenter.lng}`}
            allowFullScreen
          ></iframe>
        </div>

        <div className="results-container">
          <h2 className="section-title">Search Results</h2>
          {results.length === 0 ? (
            <p className="no-results">No results found. Try a different location.</p>
          ) : (
            <ul className="results-list">
              {results.map((place, index) => (
                <li key={index} className="result-item">
                  <h3 className="result-name">{place.name}</h3>
                  <p className="result-address">{place.address}</p>
                  <button
                    className="map-button"
                    onClick={() =>
                      window.open(`https://maps.google.com/?q=${place.latitude},${place.longitude}`, "_blank")
                    }
                  >
                    <Map className="map-icon" />
                    <span>View on Map</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <footer className="footer">
        <p className="footer-text">
          <AlertTriangle className="footer-icon" />
          If you are in immediate danger, call emergency services 911 .
        </p>
        <p className="footer-text">National Domestic Violence Hotline: 1195</p>
      </footer>
    </div>
  )
}

export default ResourceLocator

