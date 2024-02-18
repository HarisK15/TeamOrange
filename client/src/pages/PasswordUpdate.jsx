import { useState } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";


export default function ChangePasswordForm() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: '',
        currentPassword: '',
        newPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, currentPassword, newPassword } = data;
        try {
            const response = await axios.post('change-password', {
                email,
                currentPassword,
                newPassword,
            });
            toast.success(response.data.message);
            setData({
                email: '',
                currentPassword: '',
                newPassword: '',
            });
            navigate('/')
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.error);
            } else {
                toast.error('An error occurred. Please try again.');
            }
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter email address..."
                    value={data.email}
                    onChange={handleChange}
                />
                <label>Current Password</label>
                <input
                    type="password"
                    name="currentPassword"
                    placeholder="Enter current password..."
                    value={data.currentPassword}
                    onChange={handleChange}
                />
                <label>New Password</label>
                <input
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password..."
                    value={data.newPassword}
                    onChange={handleChange}
                />
                <button type="submit">Change Password</button>
            </form>
        </div>
    );
}