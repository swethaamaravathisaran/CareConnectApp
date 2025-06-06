import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Components/LandingPage';
import LoginPage from './Components/LoginPage';
import BabyDashboard from './Components/BabyDashboard';
import LullabyRecommender from './Components/LullabyRecommender';

const getToken = () => localStorage.getItem('token');

function PrivateRoute({ children }) {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <BabyDashboard />
            </PrivateRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/lullaby"
          element={
            <PrivateRoute>
              <LullabyRecommender />
            </PrivateRoute>
          }
          />
      </Routes>
    </Router>
  );
}
