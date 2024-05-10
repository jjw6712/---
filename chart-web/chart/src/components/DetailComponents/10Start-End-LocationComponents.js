import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure correct import
import '../../css/Detailcomponents/10Start-End-LocationComponents.css';

function StartEndLocationComponent() {
  const [startlocation, setstartlocation] = useState(null);
  const [endlocation, setendlocation] = useState(null);
	
  const navigate = useNavigate(); // Initialize for navigation

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/car-data');
        if (response.ok) {
          const data = await response.json();

          if (data.length > 0) {
            const sortedData = data.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));

            const driveSessions = [];
            let currentSession = [sortedData[0]];

            for (let i = 1; i < sortedData.length; i++) {
              const timeDiff = (new Date(sortedData[i].Timestamp) - new Date(currentSession[currentSession.length - 1].Timestamp)) / 1000 / 60;

              if (timeDiff > 10) { // 10분 이상의 간격
                driveSessions.push(currentSession);
                currentSession = [sortedData[i]];
              } else {
                currentSession.push(sortedData[i]);
              }
            }
            driveSessions.push(currentSession);

            const latestSession = driveSessions[driveSessions.length - 1];

            const startLatLon = findValidCoordinates(latestSession, 0, 1); // Find first valid
            const endLatLon = findValidCoordinates(latestSession, latestSession.length - 1, -1); // Find last valid

            if (startLatLon.lat && startLatLon.lon) {
              setstartlocation(await reverseGeocode(startLatLon.lat, startLatLon.lon));
            } else {
              setstartlocation('Coordinates not found');
            }

            if (endLatLon.lat && endLatLon.lon) {
              setendlocation(await reverseGeocode(endLatLon.lat, endLatLon.lon));
            } else {
              setendlocation('Coordinates not found');
            }
          }
        } else {
          console.error('Server error:', response.status);
        }
      } catch (error) {
        console.error('Error fetching car data:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className='componentname'>
      <p className='start-location-title'>출발 위치:</p>
      <p className='start-location'>{startlocation}</p>
      <p className='end-location-title'>도착 위치:</p>
      <p className='end-location'>{endlocation}</p>
       <button 
        className='map-button' 
        onClick={() => navigate('/collision')}
      >
        <span className='map-button-text'>충돌 상세 내역</span>
      </button>
    </div>
  );
}

async function reverseGeocode(lat, lon) {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
  const data = await response.json();

  if (data.address) {
    return ` ${data.address.country ?? ''} ${data.address.city ?? data.address.village ?? ''} ${data.address.road ?? ''} ${data.address.house_number ?? ''}`;
  }
  return '주소를 찾지 못했습니다.';
}

function findValidCoordinates(session, startIdx, direction) {
  let lat = null, lon = null;

  for (let i = startIdx; i >= 0 && i < session.length; i += direction) {
    lat = session[i].Lat;
    lon = session[i].Lon;

    if (lat !== "N/A" && lon !== "N/A") break; // Found valid coordinates
  }

  return { lat, lon };
}

export default StartEndLocationComponent;