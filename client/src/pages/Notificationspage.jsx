import React from 'react';
import Notification from './Notificationspage';

const NotificationsPage = ({ notifications }) => {
  return (
    <div className="notifications-page">
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationsPage;