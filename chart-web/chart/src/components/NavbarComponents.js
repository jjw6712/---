import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext.js';
import '../css/navbar.css';
import logo from '../img/identify/logo-1280x720.png';

const Navbar = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { auth, logout } = useAuth();

  function toggleSidebar() {
    setIsSidebarVisible(!isSidebarVisible);
  }

  return (
    <nav className='container'>
      <a href="/">
        <img src={logo} className='logo' alt="logo" />
      </a>

      <ul className={`sidebar ${isSidebarVisible ? '' : 'hidden'}`}>
        <li onClick={toggleSidebar}><a href="/#"><svg style={{margin :'0px 49vw'}} xmlns="http://www.w3.org/2000/svg" fill='white' height="24" viewBox="0 -960 960 960" width="24"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></a></li>
        <li onClick={toggleSidebar}><Link to="/">Home</Link></li>
        <li onClick={toggleSidebar}><Link to="/road">Road</Link></li>
        <li onClick={toggleSidebar}><Link to="/main">chart</Link></li>
        <li onClick={toggleSidebar}><Link to="/detail">detail</Link></li>
        <li onClick={toggleSidebar}><Link to="/#">map</Link></li>
      </ul>

      <ul>
        <li className='hideOnMobile'><Link to="/">Home</Link></li>
        <li className='hideOnMobile'><Link to="/road">Road</Link></li>
        <li className='hideOnMobile'><Link to="/main">chart</Link></li>
        <li className='hideOnMobile'><Link to="/detail">detail</Link></li>
        <li className='hideOnMobile'><Link to="/#">map</Link></li>
        {auth.isLoggedIn && <li className='loginli'>{auth.username}</li>} {/* Here we display the username */}
        <li>
          {auth.isLoggedIn ? (
            <button className='loginbutton1' onClick={() => {
              logout();
              alert('로그아웃 하였습니다.');
            }}>Log out</button>
          ) : (
            <button className='loginbutton1'> <Link to="/login">Log in</Link></button>
          )}
        </li>
        <li className='hideOnPC' onClick={toggleSidebar}><a href="#"><svg style={{margin :'-10px 0px'}} xmlns="http://www.w3.org/2000/svg" fill='white' height="24" viewBox="0 -960 960 960" width="24"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg></a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
