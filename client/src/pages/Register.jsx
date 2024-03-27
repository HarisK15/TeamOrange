import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import './Register.css';

export default function Register() {
  //variable navigate is used to navigate to another page
  const navigate = useNavigate();
  const [data, setData] = useState({
    userName: '',
    email: '',
    password: '',
  });

  //Prevents the page to automatically load
  const registerUser = async (e) => {
    e.preventDefault();
    //passing the data from the form as a post request
    const { userName, email, password } = data;
    try {
      const { data } = await axios.post('register', {
        userName,
        email,
        password,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({});
        toast.success('Login Successful. Welcome!');
        navigate('/login');
      }
    } catch (error) {}
  };

  return (
    // Render the RegisterForm component with the registration form fields and logic
    <div className='register'>
      <RegisterForm registerUser={registerUser} data={data} setData={setData} />
    </div>
  );
}
