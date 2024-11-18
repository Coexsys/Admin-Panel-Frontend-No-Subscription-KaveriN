//src/components/header/ProfileButton/index.tsx
import { Dropdown, Space, Avatar, Button } from "antd";
import type { MenuProps } from "antd";
import { IconUserFilled } from "@tabler/icons-react";
import styles from "./styles.module.css";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../pages/auth/AuthContext.js';
import UserDetailsModal from './UserDetailsModal';


interface User {
  id: number;
  full_name: string;
  email: string;
  // Add any other fields you want to store
}


const ProfileButton = () => {
  const { logout } = useAuth();

  const navigate = useNavigate();
  const path = `${process.env.REACT_APP_BASE_URL || ""}`;

  const [user, setUser] = useState<User | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(() => {
    // Get the user from localStorage and parse it
    let storedUser = localStorage.getItem('user');

    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []); // The empty dependency array ensures this effect runs only once when the component mounts.

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleLogout = async () => {
    // Get the token from localStorage (or wherever you store it)
    const token = localStorage.getItem('bearerToken');
    const baseURL = `${process.env.REACT_APP_BACKEND_URL || ""}api/`;


    if (token) {
      try {
        // Send the login details to the backend
        const response = await axios.post(baseURL + `api/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        logout();
        // localStorage.removeItem('bearerToken');
      } catch (error) {
        console.error('Error logging out', error);
      }
    }

    // Remove the token from localStorage (or sessionStorage)
    // localStorage.removeItem('bearerToken');

    // Optionally clear any other user data from storage
    // localStorage.removeItem('user');

    // Redirect the user to the login page
    navigate(path + '/auth/signin');
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <a target="_blank" href="https://help.coexsys.com/">Knowledgebase</a>,
    },
    {
      key: "2",
      label: <a onClick={() => handleOpenModal()}>Subscription Info</a>,
      // label:<Button onClick={() => handleOpenModal()}>View User Details</Button>

    },
    {
      key: "3",
      label:  <a href="#" onClick={handleLogout}>Logout</a>,
    },
    // {
    //   key: "4",
    //   label: <a href="#" onClick={handleLogout}>My Login History</a>,
    // },
  ];

  return (
    <div>
      <Dropdown menu={{ items }} trigger={["click"]}>
        <Space wrap={false} size={4} className={styles.profile}>
          <Avatar size={28} icon={<IconUserFilled size={18} />} />
          {user?.full_name}
        </Space>
      </Dropdown>
      <UserDetailsModal
        visible={isModalVisible}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export { ProfileButton };
