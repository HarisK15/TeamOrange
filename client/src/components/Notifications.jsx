import React from 'react';
import './Notification.css';

const Notification = ({ notification }) => {
  return (
    <div className={`notification ${notification.type}`}>
      <p>{notification.message}</p>
    </div>
  );
};

export default Notification;