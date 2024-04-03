import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Notification from '../components/Notifications';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get('/notifications');
        console.log(res.data); // Log the response data
        setNotifications(res.data);
      } catch (err) {
        console.error(err); // Log any errors that occur
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notifications-page">
      {notifications.map(notification => (
        <Notification key={notification._id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationsPage;