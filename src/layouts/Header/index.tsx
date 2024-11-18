import { Flex, Button } from "antd";
import { IconHelp } from "@tabler/icons-react";
import { Notification, ProfileButton } from "../../components/header";
import { IconButton } from "../../components/common/index";
import styles from "./styles.module.css";
import React, { useState, useEffect } from 'react';
const imageBaseURL = `${process.env.REACT_APP_BACKEND_URL || ""}storage/`;



const Header = () => {
  const [logo, setLogo] = useState(null);
  useEffect(() => {
    // Retrieve the image from localStorage
    const storedLogo = localStorage.getItem('company_logo');
    if (storedLogo) {
      setLogo(storedLogo);  // Set the image source to the base64 string
    }
  }, []);

  return (
    <header className={styles.header}>
      <Flex align="center" justify="space-between">
        {logo ? (
          <a
            href={`${process.env.REACT_APP_BASE_URL || ""}/`}
            className={styles.logo}
          >
            <img src={imageBaseURL + logo} alt="COEXSYS"  className={styles.companyLogo} />
          </a>

        ) : (
          <a
            href={`${process.env.REACT_APP_BASE_URL || ""}/`}
            className={styles.logo}
          >
            COEXSYS
          </a>
        )}
        <Button
          type="primary"
          size="small"
          href={`${process.env.REACT_APP_BASE_URL || ""}/new_project`}
        >
          My Project
        </Button>

        <Flex align="center" gap={4}>
          <Button
            type="link"
            href={`${process.env.REACT_APP_BASE_URL || ""}/dashboard`}
          >
            Admin Workbench
          </Button>

          <Notification />

          <IconButton>
            <IconHelp color="#666" size={18} />
          </IconButton>

          <ProfileButton />
        </Flex>
      </Flex>
    </header>
  );
};

export default Header;
