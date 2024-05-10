import React, { useState, useEffect } from 'react';
import '../../css/Detailcomponents/1DIstanceComponents.css';

function DIstanceComponent() {
    let [currentdistance, setcurrentdistance] = useState(null);
    let [totaldistance, settotaldistance] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/car-data');
        if (response.ok) {
          const data = await response.json();

          if (data.length > 0) {
            // `Timestamp`에 따라 정렬
            const sortedData = data.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));
            const latestData = sortedData[0]; // 가장 최근 항목 선택

            const distanceValue = parseFloat(latestData.Distance);
            if (!isNaN(distanceValue)) {
              const roundedDistance = distanceValue.toFixed(1);
              setcurrentdistance(roundedDistance);
            } else {
              console.error('Invalid distance value:', latestData.Distance);
            }
          }
        } else {
          console.error('서버 오류:', response.status);
        }
      } catch (error) {
        console.error('데이터 가져오기 오류:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className='componentname'>
      <p>주행 거리</p>
      <p className='currentdistance'>{currentdistance !== null ? `${currentdistance}km` : 'Loading...'}</p>
	  <p className='totaldistance-title'>누적 주행 거리</p>
      <p className='totaldistance'>{totaldistance ? `${totaldistance}km` : "준비중..."}</p>
    </div>
  );
}

export default DIstanceComponent;
