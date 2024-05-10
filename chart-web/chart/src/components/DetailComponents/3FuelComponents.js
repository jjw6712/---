import React, { useState, useEffect } from 'react';
import '../../css/Detailcomponents/3FuelComponents.css';

function FuelComponent() {
  const [maxfuelper, setmaxfuelper] = useState(null);
  const [minfuelper, setminfuelper] = useState(null);
  const [avgfuelper, setavgfuelper] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/car-data');
        if (response.ok) {
          const data = await response.json();

          if (data.length > 0) {
            // Extract and convert necessary fields
            const throttlePositions = data.map(item => parseFloat(item.ThrottlePos)).filter(num => !isNaN(num));
            const engineLoads = data.map(item => parseFloat(item.EngineLoad)).filter(num => !isNaN(num));
            const shortTrims = data.map(item => parseFloat(item.ShortFuelTrim1)).filter(num => !isNaN(num));
            const longTrims = data.map(item => parseFloat(item.LongFuelTrim1)).filter(num => !isNaN(num));

            if (throttlePositions.length > 0 && engineLoads.length > 0) {
              // Calculate fuel supply for each entry
              const fuelSupplies = throttlePositions.map((throttlePos, idx) => {
                const engineLoad = engineLoads[idx];
                const shortTrim = shortTrims[idx] ?? 0;
                const longTrim = longTrims[idx] ?? 0;

                let fuelSupply = (throttlePos * 0.5 + engineLoad * 0.5) * (1 + shortTrim / 100) * (1 + longTrim / 100);

                return fuelSupply;
              });

              // Get max, min, and average
              const maxFuelSupply = Math.max(...fuelSupplies);
              const minFuelSupply = Math.min(...fuelSupplies);
              const avgFuelSupply = fuelSupplies.reduce((acc, val) => acc + val, 0) / fuelSupplies.length;

              setmaxfuelper(maxFuelSupply.toFixed(1));
              setminfuelper(minFuelSupply.toFixed(1));
              setavgfuelper(avgFuelSupply.toFixed(1));
            }
          }
        } else {
          console.error('Server responded with error:', response.status);
        }
      } catch (error) {
        console.error('Error fetching car data:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className='componentname'>
      <p>연료 공급량</p>
      <p className='max-fuel'>최댓값:</p>
      <p className='max-fuel-per'>{maxfuelper !== null ? `${maxfuelper}%` : 'Loading...'}</p>
      <p className='min-fuel'>최솟값:</p>
      <p className='min-fuel-per'>{minfuelper !== null ? `${minfuelper}%` : 'Loading...'}</p>
      <p className='avg-fuel'>평균값:</p>
      <p className='avg-fuel-per'>{avgfuelper !== null ? `${avgfuelper}%` : 'Loading...'}</p>
	</div>
  );
}

export default FuelComponent;
