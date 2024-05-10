// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';

import P404 from './components/404Components'
import ReactFullpage from './components/FullpageComponent'

import MainComponent from './components/MainComponents';
import LoginComponent from './components/LoginComponent';
import DetailComponent from './components/DetailComponents';
import RoadComponent from './components/RoadComponents';
import CollisionComponent from './components/CollisionComponents';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path='/' element={<ReactFullpage></ReactFullpage>}></Route>

            <Route path="/login" element={<LoginComponent />} />
            <Route path="/road" element={<RoadComponent />} />
            <Route path="/main" element={<MainComponent />} />
            <Route path="/detail" element={<DetailComponent />} />
			<Route path="/collision" element={<CollisionComponent />} />
			  
            <Route path='*' element={<P404></P404>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
