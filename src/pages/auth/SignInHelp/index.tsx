import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Space, Input, Flex, Button, Alert } from "antd";
import { IconUser } from "@tabler/icons-react";
import styles from "./styles.module.css";
import axios from 'axios';


const SignInHelp = () => {
  const location = useLocation(); // Access the state passed from the previous page
  const navigate = useNavigate();
  const path= `${process.env.REACT_APP_BASE_URL || ""}`;
  const image_path = path + "/images/header_logo.png";



  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const baseURL = `${process.env.REACT_APP_BACKEND_URL || ""}api/`;


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simple validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || ! emailRegex.test(email)) {
      setError('Email should be valid');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Send the login details to the backend
      const response = await axios.post(baseURL+`send-otp`, {
        email,
      });

      // Assuming the response contains a token or user information
      console.log('Login successful:', response.data);

      // Optionally, handle the token (e.g., save it to localStorage)

      // localStorage.setItem('bearerToken', response.data.token);
      // login(); // Call login from context
      navigate(path+'/auth/signin'); // Redirect to dashboard
    } catch (error) {
      // Handle error response from backend (e.g., wrong credentials)
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'Reset failed');
      } else {
        setError('An error occurred during login');
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <Flex style={{ height: "70vh", justifyContent: "center", alignItems: "center", paddingTop: "40px" }}>
      <Space direction="vertical" size="large" className={styles.side}>
        <Space direction="vertical" size="small" className={styles.main}>
          <img src={image_path} alt="logo" className={styles.logo} />
          <h3 className={styles.content}>Password Help!</h3>
          <p className={styles.content}>Enter your Registered Email Address if you just need password help. </p>
          <p className={styles.content}>We will send an email with Password instructions if username exists in our records. </p>
        </Space>
        <form onSubmit={handleSubmit}>
          {/* Danger div for showing errors */}
          {error && (
            <Alert message={error} type='error' closable/>
          )}
          <Space direction="vertical" size="small" className={styles.main}>
            <p className={styles.leading}>Email</p>
            <Input prefix={<IconUser size={18} />} size="large" name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Space>
          <Flex justify="end">
          <button type="submit" className={styles.submitbutton} disabled={loading}>{loading ? 'Sending...' : 'Send Login Instructions'}</button>
          </Flex>
        </form>
      </Space>
    </Flex>
  );

};

export default SignInHelp;
