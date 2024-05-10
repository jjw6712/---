import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './NavbarComponents'
import ReactFullpage from "@fullpage/react-fullpage";
import Coredata from './CoredataComponents';
import Teampics from './TeampicComponents';
import Footer from './FooterComponents';

import '../css/fullpage.css';

function FullpageComponents() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSectionTwoVisible, setIsSectionTwoVisible] = useState(false);
  const [isSectionThreeVisible, setIsSectionThreeVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const afterLoad = (origin, destination, direction) => {
    setIsSectionTwoVisible(destination.index === 1);
    setIsSectionThreeVisible(destination.index === 2);
  };

  // LoginComponent.js 내 로그아웃 함수
  const handleLogout = async () => {
    const response = await fetch('/logout', { method: 'GET' });
    if (response.ok) {
      alert('로그아웃 하였습니다');
      navigate('/');
    } else {
      alert('로그아웃 실패 ㅋㅋ');
    }
  };

  return (
    <div>
    <Navbar></Navbar>
    <ReactFullpage
      navigation
      anchors={["1", "2", "3", "4"]}
      sectionSelector=".section"
      slidesNavigation={true}
      controlArrows={!isMobile} // 모바일에서는 화살표를 비활성화
      afterLoad={afterLoad}
      render={({ state, fullpageApi }) => (
        <ReactFullpage.Wrapper>
          <div className="section">
            <div className="slide" id="page1-1">
              <p className="page1-1-text">Team
                <p>Alpha Circle</p>
              </p>
            </div>
            <div className="slide" id="page1-2"><p>page 1-2</p></div>
          </div>
          <div className="section">
            <div className="slide" id="page2-1"><Coredata isVisible={isSectionTwoVisible} /></div>
            <div className="slide" id="page2-2"><p>page 2-2</p></div>
            <div className="slide" id="page2-3"><p>page 2-3</p></div>
          </div>
          <div className="section" id="page3-1"><Teampics isVisible={isSectionThreeVisible} /></div>
          <div className="section" id="page4-1"><Footer style={{overflowY:'hidden'}}></Footer></div>
        </ReactFullpage.Wrapper>
      )}
    />
    </div>
  );
}

export default FullpageComponents;
