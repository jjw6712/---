import React, {useRef,  useEffect, useState} from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup} from 'react-leaflet';
import {Icon} from 'leaflet';
import L from 'leaflet';  // Leaflet 라이브러리 가져오기
import { FaPlay, FaPause, FaRedo, FaFastForward } from 'react-icons/fa';  //아이콘 라이브러리
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import moment from 'moment';

import 'leaflet/dist/leaflet.css';
import '../css/CollisionComponents.css';

const orangeIcon = new Icon({
  //iconUrl: require("../orange-marker.png"),  // 이미지 URL 설정
  iconUrl: "/Collision_marker.png",
  iconSize: [38, 38],  // 표준 Leaflet 마커 크기
  iconAnchor: [12.5, 41],  // 이미지의 '앵커' 포인트
  popupAnchor: [1, -34]  // 팝업이 표시될 위치 조정
});


const CollisionComponent = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [selectedVideos, setSelectedVideos] = useState({ faceVideo: '', pedalVideo: '' });
	const [chartData, setChartData] = useState({labels: [],datasets: []});

   const [currentSpeed, setCurrentSpeed] = useState("N/A");
  const [currentRPM, setCurrentRPM] = useState("N/A");
  const [currentThrottle, setCurrentThrottle] = useState("N/A");
  const [currentLoad, setCurrentLoad] = useState("N/A");
  
 const chartRef = useRef(null);


  const videoRefs = {
    faceVideo: useRef(null),
    pedalVideo: useRef(null),
  };


  useEffect(() => {
    async function fetchCollisionData() {
      try {
        const response = await fetch('/car-data');
        if (response.ok) {
          const data = await response.json();

          if (data.length > 0) {
            const sortedData = data.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));

            const allSessions = [];
            let currentSession = [];

            let lastTimestamp = null;
            for (const entry of sortedData) {
              const currentTimestamp = new Date(entry.Timestamp);
              if (lastTimestamp && (currentTimestamp - lastTimestamp < 1000)) {
                continue; // Skip entries within the same second
              }

              lastTimestamp = currentTimestamp;

              if (currentSession.length === 0 || (currentTimestamp - new Date(currentSession[currentSession.length - 1].Timestamp)) / 1000 / 60 < 10) {
                currentSession.push(entry);
              } else {
                allSessions.push(currentSession);
                currentSession = [entry];
              }
            }

            if (currentSession.length > 0) {
              allSessions.push(currentSession);
            }

            const processedSessions = allSessions.map(session => {
              const pathData = session.map(d => {
                let lat = parseFloat(d.Lat);
                let lon = parseFloat(d.Lon);

                if (isNaN(lat) || isNaN(lon)) {
                  return null;
                }

                return [lat, lon];
              }).filter(pos => pos !== null);

              const collisionIndices = session.map((record, idx) => record.Collison === "1" ? idx : null).filter(idx => idx !== null);

              const collisionTimes = collisionIndices.map(idx => new Date(session[idx].Timestamp));

              return { session, pathData, collisionIndices, collisionTimes };
            });

            setSessions(processedSessions);
          } else {
            console.error('No car data available');
          }
        } else {
          console.error('Server error:', response.status);
        }
      } catch (error) {
        console.error('Error fetching car data:', error);
      }
    }

    fetchCollisionData();
  }, []);
useEffect(() => {
  if (sessions.length > 0 && sessions[currentSessionIndex].session.length > 0) {
    // 첫 번째 충돌 시점의 동영상을 미리 로드
    const collisionIndex = sessions[currentSessionIndex].collisionIndices[0];
    const collisionTimestamp = sessions[currentSessionIndex].session[collisionIndex].Timestamp;
    const formattedTime = formatTimeForVideo(collisionTimestamp);
    const faceVideoUrl = `https://hkcfxjmr-3001.asse.devtunnels.ms/facevideo/${formattedTime}_h264.mp4`;
    const pedalVideoUrl = `https://hkcfxjmr-3001.asse.devtunnels.ms/pedalvideo/${formattedTime}_h264.mp4`;    
    console.log(`Video URL: ${faceVideoUrl}`);
    setSelectedVideos({ faceVideo: faceVideoUrl, pedalVideo: pedalVideoUrl });
  }
}, [sessions, currentSessionIndex]);

const handleMarkerClick = (timestamp) => { //충돌 마커 클릭 시 행위
    
  };

const formatTimeForVideo = (timestamp) => {
    return timestamp.replace(/(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})\.000Z/, '$1-$2-$3-$4');
};

  const pad = (num) => num.toString().padStart(2, '0');
	
function parseDataPoint(value) {
  return value === "N/A" ? 0 : parseFloat(value);
}

function updateChartData(newDataPoint) {
  setChartData(prevData => {
    const newData = { ...prevData };
    newData.labels.push(newDataPoint.time);
    if (newData.datasets && newData.datasets.length === 4) {
      newData.datasets[0].data.push(parseDataPoint(newDataPoint.speed));
      newData.datasets[1].data.push(parseDataPoint(newDataPoint.rpm));
      newData.datasets[2].data.push(parseDataPoint(newDataPoint.throttle));
      newData.datasets[3].data.push(parseDataPoint(newDataPoint.load));
    }

    if (newData.labels.length > 20) {
      newData.labels.shift();
      newData.datasets.forEach(dataset => {
        if (dataset.data) {
          dataset.data.shift();
        }
      });
    }

    return newData;
  });

  if (chartRef.current) {
    chartRef.current.update();
  }
}
  useEffect(() => {
    if (isAnimating) {
      const session = sessions[currentSessionIndex].session;
      // Start the timeout
      const timeoutId = setTimeout(() => {
        // Update the current point index
        const nextIndex = currentPointIndex + 1;

        // Stop animation if we've reached the end of the session
        if (nextIndex >= session.length - 1) {
          setIsAnimating(false);
        } else {
			// Update metrics
          setCurrentSpeed(session[nextIndex].Speed);
          setCurrentRPM(session[nextIndex].RPM);
          setCurrentThrottle(session[nextIndex].ThrottlePos);
          setCurrentLoad(session[nextIndex].EngineLoad);
          setCurrentPointIndex(nextIndex);
			    const newDataPoint = {
          speed: session[nextIndex].Speed,
          rpm: session[nextIndex].RPM,
          throttle: session[nextIndex].ThrottlePos,
          load: session[nextIndex].EngineLoad,
          time: moment(session[nextIndex].Timestamp).format('YYYY-MM-DD HH:mm:ss')
        };
		console.log(newDataPoint);
        updateChartData(newDataPoint);
        setCurrentPointIndex(nextIndex);
        }
      }, 1000 / speedMultiplier); // Constant interval of 1 second, adjusted for speed multiplier

      // Clean up the timeout on unmount
      return () => clearTimeout(timeoutId);
    }
  }, [isAnimating, currentSessionIndex, currentPointIndex, sessions, speedMultiplier]);

const handleStartClick = () => {
  if (!sessions[currentSessionIndex] || !sessions[currentSessionIndex].session.length) return;

  // 세션의 시작부터 애니메이션을 시작
  setIsAnimating(true);

  // 충돌 시간과 충돌 1분 전 시간 계산
  const collisionIndex = sessions[currentSessionIndex].collisionIndices[0];
  const collisionTime = new Date(sessions[currentSessionIndex].session[collisionIndex].Timestamp).getTime();
  const oneMinuteBeforeCollision = collisionTime - 60000; 
	const oneMinuteAfterCollision = collisionTime + 60000;
	

  // 충돌 1분 전에 도달했을 때 동영상을 동기화하기 위한 로직
  const intervalId = setInterval(() => {
    const currentTime = new Date(sessions[currentSessionIndex].session[currentPointIndex].Timestamp).getTime();
     
        videoRefs.faceVideo.current.play();
        videoRefs.pedalVideo.current.play();
	 
      clearInterval(intervalId); // 동기화 시작 후 인터벌 클리어
  	
  }, 1000 / speedMultiplier);
};

const handleStopClick = () => {
  setIsAnimating(false);
  videoRefs.faceVideo.current.pause();
  videoRefs.pedalVideo.current.pause();
};

const handleRestartClick = () => {
  setCurrentPointIndex(0);
  videoRefs.faceVideo.current.currentTime = 0;
  videoRefs.pedalVideo.current.currentTime = 0;
  setIsAnimating(true);
};

  const handleSpeedChange = (multiplier) => {
    setSpeedMultiplier(multiplier);
  };

  const handleProgressChange = (event) => {
    const newPointIndex = Math.floor((event.target.value / 100) * sessions[currentSessionIndex].pathData.length);
    setCurrentPointIndex(newPointIndex);
  };

  const handleCollisionSessionChange = (index) => {
    setCurrentSessionIndex(index);
    setCurrentPointIndex(0);
  };
const calculateVideoTime = () => {
  // `currentPointIndex`가 세션 데이터의 타임스탬프에 해당한다고 가정
  const currentTimestamp = new Date(sessions[currentSessionIndex].session[currentPointIndex].Timestamp).getTime();
  const collisionTimestamp = new Date(sessions[currentSessionIndex].collisionTimes[0]).getTime();
  // 충돌 60초 전으로 비디오 설정(가능한 경우)
  const videoTime = Math.max(0, (currentTimestamp - collisionTimestamp + 60000) / 1000);
  videoRefs.faceVideo.current.currentTime = videoTime;
  videoRefs.pedalVideo.current.currentTime = videoTime;
};

// `currentPointIndex`가 변경될 때마다 이 함수 호출
useEffect(() => {
  if (isAnimating) {
    calculateVideoTime();
  }
}, [currentPointIndex, isAnimating]);

const renderCollisionMarkers = () => {
  const sessionData = sessions[currentSessionIndex];
  if (!sessionData || sessionData.pathData.length === 0) {
    console.log("No session data or path data is empty");
    return null; // 렌더링을 하지 않음
  }

  return sessionData.collisionIndices.map(idx => {
    const entry = sessionData.session[idx];
    // 좌표를 숫자로 변환
    const pos = [parseFloat(entry.Lat), parseFloat(entry.Lon)];
    const timestamp = entry.Timestamp;

    // 좌표 데이터 유효성 검사
    if (isNaN(pos[0]) || isNaN(pos[1])) {
      console.log("Invalid data, skipping:", pos);
      return null; // 유효하지 않은 데이터는 스킵
    }

    console.log("Rendering marker at:", pos); // 위치 로그 출력
    return (
      <Marker  key={`collision-marker-${idx}`} position={pos} icon = {orangeIcon} eventHandlers={{
            click: () => handleMarkerClick(timestamp)
          }}>
        <Popup>
        충돌 시점: {formatTimestamp(timestamp)}
		</Popup>
      </Marker>
    );
  });
};

const renderPolylines = () => {
  const sessionData = sessions[currentSessionIndex];
  if (!sessionData || sessionData.pathData.length === 0) return null;

  let polylines = [];
  const collisionIndices = sessionData.collisionIndices;

  // 애니메이션에 따라 pathData를 현재 포인트 인덱스까지만 사용
  const animatedPathData = sessionData.pathData.slice(0, currentPointIndex + 1);

  animatedPathData.forEach((pos, idx) => {
    let isCollisionTime = false;

    // 현재 인덱스가 충돌 인덱스 범위 내에 있는지 검사
    for (let cIdx of collisionIndices) {
      if (Math.abs(cIdx - idx) * 1000 <= 60000) { // assuming data points are spaced one second apart
        isCollisionTime = true;
        break;
      }
    }

    if (idx > 0) {
      polylines.push(
        <Polyline
          key={idx}
          positions={[animatedPathData[idx - 1], pos]}
          color={isCollisionTime ? "red" : "blue"}
        />
      );
    }
  });

  return polylines;
};


  return (
  <div className='collision-map-grid'>

    <div className="collision-map">
      <MapContainer center={[36.112401, 128.426807]} zoom={15} className="leaflet-map">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        {renderCollisionMarkers()}
        {renderPolylines()}
      </MapContainer>
      <div className="session-select-container">
        <select className="session-select" onChange={e => handleCollisionSessionChange(parseInt(e.target.value))}>
          {sessions.filter(session => session.collisionIndices.length > 0).map((session, index) => (
              <option key={index} value={index}>
                충돌시점 {index + 1}: {formatTimestamp(session.session[0].Timestamp)} ~ {formatTimestamp(session.session[session.session.length - 1].Timestamp)}
              </option>
          ))}
        </select>
      </div>
      <div className="timestamp-display">
        {sessions[currentSessionIndex] && formatTimestamp(sessions[currentSessionIndex].session[currentPointIndex].Timestamp)}
      </div>
      <div className="media-controls">
        <button className="media-button" onClick={handleStartClick}><FaPlay /></button>
        <button className="media-button" onClick={handleStopClick}><FaPause /></button>
        <button className="media-button" onClick={handleRestartClick}><FaRedo /></button>
        <input type="range" min="0" max="100"
          value={sessions[currentSessionIndex] && sessions[currentSessionIndex].pathData ? (currentPointIndex / sessions[currentSessionIndex].pathData.length) * 100 : 0}
          onChange={e => {
            const newIndex = Math.floor(e.target.value / 100 * sessions[currentSessionIndex].session.length);
            setCurrentPointIndex(newIndex);
            calculateVideoTime();
          }}
        />
        <button className="media-button" onClick={() => handleSpeedChange(1)}><FaFastForward /> x1</button>
        <button className="media-button" onClick={() => handleSpeedChange(5)}><FaFastForward /> x5</button>
        <button className="media-button" onClick={() => handleSpeedChange(10)}><FaFastForward /> x10</button>
        <button className="media-button" onClick={() => handleSpeedChange(30)}><FaFastForward /> x30</button>
      </div>
    </div>

    <div className="video-sidebar">

      <div className='video-face'>
        {selectedVideos.faceVideo && (
          <video ref={videoRefs.faceVideo} src={selectedVideos.faceVideo} controls preload="auto" style={{ width: '100%' }} onError={(e) => console.error('Video error:', e)}>
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      <div className='video-pedal'>
        {selectedVideos.pedalVideo && (
          <video ref={videoRefs.pedalVideo} src={selectedVideos.pedalVideo} controls preload="auto" style={{ width: '100%' }} onError={(e) => console.error('Video error:', e)}>
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      <div className='four-of-data'>
          <div className='speed-of-data'>speed: {currentSpeed}km/h</div>
          <div className='rpm-of-data'>rpm: {currentRPM}</div>
          <div className='thro-of-data'>throttle: {currentThrottle}%</div>
          <div className='engine-of-data'>load: {currentLoad}%</div>

      </div>

    </div>


    <div className='collision-graph'>
  {chartData.datasets.length > 0 ? (
    <Line ref={chartRef} data={chartData} options={{
      scales: {
        x: {
          type: 'time',
          time: {
            parser: 'YYYY-MM-DD HH:mm:ss',
            tooltipFormat: 'll HH:mm',
            unit: 'second',
            stepSize: 1,
            displayFormats: {
              second: 'HH:mm:ss'
            }
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 20
          }
        },
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: true
        }
      },
      animation: {
        duration: 0 // 애니메이션 비활성화
      }
    }} />
  ) : (
    <p>Loading data...</p>
  )}
</div>

  </div>
);
}

function formatTimestamp(timestamp) {
  return timestamp.replace("T", " ").split(".")[0];
}

export default CollisionComponent;