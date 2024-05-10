//server.js

const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');
const DB_CONFIG = require('./key');
const cors = require('cors');

const app = express();
const port = 3001;
app.use(bodyParser.json());
const pool = mysql.createPool({
  ...DB_CONFIG,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 비디오 파일이 저장된 디렉토리 경로
const pedalVideoDirectory = path.join(__dirname, 'SW_18', 'pedalvideo');
const faceVideoDirectory = path.join(__dirname, 'SW_18', 'facevideo');


// CORS 미들웨어를 사용하여 모든 도메인에서의 접근을 허용
app.use(cors());

// 정적 파일 경로 설정
app.use('/pedalvideo', express.static(pedalVideoDirectory));
app.use('/facevideo', express.static(faceVideoDirectory));


// session 미들웨어 설정
app.use(session({
  secret: '1234',  // 세션을 암호화하는 비밀키
  resave: false,              // 세션이 변경되지 않았다면 저장하지 않음
  saveUninitialized: false,   // 세션이 초기화되지 않았다면 저장하지 않음
  cookie: {
    httpOnly: true,           // 클라이언트 측 스크립트에서 쿠키를 읽지 못하도록 설정
    secure: false,            // HTTPS를 사용하지 않는 경우 false로 설정
    maxAge: 1000 * 60 * 60    // 쿠키의 최대 유효 시간 (1시간)
  }
}));

const promisePool = pool.promise();
const buildPath = path.join(__dirname, 'chart/build');
app.use(express.static(buildPath));

// API 라우트를 먼저 정의합니다.
app.get('/car-data', async (req, res) => {
  try {
    const [rows, fields] = await promisePool.query("SELECT * FROM `junshqpf1@naver.com`");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error while fetching car data');
  }
});

app.post('/api/signup', async (req, res) => {
  const { email, password, name, phone, sex, birth, vehicleNum } = req.body;
  try {
    const [userByEmail] = await promisePool.query('SELECT * FROM user WHERE user_ID = ?', [email]);
    if (userByEmail.length > 0) {
      return res.status(409).json({ message: '이미 가입된 ID 입니다.' });
    }

    const [userByPhone] = await promisePool.query('SELECT * FROM user WHERE user_Phone_Num = ?', [phone]);
    if (userByPhone.length > 0) {
      return res.status(409).json({ message: '이미 가입된 번호 입니다.' });
    }

    const [userByVehicleNum] = await promisePool.query('SELECT * FROM user WHERE user_Vehicle_Num = ?', [vehicleNum]);
    if (userByVehicleNum.length > 0) {
      return res.status(409).json({ message: '이미 사용중인 차량번호 입니다..' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await promisePool.query('INSERT INTO user (user_ID, user_PW, user_Name, user_Phone_Num, user_Sex, user_birth, user_Vehicle_Num) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [email, hashedPassword, name, phone, sex, birth, vehicleNum]);
    res.status(201).json({ message: '회원가입이 완료되었습니다!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '회원가입에 실패하였습니다.' });
  }
});




// Node.js Express 서버 예시
// 로그인 API
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await promisePool.query('SELECT * FROM user WHERE user_ID = ?', [email]);
    if (users.length === 0) {
      res.status(404).send('User not found');
    } else {
      const user = users[0];
      const isValid = await bcrypt.compare(password, user.user_PW);
      if (isValid) {
        req.session.userId = user.user_ID;  // 세션에 사용자 ID 저장
        res.status(201).json({ message: '로그인 완료', username: user.user_Name });
      } else {
        res.status(401).json({ message: '로그인에 실패하였습니다.' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in');
  }
});

// 로그아웃 API
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Failed to logout');
    }
    res.send('Logout successful');
  });
});


// 다른 모든 GET 요청을 처리하는 라우트를 정의합니다.
// 이것은 API 라우트 뒤에 있어야 합니다.
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
