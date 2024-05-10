import React, { useState } from 'react';
import '../css/Teampic.css';

function TeamPics({ isVisible }) {
  const [cards, setCards] = useState([
    { id: 1, name: '정진우', job: '팀장', isHovered: false, className: 'teampic1', hoverName: '개발 총괄 및 테스팅', hoverJob: '' },
    { id: 2, name: '김강우', job: '간사', isHovered: false, className: 'teampic2', hoverName: '서버개발 및 문서작업', hoverJob: '' },
    { id: 3, name: '김준영', job: '팀원', isHovered: false, className: 'teampic3', hoverName: '임베디드 및 테스팅', hoverJob: '' },
    { id: 4, name: '김창근', job: '팀원', isHovered: false, className: 'teampic4', hoverName: '서버개발 및 웹개발', hoverJob: '' },
  ]);

  const handleMouseOver = (id) => {
    setCards(cards.map(card =>
      card.id === id ? { ...card, isHovered: true } : card
    ));
  };

  const handleMouseOut = (id) => {
    setCards(cards.map(card =>
      card.id === id ? { ...card, isHovered: false } : card
    ));
  };

  return (
    <div className={`grid-introduce ${isVisible ? 'noneup' : ''}`}>
      {cards.map((card) => (
        <div 
          key={card.id}
          className="grid-introduce-card"
          onMouseOver={() => handleMouseOver(card.id)}
          onMouseOut={() => handleMouseOut(card.id)}
        >
          <div className={card.className}></div>
          <div className="text-container">
            <h3 className={`text-content ${!card.isHovered ? 'show' : ''}`}>
              {card.name}
            </h3>
            <h3 className={`text-content ${card.isHovered ? 'show' : ''}`}>
              {card.hoverName}
            </h3>
          </div>
          <div className="text-container">
            <p className={`text-content ${!card.isHovered ? 'show' : ''}`}>
              {card.job}
            </p>
            <p className={`text-content ${card.isHovered ? 'show' : ''}`}>
              {card.hoverJob}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TeamPics;
