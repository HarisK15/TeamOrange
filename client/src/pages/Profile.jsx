import { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';


export default function ChangeProfileForm() {
    const [data, setData] = useState({
        bio: ''
    });
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Get previous bio from the server and update the state
        const getUserData = async () => {
            try {
                const bioresponse = await axios.get('/profile/bio');
                setData(prevData => ({
                    ...prevData,
                    bio: bioresponse.data.bio 
                }));

                const userResponse = await axios.get('/profile/username');
                setUsername(userResponse.data.username);

                const emailResponse = await axios.get('/profile/email');
                setEmail(emailResponse.data.email);
            } catch (error) {
                console.error('Error fetching bio:', error);
            }
        };

        getUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { bio } = data;
        try {
            const response = await axios.post('profile', {
                bio
            });
            toast.success(response.data.message);
            setData({
                bio: bio
            });
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
            <div>
                <p>Username: {username}</p>
                <p>Email: {email}</p>
            </div>
            <form onSubmit={handleSubmit}>
                <label>Bio</label>
                <input
                    type="text"
                    name="bio"
                    placeholder="Change your bio..."
                    value={data.bio}
                    onChange={handleChange}
                />
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
}