import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/google-login', {
        token: credentialResponse.credential,
      });

      localStorage.setItem('token', response.data.token);
      alert('Login successful!');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Google Login failed:', error);
      alert('Google Login failed. Please try again.');
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      alert('Login successful!');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Email Login failed:', error.response?.data || error.message);
      alert('Invalid credentials or user not registered.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      alert('Registration successful!');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      alert('Registration failed. Try with a different email.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-box">
          <h1>{isLogin ? 'Login to CareConnect' : 'Register on CareConnect'}</h1>

          {isLogin ? (
            <form onSubmit={handleEmailLogin} className="login-form">
              <input
                type="email"
                placeholder="Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="btn-primary">Login</button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="login-form">
              <input
                type="text"
                placeholder="Name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="btn-primary">Register</button>
            </form>
          )}

          <div className="divider">OR</div>

          <div className="google-login">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert('Google login failed')}
            />
          </div>
        </div>

        <div className="bottom-switch">
          {isLogin ? (
            <p>
              Don’t have an account?{' '}
              <span onClick={() => setIsLogin(false)}>Sign up</span>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <span onClick={() => setIsLogin(true)}>Login</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
