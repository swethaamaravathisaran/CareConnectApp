import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Components/LandingPage";
import LoginPage from "./Components/LoginPage"; // adjust path as needed
import BabyDashboard from './Components/BabyDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<BabyDashboard />} />
        
      </Routes>
    </Router>
  );
};

export default App;
