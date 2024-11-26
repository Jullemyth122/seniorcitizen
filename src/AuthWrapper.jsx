// components/AuthWrapper.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';

const AuthWrapper = () => {
  const location = useLocation();
  const isLoginOrMainRoute = location.pathname === '/';

  return (
    <div>
      {/* Render LoginComponent only on the main route ("/") or on the "/login" route */}
      {isLoginOrMainRoute && <LoginComponent />}
    </div>
  );
};

export default AuthWrapper;

