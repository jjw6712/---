import React, { useState, useEffect } from 'react';
import '../../css/Detailcomponents/2DriveTimeComponents.css';

function DriveTimeComponent() {
  const [drivestarttime, setdrivestarttime] = useState(null);
  const [driveendtime, setdriveendtime] = useState(null);
  const [totaldrivetime, settotaldrivetime] = useState(null);
  const [collisiontime, setcollisiontime] = useState(null);

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

            const startTimeString = latestSession[0].Timestamp;
            const endTimeString = latestSession[latestSession.length - 1].Timestamp;

            const startTime = new Date(startTimeString);
            const endTime = new Date(endTimeString);

            const totalDriveTime = (endTime - startTime) / 1000; // Seconds

            setdrivestarttime(formatTimestamp(startTimeString));
            setdriveendtime(formatTimestamp(endTimeString));
            settotaldrivetime(formatDuration(totalDriveTime));

            const collisionEntry = latestSession.find(item => item.Collison === '1');
            if (collisionEntry) {
              setcollisiontime(formatTimestamp(collisionEntry.Timestamp));
            } else {
              setcollisiontime('충돌 기록이 없습니다.');
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
      <p>운행 시간</p>
      <p className='drivestarttime-title'>운행 시작 시간: </p>
      <p className='drivestarttime'>{drivestarttime}</p>
      <p className='driveendtime-title'>운행 종료 시간: </p>
      <p className='driveendtime'>{driveendtime}</p>
      <p className='totaldrivetime-title'>총 운행 시간: </p>
      <p className='totaldrivetime'>{totaldrivetime}</p>
      <p className= 'collisiontime-title'>충돌 발생 시간: </p>
      <p className='collisiontime'>{collisiontime ? collisiontime : '충돌 기록이 없습니다.'}</p>
    </div>
  );
}

function formatTimestamp(timestamp) {
  return timestamp.replace("T", " ").split(".")[0];
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${hours}시간 ${minutes}분 ${remainingSeconds}초`;
}

export default DriveTimeComponent;