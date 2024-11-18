// hooks/useAuth.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const navigate = useNavigate();
  const path= `${process.env.REACT_APP_BASE_URL || ""}`;


  useEffect(() => {
    const token = localStorage.getItem('bearerToken'); // Fetch token from session storage

    if (!token) {
       navigate(path+'/auth/signin');
    }
  }, [navigate]);
};

export default useAuth;
