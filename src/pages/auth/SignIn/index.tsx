// src/pages/auth/SignIn/index.tsx
import { Space, Input, Flex, Alert } from "antd";
import { IconUser, IconEye, IconEyeClosed, IconLock } from "@tabler/icons-react";
import styles from "./styles.module.css";
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.js';



const SignIn = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const baseURL = `${process.env.REACT_APP_BACKEND_URL || ""}api/`;

  const { login } = useAuth();

  // useNavigate hook from React Router for redirection
  const navigate = useNavigate();
  const path= `${process.env.REACT_APP_BASE_URL || ""}`;
  const image_path = path + "/images/header_logo.png";
  const backgroundUrl = path + "/images/login-bg.svg"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Simple validation
    if (!email || !password) {
      setError('Both email and password are required');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Send the login details to the backend
      const response = await axios.post(baseURL+`login`, {
        email,
        password,
      });

      // Assuming the response contains a token or user information
      console.log('Login successful:', response.data);

      // Optionally, handle the token (e.g., save it to localStorage)

      localStorage.setItem('bearerToken', response.data.token);
      // localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('company_logo', response.data.company_logo);
      login((response.data.token));


      // login(); // Call login from context
      navigate(path+'/dashboard'); // Redirect to dashboard
    } catch (error) {
      // Handle error response from backend (e.g., wrong credentials)
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data.error)
        setError(error.response.data.error || 'Login failed');
      } else {
        setError('An error occurred during login');
      }
    } finally {
      setLoading(false);
    }
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);  // Update state when user types
  };


  return (
    <div className={styles.authContainer}>
      <div className={styles.signinColumn}>
        <Space direction="vertical" size="large" className={styles.side}>

          {/* {error && <p className={styles.errormessage}> {error}</p>} */}
          <form onSubmit={handleSubmit}>
            <Space direction="vertical" size="small" className={styles.main}>
              <img src={image_path} alt="logo" className={styles.logo} />
              {/* Danger div for showing errors */}
              {error && (
                <Alert message={error} type='error' closable />
              )}

              <p className={styles.leading}>UserName</p>
              <Input prefix={<IconUser size={18} />} size="large"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required />
            </Space>

            <Space direction="vertical" size="small" className={styles.main}>
              <p className={styles.leading}>Password</p>
              <Input type={passwordVisible ? 'text' : 'password'} id="password" value={password} prefix={<IconLock size={18} />} size="large"
                onChange={handlePasswordChange}
                suffix={
                  passwordVisible ? (
                    <IconEyeClosed size={18} onClick={togglePasswordVisibility} style={{ cursor: "pointer" }} />
                  ) : (
                    <IconEye size={18} onClick={togglePasswordVisibility} style={{ cursor: "pointer" }} />
                  )
                }
                required />
            </Space>

            <Flex justify="end">
              <button className={styles.submitbutton} type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
              {/* <Button>SignIn</Button> */}
            </Flex>
          </form>

          <Flex justify="center" gap={8} className={styles.footer}>
            <a href={`${process.env.REACT_APP_BASE_URL || ""}/auth/reset-password`}>Password Help</a>
          </Flex>
        </Space>
      </div>
      <div className={styles.signupColumn} style={{ backgroundImage: `url(${backgroundUrl})` }}>
        <Space direction="vertical" size="large" className={styles.signUpSide}>
          <Flex justify="center" gap={8} className={styles.footer}>
            <p className={styles.leading}>Don't have an account?</p>
            <a href={`${process.env.REACT_APP_BASE_URL || ""}/auth/plans`}>
              Create an Account
            </a>
          </Flex>

        </Space>
      </div>
    </div>

  );
};

export default SignIn;

