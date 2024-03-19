import { useState, useEffect, useContext } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { LoggedInContext } from "../contexts/LoggedInContext";
import "./Profile.css"
import CluckBox from "../components/CluckBox";

export default function ChangeProfileForm() {
  let { profileId } = useParams();
  const [userData, setUserData] = useState({
    bio: "",
    username: "",
    email: "",
    followers: [],
    following: [],
  });
  const [isFollowing, setFollowing]= useState(false);
  const { userId, setUserId } = useContext(LoggedInContext);
  const [userClucks, setUserClucks] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const [loginResponse, followingResponse, profileResponse, cluckResponse] = await Promise.all([
          axios.get("/check-login"),
          axios.get(`/isFollowing/${profileId}`),
          axios.get(`/profile/userData/${profileId}`, {}),
          axios.get(`/clucks/user/${profileId}`)
        ]);
  
        if (loginResponse.data.isLoggedIn) {
          setUserId(loginResponse.data.userId);
        }
  
        setFollowing(followingResponse.data.isFollowing);
  
        setUserData({...userData,
          bio: profileResponse.data.bio,
          username: profileResponse.data.userName,
          email: profileResponse.data.email,
          followers: profileResponse.data.followers,
          following: profileResponse.data.following
        });
        
        setUserClucks(cluckResponse.data);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    getUserData();
  }, [userId, profileId, setUserId, userData]);

  const handleChange = (e) => {
    setUserData(prevState => ({ ...prevState, bio: e.target.value }));
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('/profile', {
          bio: userData.bio
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

      setFollowing(true);
      setUserData({...userData, followers: [...userData.followers, userId]})
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

      setFollowing(false);
      setUserData({...userData, followers: userData.followers.filter(follower => follower !== userId)});
    };
 
    return (
        <div className="profile-container">
            <div className="profile-info">
                <div className="top-left">
                    <p className="profileUsername">@{userData.username}</p>
                    <p className="email">{userData.email}</p>
                </div>

                <div className="next-to-top-left">
                    <p className="followers">Followers: {userData.followers.length}</p>
                    <p className="following">Following: {userData.following.length}</p>
                </div>
            </div>            

            {profileId == userId ? null : 
                <div className="top-right">
                    {isFollowing ? (
                        <button onClick={handleUnfollow}>Unfollow</button>
                    ) : (
                        <button onClick={handleFollow}>Follow</button>
                    )}
                </div>
            }

            {profileId == userId ? (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="bio"></label>
                    <textarea
                        id="bio"
                        type="text"
                        name="bio"
                        placeholder="Change your bio..."
                        value={userData.bio}
                        onChange={handleChange}
                        data-testid="bio"
                    ></textarea>
                    <button type="submit">Update Profile</button>
                </form>
            ) : (
                <div className="top-left">
                    <p className="bio">{userData.bio}</p>
                </div>
            )}
            <div>
                {userClucks?.map(cluck => (
                    <CluckBox key={cluck._id} cluck={cluck} />
                ))}
            </div>
        </div>
    );
}
