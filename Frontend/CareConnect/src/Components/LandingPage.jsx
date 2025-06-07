import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="app-brand">CareConnect</div>
      <div className="overlay">
        <div className="content">
          <h1>Welcome to CareConnect</h1>
          <p>Your trusted baby care companion app</p>
          <button className="btn-primary" onClick={() => navigate("/login")}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
