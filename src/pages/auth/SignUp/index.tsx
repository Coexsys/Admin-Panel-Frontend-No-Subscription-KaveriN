import { Space, Input, Flex, Button, Checkbox, Alert } from "antd";
import { IconUser, IconLock } from "@tabler/icons-react";
import styles from "./styles.module.css";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import React, { useState } from 'react';
const baseURL = `${process.env.REACT_APP_BACKEND_URL || ""}api/`;



function useQuery() {
  return new URLSearchParams(useLocation().search);
}
interface FormData {
  email: string;
  companyName: string;
  acceptTerms: boolean;
  plan: any;

}

const SignUp = () => {
  const navigate = useNavigate();
  const path= `${process.env.REACT_APP_BASE_URL || ""}`;
  const image_path = path + "/images/header_logo.png";


  const query = useQuery();
  const [email, setEmail] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [acceptTerms, setAcceptTerms] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const plan = query.get('planCode');
  const planPrice = query.get('planPrice');

  const redirectToPlans = async () => {
    navigate(path+'/auth/zoho');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simple validation
    if (!email) {
      setError('Email field is required.');
      return;
    }
    if (!companyName) {
      setError('CompanyName field is required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Email should be valid');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // Example API call to backend
      const response = await axios.post(baseURL+'signup', {email, companyName, plan});
      console.log('User subscribed to selected plan successfully', response.data);
      let subscribe_id = response.data.subscription_details;
      navigate(path+`/auth/signup-confirmation`);
    }  catch (error) {
      // Handle error response from backend (e.g., wrong credentials)
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'Signup Failed');
      } else {
        setError('An error occurred during login');
      }
    } finally {
      setLoading(false);
    }

  };


  return (
    <Flex style={{ height: "70vh", justifyContent: "center", alignItems: "center", paddingTop: "40px" }}>
      <Space direction="vertical" size="large" className={styles.side}>
        <Space direction="vertical" size="small" className={styles.main}>
          <img src={image_path} alt="logo" className={styles.logo} />
          <p className={styles.leading}>Plan Selected : <span><strong>{plan}:</strong> {planPrice}</span></p>
        </Space>
        <form onSubmit={handleSubmit}>
        {error && (
            <Alert message={error} type='error' closable />
          )}
          <Space direction="vertical" size="small" className={styles.main}>
            <p className={styles.leading}>Email</p>
            <Input prefix={<IconUser size={18} />} size="large" name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
               />
          </Space>

          <Space direction="vertical" size="small" className={styles.main}>
            <p className={styles.leading}>Company Name</p>
            <Input type="text" size="large" name="companyName" value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
               />

          </Space>
          <Space direction="vertical" size="small" className={styles.main}>
            <Checkbox id="terms" required > <label htmlFor="terms">I agree to the <a href="/">Terms of Use</a></label></Checkbox>
          </Space>

          <Flex justify="end">
            <button type="submit" className={styles.submitbutton} disabled={loading}>{loading ? 'Activating 14 days trial...' : 'Activate 14 days trial'}</button>
          </Flex>
        </form>
      </Space>
    </Flex>
  );

  //   );
};

export default SignUp;


// import React from 'react';
// import { Space, Input, Flex, Button } from "antd";

// // import './App.css';
// import "./styles.module.css";

// const SignUp: React.FC = () => {
//   return (
//     <Flex style={{ height: "100vh", justifyContent: "center", alignItems: "center" }}>
//       <Space direction="vertical" size="large">
//         <Input placeholder="Email" />
//         <Input placeholder="Company Name" />
//         <Button type="primary">Submit</Button>
//       </Space>
//     </Flex>


//   );
// }

// export default SignUp;
