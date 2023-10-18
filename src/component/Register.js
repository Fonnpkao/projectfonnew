import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import { Modal, Input, Button, message } from "antd";
import LoginBox from './Login';

function Register() {
  const [showLogin, setShowLogin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true); // เริ่มต้นค่าให้เปิดโมดัล
  const [idmem, setIdmem] = useState('');
  const [memname, setUsername] = useState('');
  const [mempwd, setPassword] = useState('');
  const [conpwd, setConfirmPWD] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const key = 'updatable';

  // const checkIdmemAvailability = async (idmem) => {
  //   try {
  //     const response = await Axios.post('http://localhost:3001/api/check-idmem', { idmem });
  //     return response.data.isUnique;
  //   } catch (error) {
  //     console.error('Error checking idmem availability:', error);
  //     return false; // หรือจัดการข้อผิดพลาดเช่น ไม่สามารถติดต่อกับเซิร์ฟเวอร์ได้
  //   }
  // };



  const handleRegister = async () => {
    if (!idmem || !memname || !mempwd || !conpwd || mempwd !== conpwd) {
      message.error('Please fill in all fields and make sure passwords match.');
      return;
    }

// ตรวจสอบความถูกต้องของ idmem โดยส่งคำขอไปยัง API
// const isIdmemUnique = await checkIdmemAvailability(idmem);

// if (!isIdmemUnique) {
//   message.error('UserID ซ้ำ');
//   return;
// }

    const data = {
      idmem,
      memname,
      mempwd,
      conpwd,
    };

    try {
      messageApi.open({
        key,
        type: 'loading',
        content: 'Action in progress..',
      });
      const response = await Axios.post('http://localhost:3001/api/register', data);
      const res = response.data;
      // if(res.code === 200){
        setTimeout(() => {
          messageApi.open({
            key,
            type: 'success',
            content: 'success!',
            duration: 2,
          });
          }, 1500);
          setTimeout(() => {
            setShowLogin(true);
            setIsModalOpen(false);
          }, 3000);
      // }
   
    } catch (error) {
      console.log(error);
      message.error(error.response.data?.message);
    }
  }

  const handleLoginClick = () => {
    setShowLogin(true);
    setIsModalOpen(false);
    // setIsModalLoginOpen(false);
    // setIsModalLoginBack(false);
    // console.log(ModalLoginOpen)

  };

  return (
    <>
    <form>
    <Modal
            title="Register" open={isModalOpen} 
            footer={null} // กำหนด footer เป็น null เพื่อไม่แสดงปุ่ม "OK" และ "Cancel"
            closable={false} // กำหนด closable เป็น false เพื่อไม่แสดงเครื่องหมาย "X"
        >
        <div tyle={{paddingTop:'10px'}}>
            <label>UserID</label>
            <Input placeholder="UserID"
            value={idmem}
            onChange={(e) => setIdmem(e.target.value)}
            />
        </div>
        <div style={{paddingTop:'10px'}}>
            <label>UserName</label>
            <Input placeholder="UserName"
            value={memname}
            onChange={(e) => setUsername(e.target.value)}
            />
        </div>
        <div style={{paddingTop:'10px'}}>
            <label>Password</label>
            <Input.Password placeholder="Password"
            value={mempwd}
            onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <div style={{paddingTop:'10px'}}>
            <label>Confirm Password</label>
            <Input.Password placeholder="Password"
            value={conpwd}
            onChange={(e) => setConfirmPWD(e.target.value)}
            />
        </div>
        <div style={{paddingTop:'20px'}}>
          {contextHolder}
            <Button type="primary" onClick={handleRegister}>Register</Button>
            {/* <Button>Cancel</Button> */}
        </div>  
        <div style={{paddingTop:'20px'}}>
            <Button onClick={handleLoginClick}>Back</Button>
        </div>  
    </Modal>
    </form>
    {showLogin && <LoginBox/>} 
    </>
  );
}

export default Register;
