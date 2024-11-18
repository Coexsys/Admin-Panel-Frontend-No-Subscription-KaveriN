import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Space, Input, Flex, Button, Alert } from "antd";
import { IconLock } from "@tabler/icons-react";
import styles from "./styles.module.css";
import axios from 'axios';

const ForgotPassword = () => {
  const location = useLocation(); // Access the state passed from the previous page
  const navigate = useNavigate();
  const path= `${process.env.REACT_APP_BASE_URL || ""}`;
  const image_path = path + "/images/header_logo.png";



  const [password, setPassword] = useState<string>('');
  const { id } = useParams<{ id: string }>(); 
  const [retypepassword, setReTypePassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const baseURL = `${process.env.REACT_APP_BACKEND_URL || ""}api/`;


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simple validation
    if (password === '' || retypepassword === '') {
      setError('Both password fields are required.');
      return;
    }

    if (password !== retypepassword) {
      setError('Retyped password should match with the new password.');
      return;
    }

    // Regex patterns for validation
    const passwordRules = {
      minLength: 8,
      uppercase: /[A-Z]/,
      lowercase: /[a-z]/,
      number: /[0-9]/,
      specialChar: /[!@#$%^&*(),.?":{}|<>]/,
    };
    if (password.length < passwordRules.minLength) {
      setError(`Password must be at least ${passwordRules.minLength} characters long.`);
    }
    if (!passwordRules.uppercase.test(password)) {
      setError('Password must contain at least one uppercase letter.');
    }
    if (!passwordRules.lowercase.test(password)) {
      setError('Password must contain at least one lowercase letter.');
    }
    if (!passwordRules.number.test(password)) {
      setError('Password must contain at least one number.');
    }
    if (!passwordRules.specialChar.test(password)) {
      setError('Password must contain at least one special character.');
    }
    setError(null);
    setLoading(true);

    try {
      // Send the login details to the backend
      const response = await axios.post(baseURL+`reset-password`, {
        password, id
      });

      // Assuming the response contains a token or user information
      console.log('Password Reset successful:', response.data);
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
          <h3 className={styles.content}>Reset Password</h3>
        </Space>
        <form onSubmit={handleSubmit}>
          {/* Danger div for showing errors */}
          {error && (
            <Alert message={error} type='error' closable />
          )}
          <Space direction="vertical" size="small" className={styles.main}>
            <p className={styles.leading}>Password</p>
            <Input type='password' prefix={<IconLock size={18} />} size="large" name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Space>
          <Space direction="vertical" size="small" className={styles.main} style={{marginTop: "15px"}}>
            <p className={styles.leading}>ReType Password</p>
            <Input type='password' prefix={<IconLock size={18} />} size="large" name="retypepassword"
              value={retypepassword}
              onChange={(e) => setReTypePassword(e.target.value)}
            />
          </Space>
          <Flex justify="end">
          <button type="submit" className={styles.submitbutton} disabled={loading}>{loading ? 'Processing...' : 'Reset Password'}</button>
          </Flex>
        </form>
      </Space>
    </Flex>
  );

};

export default ForgotPassword;
