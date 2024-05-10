import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../css/RoadComponents.css';

function RoadComponent() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    // 외부 링크인지 확인하고 처리
    if (path.startsWith('http') || path.startsWith('https')) {
      window.location.href = path;
    } else {
      navigate(path);
    }
  };

  return (
    <div className='roadbg'>
      <div className='Road-Box'>
        <div className='box1' onClick={() => handleNavigation('/')}>
          <p>소개 사이트</p>
        </div>
        <div className='box2' onClick={() => handleNavigation('/main')}>
          <p>실시간 그래프</p>
        </div>
        <div className='box3' onClick={() => handleNavigation('/detail')}>
          <p>세부정보</p>
        </div>
        <div className='box4' onClick={() => handleNavigation('#')}>
          <p>블라블라</p>
        </div>
      </div>
    </div>
  );
}

export default RoadComponent;
