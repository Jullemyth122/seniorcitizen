// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterComponent from './components/RegisterComponent';
import LoginComponent from './components/LoginComponent';
import AuthWrapper from './AuthWrapper';
import RegisterAdmin from './admin/RegistrationAdmin';
import CitizenHome from './components/CitizenHome';
import ForgotComponent from './components/ForgotComponent';
import WelcomeAdmin from './admin/WelcomeAdmin';
import Dashboard from './admin/Dashboard';
import { useFormContext } from './context/AdminFormContext';
import LoginAdmin from './admin/LoginAdmin';
import SCChapter from './admin/SCManagement/SCChapter';
import DSWD from './admin/SCManagement/DSWD';
import AccountSettings from './admin/AccountSettings';
import Systemsettings from './admin/Systemsettings';

const App = () => {
  const { isAdminAuthenticated } = useFormContext();

  return (
    <Router>
      <AuthWrapper />
      <Routes>
        <Route path='/login' element={<LoginComponent />} />
        <Route path='/signup' element={<RegisterComponent />} />
        <Route path='/forgot' element={<ForgotComponent />} />
        <Route path='/citizenhome' element={<CitizenHome />} />

        <Route path='/admin/register' element={<RegisterAdmin />} />
        <Route path='/admin/login' element={<LoginAdmin />} />

        {/* Conditional rendering based on authentication */}
        <Route
          path='/admin/welcome'
          element={isAdminAuthenticated ? <WelcomeAdmin /> : <Navigate to="/admin/login" />}
        />
        <Route
          path='/admin/dashboard'
          element={isAdminAuthenticated ? <Dashboard /> : <Navigate to="/admin/login" />}
        />

        <Route
          path='/admin/scchapter'
          element={isAdminAuthenticated ? <SCChapter /> : <Navigate to="/admin/scchapter" />}
        />

        <Route
          path='/admin/dswd'
          element={isAdminAuthenticated ? <DSWD /> : <Navigate to="/admin/dswd" />}
        />
        <Route
          path='/admin/accountsettings'
          element={isAdminAuthenticated ? <AccountSettings /> : <Navigate to="/admin/accountsettings" />}
        />
        <Route
          path='/admin/systemsettings'
          element={isAdminAuthenticated ? <Systemsettings /> : <Navigate to="/admin/systemsettings" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
