import React, { useState, useEffect } from 'react';
import './nav.css';
import { CiLocationOn } from "react-icons/ci";

function NavBar() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          fetchLocationName(position.coords.latitude, position.coords.longitude);
        },
        error => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser');
    }
  }, []);

  const fetchLocationName = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
      const data = await response.json();
      if (data.display_name) {
        setLocationName(data.address);
        console.log(data)
      } else {
        setLocationName('Location name not found');
      }
    } catch (error) {
      console.error('Error fetching location name:', error);
      setLocationName('Error fetching location name');
    }
  };

  return (
    <div className='main'>
      <div className='navBar'>
        <h1><b><i>Flood Monitoring</i></b></h1>
      </div>
      <div className='Location'>
        <CiLocationOn style={{ color: 'black', fontSize: '20px', }} />
        {currentLocation && (
          <span style={{ color: 'black', marginLeft: '5px' }}>
            {locationName.suburb}
          </span>
        )}
      </div>
    </div>
  );
}

export default NavBar;
