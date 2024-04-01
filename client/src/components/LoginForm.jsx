import React, { useState } from 'react';
import './LoginForm.css'; // Import the CSS file

const LoginForm = ({ loginUser, data, setData }) => {
  return (
    <div className="form-container">
      <h1 className="brand-name">Clucker</h1>
      <form onSubmit={loginUser}>
        <div>
          <label htmlFor="email"></label>
          <input 
            id="email" 
            type='email' 
            placeholder='Email Address' 
            value={data.email} 
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="input-field" // Apply CSS class for input
          />
        </div>
        <div>
          <label htmlFor="password"></label>
          <input 
            id="password" 
            type='password' 
            placeholder='Password' 
            value={data.password} 
            onChange={(e) => setData({ ...data, password: e.target.value })}
            className="input-field" // Apply CSS class for input
          />
        </div>
        <button type='submit' className="button">Log In</button>
      </form>
    </div>
  );
};


export default LoginForm;
