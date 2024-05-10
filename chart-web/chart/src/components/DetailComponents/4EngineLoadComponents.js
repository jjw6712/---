import React, { useState, useEffect } from 'react';
import '../../css/Detailcomponents/4EngineLoadComponents.css';

function EngineLoadComponent() {
  const [maxengineper, setmaxengineper] = useState(null);
  const [minengineper, setminengineper] = useState(null);
  const [avgengineper, setavgengineper] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/car-data');
        if (response.ok) {
          const data = await response.json();

          if (data.length > 0) {
            // EngineLoad 값을 배열로 추출
            const engineLoads = data.map(item => parseFloat(item.EngineLoad)).filter(num => !isNaN(num));

            if (engineLoads.length > 0) {
              // 최댓값 계산
              const maxEngineLoad = Math.max(...engineLoads);
              setmaxengineper(maxEngineLoad.toFixed(1));

              // 최솟값 계산
              const minEngineLoad = Math.min(...engineLoads);
              setminengineper(minEngineLoad.toFixed(1));

              // 평균값 계산
              const avgEngineLoad = engineLoads.reduce((acc, val) => acc + val, 0) / engineLoads.length;
              setavgengineper(avgEngineLoad.toFixed(1));
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
      <p>엔진 부하량</p>
      <p className='max-engine'>최댓값:</p>
      <p className='max-engine-per'>{maxengineper !== null ? `${maxengineper}%` : 'Loading...'}</p>
      <p className='min-engine'>최솟값:</p>
      <p className='min-engine-per'>{minengineper !== null ? `${minengineper}%` : 'Loading...'}</p>
      <p className='avg-engine'>평균값:</p>
      <p className='avg-engine-per'>{avgengineper !== null ? `${avgengineper}%` : 'Loading...'}</p>
    </div>
  );
}

export default EngineLoadComponent;
