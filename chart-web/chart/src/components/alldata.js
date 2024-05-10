import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import moment from 'moment';

const AllDBChartComponent = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/car-data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawData = await response.json();
  
        // 데이터를 분(minute) 별로 그룹화합니다.
        const groupedByMinute = {};
        rawData.forEach(item => {
          const time = moment(item.Timestamp, 'HH:mm:ss').startOf('minute').format('HH:mm');
          if (!groupedByMinute[time]) {
            groupedByMinute[time] = {};
          }
          Object.keys(item).forEach(key => {
            if (key !== 'Timestamp') {
              if (!groupedByMinute[time][key]) {
                groupedByMinute[time][key] = [];
              }
              groupedByMinute[time][key].push(item[key]);
            }
          });
        });
  
        // 각 분에 대한 평균 속도와 엔진 부하를 계산합니다.
        const labels = [];
        const speedAverages = [];
        const engineLoadAverages = [];
        
  
        const averages = Object.keys(groupedByMinute).map(time => {
          const avgs = {};
          Object.keys(groupedByMinute[time]).forEach(key => {
            avgs[key] = groupedByMinute[time][key].reduce((sum, current) => sum + current, 0) / groupedByMinute[time][key].length;
          });
          return { time, ...avgs };
        });
        
        // 차트 데이터 설정 로직: labels와 datasets를 설정합니다.
        setChartData({
          labels: averages.map(a => a.time),
          datasets: Object.keys(groupedByMinute[averages[0].time]).map(key => ({
            label: key,
            data: averages.map(a => a[key]),
            borderColor: getRandomColor(), // 이 함수는 각 데이터셋에 대해 랜덤한 색상을 반환해야 합니다.
            tension: 0.1
          }))
        });
        // ...
  
      } catch (error) {
        console.error("Fetching data error: ", error);
      }
    };
  
    fetchData();
  }, []);

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  return (
    <div>
      {chartData && chartData.datasets && chartData.datasets.length > 0 ? (
        <Line data={chartData} />
      ) : (
        <div>Loading chart...</div>
      )}
    </div>
  );
};

export default AllDBChartComponent;
