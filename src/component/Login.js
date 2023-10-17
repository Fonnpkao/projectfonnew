import React, { useState, useEffect } from 'react';
import { Modal, Input, Button } from "antd";
import { useNavigate } from 'react-router-dom';
import Register from './Register';

const LoginBox = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);  // เพื่อตรวจสอบว่าควรแสดง <Register/> 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ย้ายการใช้ useNavigate ไปในคอมโพเนนต์

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  //เพิ่มฟังก์ชันใน Modal สำหรับปิด Modal เมื่อคลิก "Register":
  const handleRegisterClick = () => {
    setShowRegister(true);
    setIsModalOpen(false);
  };

  return (
    <>
      <form>
        <Modal
          title="Login"
          open={isModalOpen}
          footer={null} // กำหนด footer เป็น null เพื่อไม่แสดงปุ่ม "OK" และ "Cancel"
          closable={false} // กำหนด closable เป็น false เพื่อไม่แสดงเครื่องหมาย "X"
        >
          <div>
            <label>Username</label>
            <Input
              placeholder="Username"
              value={username}
            />
          </div>
          <div style={{ paddingTop: '15px' }}>
            <label>Password</label>
            <Input.Password
              placeholder="Password"
              value={password}
            />
          </div>
          <div style={{ paddingTop: '20px' }}>
            <Button type="primary">Login</Button>
            {/* <Button>Cancel</Button> */}
          </div>
          <div style={{ paddingTop: '20px' }}>
            <Button onClick={handleRegisterClick}>Register</Button>
          </div>
        </Modal>
      </form>
      {showRegister && <Register/>}  
    </>
  );
};

export default LoginBox;
