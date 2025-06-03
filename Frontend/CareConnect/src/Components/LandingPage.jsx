import React from "react";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="overlay">
        <div className="content">
          <h1>Welcome to CareConnect</h1>
          <p>Your trusted baby care companion app</p>
          <button
            className="btn-primary"
            onClick={() => alert("Get Started clicked!")}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
