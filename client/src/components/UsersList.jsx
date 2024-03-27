import { useEffect, useState } from 'react';
import './UsersList.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import profilePicUrl from '../images/default-pic.jpg';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/search/users/whoToFollow');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <div className='user-box'>
      <h4 className='user-heading'>Who to follow</h4>
      {users?.map?.((user) => (
        <div className='user-header' key={user._id}>
          <img src={profilePicUrl} alt='Profile' className='profile-pic' />
          <div className='name-username'>
            <h4 className='name'>{user.userName}</h4>
            <Link to={`/Profile/${user._id}`}>
              <h4 className='username'>@{user.userName}</h4>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersList;
