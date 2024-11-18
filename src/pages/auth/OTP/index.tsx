import { Space, Input, Flex, Button } from "antd";
import OTP from "antd/es/input/OTP";
import styles from "./styles.module.css";
const image_path = `${process.env.REACT_APP_BASE_URL || ""}`+"/images/header_logo.png";

const OTPUI = () => {
  return (
    <Space direction="vertical" size="large" className={styles.side}>
      <Space direction="vertical" size="small" className={styles.main}>
        <img src={image_path} alt="logo" className={styles.logo} />
        <p className={styles.leading}>
          Enter your OTP Code from your registered email
        </p>
        <OTP size="large" />
      </Space>

      <Flex justify="end">
        <Button>Proceed to SignIn</Button>
      </Flex>

      <Flex justify="center" gap={8} className={styles.footer}>
        <a href="#">Password Help</a>|
        <a href={`${process.env.REACT_APP_BASE_URL || ""}/auth/signup`}>
          SignUp
        </a>
      </Flex>
    </Space>
  );
};

export default OTPUI;
