import React from 'react';
import '../css/Coredata.css';

function Coredata({ isVisible }) {
  // `isVisible` prop에 기반해 조건부 스타일을 적용하는 클래스 이름을 결정
  const containerClass = isVisible ? "grid-container visible" : "grid-container";

  return (
    <div>
      <p>Core Data</p>
      <div className={containerClass}>
        <div className="grid-card card">
          <p>RPM</p>
          <div className="card__content">
            <p className="card__title">RPM</p>
            <p className="card__description">바퀴의 분당 회전수를 나타내는 데이터</p>
            <button className="card__button">
              <a href="#">For More</a>
            </button>
          </div>
        </div>
        <div className="grid-card card">
          <p>Speed</p>
          <div className="card__content">
            <p className="card__title">Speed</p>
            <p className="card__description">속도 기록을 통해 차량이 얼마나 빠르게 가속했는지를 나타내는 데이터</p>
            <button className="card__button">
              <a href="#">For More</a>
            </button>
          </div>
        </div>
        <div className="grid-card card">
          <p>Throttle Pos</p>
          <div className="card__content">
            <p className="card__title">Throttle Pos</p>
            <p className="card__description">엑셀 발판 위치를 나타내는 데이터</p>
            <button className="card__button">
              <a href="#">For More</a>
            </button>
          </div>
        </div>
        <div className="grid-card card">
          <p>Timing Advance</p>
          <div className="card__content">
            <p className="card__title">Timing Advance</p>
            <p className="card__description">엔진 제어 시스템이 가속을 위해 연료의 점화 타이밍을 조정하고 있음을 나타내는 데이터</p>
            <button className="card__button">
              <a href="#">For More</a>
            </button>
          </div>
        </div>
        <div className="grid-card card">
          <p>Engine Load</p>
          <div className="card__content">
            <p className="card__title">Engine Load</p>
            <p className="card__description">엔진이 많은 출력을 내고 있으며 차량이 빠르게 가속하고 있음을 나타내는 데이터</p>
            <button className="card__button">
              <a href="#">For More</a>
            </button>
          </div>
        </div>
        <div className="grid-card card">
          <p>Rapid Acceleration</p>
          <div className="card__content">
            <p className="card__title">Rapid Acceleration</p>
            <p className="card__description">운전자가 급가속을 했는지 여부를 직접적으로 나타내는 데이터</p>
            <button className="card__button">
              <a href="#">For More</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Coredata;
