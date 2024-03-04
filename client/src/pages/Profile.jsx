import { useState, useEffect, useContext } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';


export default function ChangeProfileForm() {
    let { profileId } = useParams();
    const [bio, setBio] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isUser, setIsUser] = useState(false);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const loginresponse = await axios.get("/check-login");
                if (profileId === loginresponse.data.userId) {
                    setIsUser(true);
                }

                const response = await axios.get(`/profile/userData/${profileId}`, {});
                setBio(response.data.bio);
                setUsername(response.data.userName);
                setEmail(response.data.email);

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        getUserData();
    }, []);

    const handleChange = (e) => {
        setBio(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/profile', {
                bio
            });
            toast.success(response.data.message);
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
            {isUser ? (
                <form onSubmit={handleSubmit}>
                    <label>Bio</label>
                    <input
                        type="text"
                        name="bio"
                        placeholder="Change your bio..."
                        value={bio}
                        onChange={handleChange}
                    />
                    <button type="submit">Update Profile</button>
                </form>
            ) : (
                <div>
                    <p>Bio: {bio}</p>
                </div>
            )}
        </div>
    );
}