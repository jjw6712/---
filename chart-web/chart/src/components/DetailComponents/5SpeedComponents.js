import React, { useState, useEffect } from 'react';
import '../../css/Detailcomponents/5SpeedComponents.css';

function SpeedComponent() {
  const [maxspeed, setmaxspeed] = useState(null);
  const [avgspeed, setavgspeed] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/car-data');
        if (response.ok) {
          const data = await response.json();

          if (data.length > 0) {
            // Speed 값을 배열로 추출
            const speeds = data.map(item => parseFloat(item.Speed)).filter(num => !isNaN(num));

            // 최대값 계산
            const maxSpeedValue = Math.max(...speeds);
            setmaxspeed(maxSpeedValue.toFixed(1));

            // 평균값 계산
            const avgSpeedValue = speeds.reduce((acc, val) => acc + val, 0) / speeds.length;
            setavgspeed(avgSpeedValue.toFixed(1));
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
      <p>속도</p>
      <p className='max-speed'>최댓값:</p>
      <p className='max-speed-per'>{maxspeed !== null ? `${maxspeed}km/h` : 'Loading...'}</p>
      <p className='avg-speed'>평균값:</p>
      <p className='avg-speed-per'>{avgspeed !== null ? `${avgspeed}km/h` : 'Loading...'}</p>
    </div>
  );
}

export default SpeedComponent;
