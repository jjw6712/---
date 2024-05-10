// LoginComponent.js
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate를 import
import { useAuth } from './AuthContext.js';
import '../css/LoginComponent.css';

function LoginComponent() {
  const { login } = useAuth();
  const [isFlipped, setIsFlipped] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone1: '',
    phone2: '',
    phone3: '',
    sex: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    vehicleNum: ''
  });

  const phone2Ref = useRef();
  const phone3Ref = useRef();
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleToggleChange = () => {
    setIsFlipped(!isFlipped);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));

    if (name === 'phone1' && value.length === 3) {
      phone2Ref.current.focus();
    } else if (name === 'phone2' && value.length === 4) {
      phone3Ref.current.focus();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password, name, phone1, phone2, phone3, sex, birthYear, birthMonth, birthDay, vehicleNum } = formData;
    const fullPhone = `${phone1}-${phone2}-${phone3}`;
    const birth = `${birthYear}-${birthMonth}-${birthDay}`;

    const submitData = {
      email,
      password,
      name,
      phone: fullPhone,
      sex,
      birth,
      vehicleNum
    };

    delete submitData.phone1;
    delete submitData.phone2;
    delete submitData.phone3;
    delete submitData.birthYear;
    delete submitData.birthMonth;
    delete submitData.birthDay;

    const url = isFlipped ? '/api/signup' : '/api/login';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitData)
    });

    if (response.ok) {
      const data = await response.json(); // 응답 JSON을 파싱
      if (url === '/api/login') {
        login(data.username);
        alert(`환영합니다 ${data.username}`); // 사용자 ID를 알림 메시지에 포함
        navigate('/'); // 로그인 성공 시 /으로 이동
      } else {
        alert('회원가입이 완료되었습니다!!');
        setIsFlipped(false); // 회원가입 성공 시 로그인 화면으로 전환
      }
    } else {
      const data = await response.json();
      alert(data.message || (isFlipped ? '회원가입에 실패하였습니다.' : '로그인에 실패하였습니다.'));
    }
  };


  return (
    <div className="wrapper">
      <div className="card-switch">
        <label className="switch">
          <input type="checkbox" className="toggle" checked={isFlipped} onChange={handleToggleChange} />
          <span className="slider"></span>
          <div className={`flip-card__inner ${isFlipped ? 'flipped' : ''}`}>
            <div className="flip-card__front">
              <div className="title">Log in</div>
              <form className="flip-card__form" onSubmit={handleSubmit}>
                <input className="flip-card__input" name="email" placeholder="Email" type="email" onChange={handleChange} value={formData.email} />
                <input className="flip-card__input" name="password" placeholder="Password" type="password" onChange={handleChange} value={formData.password} />
                <button type="submit" className="flip-card__btn">Let's go!</button>
              </form>
            </div>
            <div className="flip-card__back">
              <div className="title">Sign up</div>
              <form className="flip-card__form" onSubmit={handleSubmit}>
                <input className="flip-card__input" name="name" placeholder="Name" type="text" onChange={handleChange} value={formData.name} />
                <input className="flip-card__input" name="email" placeholder="Email" type="email" onChange={handleChange} value={formData.email} />
                <input className="flip-card__input" name="password" placeholder="Password" type="password" onChange={handleChange} value={formData.password} />
                <div className="phone-input-group">
                  <input className="flip-card__input" name="phone1" placeholder="010" maxLength="3" onChange={handleChange} value={formData.phone1} />
                  <input className="flip-card__input" ref={phone2Ref} name="phone2" placeholder="0000" maxLength="4" onChange={handleChange} value={formData.phone2} />
                  <input className="flip-card__input" ref={phone3Ref} name="phone3" placeholder="0000" maxLength="4" onChange={handleChange} value={formData.phone3} />
                </div>
                <select className="flip-card__input" name="sex" onChange={handleChange} value={formData.sex}>
                  <option value="">Select Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <div className="birth-date-selectors">
                  <select className="flip-card__input" name="birthYear" onChange={handleChange} value={formData.birthYear}>
                    <option value="">Year</option>
                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <select className="flip-card__input" name="birthMonth" onChange={handleChange} value={formData.birthMonth}>
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <select className="flip-card__input" name="birthDay" onChange={handleChange} value={formData.birthDay}>
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <input className="flip-card__input" name="vehicleNum" placeholder="Vehicle Number" onChange={handleChange} value={formData.vehicleNum} />
                <button type="submit" className="flip-card__btn">Confirm!</button>
              </form>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}

export default LoginComponent;
