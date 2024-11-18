// import { Outlet } from "react-router-dom";

// const AuthLayout = () => {
//   return (
//     <div className={styles["full-screen"]}>
//       <Outlet />
//     </div>
//   );
// };

// export default AuthLayout;


// src/components/AuthLayout.tsx

import React from 'react';
import SignIn from './auth/SignIn/index';
import SignUp from './auth/SignUp/index';
import styles from "./styles.module.css";

const AuthLayout: React.FC = () => {
    return (
        <div className={styles['auth-container']}>
            <div className={styles["auth-column"]}>
                <SignIn />
            </div>
            <div className={styles["auth-column"]}>
                <SignUp />
            </div>
        </div>
    );
};

export default AuthLayout;

