import { useState, useEffect, useContext } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { LoggedInContext } from "../contexts/LoggedInContext";
import "./Profile.css"


export default function ChangeProfileForm() {
  let { profileId } = useParams();
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isUser, setIsUser] = useState(false);
  const { userId, setUserId } = useContext(LoggedInContext);

  useEffect(() => {
    const getUserData = async () => {
    try {
        const loginResponse = await axios.get("/check-login");
        if (loginResponse.data.isLoggedIn) {
            setUserId(loginResponse.data.userId);
        }

        if (userId === profileId) {
            setIsUser(true);
        }

        const profileResponse = await axios.get(`/profile/userData/${profileId}`, {});
        setBio(profileResponse.data.bio);
        setUsername(profileResponse.data.userName);
        setEmail(profileResponse.data.email);
        setFollowers(profileResponse.data.followers);
        setFollowing(profileResponse.data.following);
    } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, []);

  const handleChange = (e) => {
    setBio(e.target.value);
  };

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

    const handleFollow = async () => {
      try {
        const response = await axios.post(`/follow/${profileId}`, {
          withCredentials: true,
        });
        toast.success(response.data.message);
      } catch (error) {
        console.error("Error following user:", error);
        if (error.response && error.response.data) {
          toast.error(error.response.data.error);
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
    };
  
    const handleUnfollow = async () => {
      try {
        const response = await axios.post(`/unfollow/${profileId}`, {
          withCredentials: true,
        });
        toast.success(response.data.message);
      } catch (error) {
        if (error.response && error.response.data) {
          toast.error(error.response.data.error);
        } else {
          toast.error("An error occurred. Please try again.");
        }
      }
    };
    
    return (
        <div className="profile-container">
            <div className="top-left">
                <p className="profileUsername">@{username}</p>
                <p className="email">{email}</p>
            </div>
            {isUser ? (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="bio"></label>
                    <textarea
                        id="bio"
                        type="text"
                        name="bio"
                        placeholder="Change your bio..."
                        value={bio}
                        onChange={handleChange}
                        data-testid="bio"
                    ></textarea>
                    <button type="submit">Update Profile</button>
                </form>
            ) : (
                <div className="top-left">
                    <p className="bio">{bio}</p>
                    <p>Followers: {followers}</p>
                    <p>Following: {following}</p>
                    <button onClick={handleFollow}>Follow</button>
                    <button onClick={handleUnfollow}>Unfollow</button>
                </div>
            )}
        </div>
    );
}
