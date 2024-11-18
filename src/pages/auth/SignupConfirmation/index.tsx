import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Space, Input, Flex, Button, Checkbox } from "antd";
import styles from "./styles.module.css";


const SignupConfirmation = () => {
  const location = useLocation(); // Access the state passed from the previous page
  const navigate = useNavigate();
  const path= `${process.env.REACT_APP_BASE_URL || ""}`;
  const image_path = path + "/images/header_logo.png";


  return (
    <Flex style={{ height: "70vh", justifyContent: "center", alignItems: "center", paddingTop: "40px" }}>
      <Space direction="vertical" size="large" className={styles.side}>
        <Space direction="vertical" size="small" className={styles.main}>
          <img src={image_path} alt="logo" className={styles.logo} />
          <h3 className={styles.content}>Congratulations!</h3>
          <p className={styles.content}>Thank you for subscribing to !</p>
          <p className={styles.content}>Your subscription details have been emailed to your Mail Address</p>
        </Space>
        <Flex justify="center" gap={8} className={styles.footer}>
          <a href={`${process.env.REACT_APP_BASE_URL || ""}/auth/signin`}>Login Here</a>
        </Flex>
      </Space>
    </Flex>
  );

};

export default SignupConfirmation;
