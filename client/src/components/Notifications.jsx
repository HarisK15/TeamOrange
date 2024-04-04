import React from 'react';
import axios from 'axios';
import './Notifications.css';

const Notification = ({ notification }) => {
  const handleClick = async () => {
    try {
      await axios.put(`/notifications/${notification._id}`, {
        read: true
      });
    } catch (error) {
      console.error('Failed to update notification:', error);
    }

  };
  return (
    <div className={`notification ${notification.type}`} onClick={handleClick}>
      {notification.message ? (
        <p className="message">{notification.message}</p>
      ) : (
        <p className="no-message">There is no notification.</p>
      )}
      {  console.log('checker:', notification.message)}
    </div>
  );
};

export default Notification;
