import { useState, useContext } from 'react';
import axios from 'axios';
import './Login.css';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { LoggedInContext } from '../contexts/LoggedInContext';
import LoginForm from '../components/LoginForm';



export default function Login() {
const navigate = useNavigate();
const [data, setData] = useState({
email: '',
password: '',
});
const { setIsLoggedIn } = useContext(LoggedInContext);
const loginUser = async (e) => {
e.preventDefault();
const { email, password } = data;
try {
const response = await axios.post('/login', { email, password });
if (response.data.error) {
toast.error(response.data.error);
} else {
setData({});
navigate('/Clucks');
setIsLoggedIn(true);
}
} catch (error) {
toast.error(error);
}
};



return (
<div className='login'>
<LoginForm data={data} setData={setData} loginUser={loginUser} />
</div>
);
}