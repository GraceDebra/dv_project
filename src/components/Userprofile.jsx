import React, { useState, useRef, useEffect } from "react";
import { LogOut, UserCircle } from "lucide-react";

const UserProfile = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("User");
  
  const profileRef = useRef(null);

  // Load saved profile data from localStorage on mount
  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    const savedName = localStorage.getItem("username");
    
    if (savedImage) setProfileImage(savedImage);
    if (savedName) setUsername(savedName);
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const handleLogout = () => {
    if (onLogout) onLogout();
  };
  
  const handleProfileClick = () => {
    // You can add navigation to profile page or other actions here
    setIsOpen(false);
  };
  
  return (
    <div className="relative" ref={profileRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full focus:outline-none"
        aria-label="User profile"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
          {profileImage ? (
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <UserCircle className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-md z-50 border border-gray-100">
          <div className="py-1">
            <button 
              onClick={handleProfileClick}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
            >
              <span>Profile</span>
            </button>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
            >
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;