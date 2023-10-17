const express = require('express');
// const bodyParser = require('body-parser');
const app = express();
const port = 3001;
const mysql = require('mysql2');
const cors = require("cors");
const bcrypt = require('bcrypt');



const db = mysql.createConnection({
  host: 'localhost', // เปลี่ยนเป็นที่อยู่ของ MySQL server ของคุณ
  user: 'root', // เปลี่ยนเป็นชื่อผู้ใช้ MySQL ของคุณ
  password: '555999', // เปลี่ยนเป็นรหัสผ่าน MySQL ของคุณ
  database: 'projectfon', // เปลี่ยนเป็นชื่อฐานข้อมูล MySQL ของคุณ
  port : 3333,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});
module.exports = db;

// app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

async function queryDatabase(sql, values) {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}


async function validateRegistrationData(idmem, memname, mempwd, conpwd) {    //validateRegistrationData เป็นฟังก์ชันที่ใช้ในการตรวจสอบข้อมูลที่ส่งมาในการลงทะเบียนผู้ใช้
  if (!idmem || !memname || !mempwd || !conpwd || mempwd !== conpwd) {
    throw new Error('Invalid registration data');
  }
}

async function checkIdmemAvailability(idmem) {
  // ใช้ db.query ในการตรวจสอบ idmem โดยตรงจากฐานข้อมูล
  const results = await queryDatabase('SELECT COUNT(*) AS count FROM member WHERE idmem = ?', [idmem]);
  return results[0]['count'] === 0;
}

async function registerUser(idmem, memname, mempwd, conpwd) {
  await queryDatabase('INSERT INTO member (idmem, memname, mempwd, conpwd) VALUES (?, ?, ?, ?)', [idmem, memname, mempwd, conpwd]);
}


// app.post('/api/register', async (req, res) => {
//   const { idmem, memname, mempwd, conpwd } = req.body;

//   try {
//     validateRegistrationData(idmem, memname, mempwd, conpwd);

//     const isIdmemUnique = await checkIdmemAvailability(idmem);

//     if (!isIdmemUnique) {
//       return res.status(400).json({ code:400, message: 'UserID ซ้ำ' });
//     }

//     await registerUser(idmem, memname, mempwd, conpwd);

//     return res.json({ code:200 ,message: 'Registration successful' });
//   } catch (error) {
//     console.error('Error during registration:', error);
//     return res.status(500).json({ code:500 ,message: 'Registration failed' });
//   }
// });


app.post('/api/register', async (req, res) => {
  const { idmem, memname, mempwd, conpwd } = req.body;

  try {
    validateRegistrationData(idmem, memname, mempwd, conpwd);

    const isIdmemUnique = await checkIdmemAvailability(idmem);
    //ถ้าไม่เท่ากับ0
    if (!isIdmemUnique) {
      return res.status(400).json({ code: 400, message: 'UserID ซ้ำ' });
    }

    // เข้ารหัสรหัสผ่านของผู้ใช้ด้วย bcrypt
    const hashedPassword = await bcrypt.hash(mempwd, 10); // 10 เป็นค่าความแข็งแกร่งของ bcrypt

    // ทำการลงทะเบียนผู้ใช้โดยเก็บค่า hash ของรหัสผ่าน
    await registerUser(idmem, memname, hashedPassword,hashedPassword);

    return res.json({ code: 200, message: 'ลงทะเบียนเรียบร้อย' });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ code: 500, message: 'ลงทะเบียนล้มเหลว' });
  }
});


// app.post('/api/check-idmem', (req, res) => {
//   const { idmem } = req.body;
//     if (results.length > 0) {
//       // ถ้า idmem ซ้ำกับข้อมูลที่มีอยู่ในฐานข้อมูล
//       res.json({ isUnique: false });
//     } else {
//       // ถ้า idmem ไม่ซ้ำกับข้อมูลที่มีอยู่ในฐานข้อมูล
//       res.json({ isUnique: true });
//     }
//   });
// });
















app.get('/api/data', (req, res) => {
  const data = { message: 'Hello from the API server!' };
  res.json(data);
});














app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
