import React, { useState } from 'react';
import './RegisterForm.css'; // Import the CSS file

const RegisterForm = ({ registerUser, data, setData }) => {
  return (
    <div className="form-container">
      <h1 className="brand-name">Clucker</h1>
      <form onSubmit={registerUser}>
        <div>
          <input 
            id="userName" 
            type='text' 
            placeholder='User Name' 
            value={data.userName} 
            onChange={(e) => setData({ ...data, userName: e.target.value })}
            className="input-field" // Apply CSS class for input
          />
        </div>
        <div>
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
          <input 
            id="password" 
            type='password' 
            placeholder='Password' 
            value={data.password} 
            onChange={(e) => setData({ ...data, password: e.target.value })}
            className="input-field" // Apply CSS class for input
          />
        </div>
        <button type='submit' className="button">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;

