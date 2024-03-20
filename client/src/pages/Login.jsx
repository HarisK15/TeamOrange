import { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { LoggedInContext } from '../contexts/LoggedInContext';
import LoginForm from '../components/LoginForm';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const { setIsLoggedIn } = useContext(LoggedInContext);

  // sends a get request to the root page without the bowser automatically refreshing the page
  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = data;
    try {
      const { data } = await axios.post('login', {
        email,
        password,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({});
        navigate('/Clucks');
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='login'>
      <LoginForm data={data} setData={setData} loginUser={loginUser} />
    </div>
  );
}
