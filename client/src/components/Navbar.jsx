import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('/check-login');
                setIsLoggedIn(response.data.isLoggedIn);
            } catch (error) {
                console.error('Failed to check login status:', error);
            }
        };

        checkLoginStatus();
    }, []);

    const logout = async () => {
        try {
            await axios.post('/logout');
            setIsLoggedIn(false);
            navigate('/Login');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    return (
        <nav>
            {isLoggedIn ? (
                <>
                    <Link to="/">Home</Link>
                    <Link to="/Clucks">Clucks</Link>
                    <Link to='/Profile'>Profile</Link>
                    <Link to='/Change-Password'>Change Password</Link>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to="/Register">Register</Link>
                    <Link to="/Login">Login</Link>
                </>
            )}
        </nav>
    );
}