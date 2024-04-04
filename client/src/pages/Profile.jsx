import { useState, useEffect, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { LoggedInContext } from '../contexts/LoggedInContext';
import './Profile.css';
import CluckBox from '../components/CluckBox';
import UploadProfileImage from '../components/UploadProfileImage';


export default function ChangeProfileForm() {
  let { profileId } = useParams();
  const [userData, setUserData] = useState({
    bio: '',
    username: '',
    email: '',
    followers: [],
    following: [],
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState({});
  const [isFollowing, setFollowing] = useState(false);
  const { userId, setUserId } = useContext(LoggedInContext);
  const [userClucks, setUserClucks] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
const handleProfileImageUpload = (newProfileImage) => {
    setProfileImage(newProfileImage);
    }
  console.log('userClucks :', userClucks);

  const isBlocked = useMemo(
    () => loggedInUser.blocked?.includes(profileId),
    [loggedInUser?.blocked]
  );

  const getUserData = async () => {
    try {
      const [
        loginResponse,
        followingResponse,
        profileResponse,
        cluckResponse,
        loggedInUserResponse,
      ] = await Promise.all([
        axios.get('/check-login'),
        axios.get(`/isFollowing/${profileId}`),
        axios.get(`/profile/userData/${profileId}`, {}),
        axios.get(`/clucks/user/${profileId}`),
        axios.get(`/profile/userData/${userId}`),
      ]);

      if (loginResponse?.data.isLoggedIn) {
        setUserId(loginResponse.data.userId);
      }

      setFollowing(followingResponse.data.isFollowing);

      setUserData({
        ...userData,
        bio: profileResponse.data.bio,
        username: profileResponse.data.userName,
        email: profileResponse.data.email,
        followers: profileResponse.data.followers,
        following: profileResponse.data.following,
        privacy: profileResponse.data.privacy,
      });

      setLoggedInUser(loggedInUserResponse?.data);

      setUserClucks(cluckResponse?.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  useEffect(() => {
    getUserData();
  }, [userId, profileId, setUserId, isFollowing]);
  useEffect(() => {
    axios.get('/profileImage')
      .then(response => {
        setProfileImage(response.data.profileImage);
      })
      .catch(error => {
        console.error('Error fetching profile image:', error);
      });
  }, []);
  const handleChange = (e) => {
    setUserData((prevState) => ({ ...prevState, bio: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/profile', {
        bio: userData.bio,
      });
      toast.success(response.data.message);
   
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
    setIsEditMode(false);
  };
  const handleCoverPhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updatePrivacy = async (newVal) => {
    try {
      const response = await axios.post('/profile/privacy', {
        privacy: newVal,
      });
      toast.success(response.data.message);
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

 
  const handleFollow = async () => {
    try {
      const response = await axios.post(`/follow/${profileId}`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error following user:', error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }

    setFollowing(true);
    setUserData({ ...userData, followers: [...userData.followers, userId] });
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
        toast.error('An error occurred. Please try again.');
      }
    }

    setFollowing(false);
    setUserData({
      ...userData,
      followers: userData.followers.filter((follower) => follower !== userId),
    });
  };

  
  const handleBlock = async (e) => {
    const blocked = e.target.checked;
    try {
      const response = await axios.post(
        `/profile/block/${profileId}`,
        {
          block: blocked,
        },
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }

    setFollowing(false);
    setUserData({
      ...userData,
      followers: userData.followers.filter((follower) => follower !== userId),
    });
  };

  return (
    <div className='profile-container'>
      <div className='profile-info'>
      <div className="profile-header">
      <div className="cover-photo-container">
  {coverPhoto ? (
    <img src={coverPhoto} alt="Cover Photo" className="cover-photo" />
  ) : (
    <div className="cover-photo-placeholder">
      <label htmlFor="cover-photo-upload">Upload Cover Photo</label>
      <input
        id="cover-photo-upload"
        type="file"
        accept="image/*"
        onChange={handleCoverPhotoUpload} // You need to define this function
      />
    </div>
  )}
</div>
          <div className="profile-picture-container">
            {profilePicture ? (
              <img
                src={profileImage}
                alt="Profile Picture"
                className="profile-picture"
              />
            ) : (
              <div className="profile-picture-placeholder">
                <label htmlFor="profile-picture-upload">Upload Profile Picture</label>
                <UploadProfileImage onUpload={handleProfileImageUpload} />
              </div>
            )}
          </div>
        </div>
        <div className='top-left'>
          <p className='profileUsername'>@{userData.username}</p>
          <p className='email'>{userData.email}</p>
        </div>

        <div className='next-to-top-left'>
          <p className='followers'>Followers: {userData.followers.length}</p>
          <p className='following'>Following: {userData.following.length}</p>
        </div>
      </div>

      {profileId == userId ? null : (
        <div className='top-right'>
          {isFollowing ? (
            <button onClick={handleUnfollow}>Unfollow</button>
          ) : (
            <button onClick={handleFollow}>Follow</button>
          )}
        </div>
      )}



      {profileId == userId  ? (
        
        <div>
          <div className='radio-group'>
            <div className='radio-item'>
              <input
                className='radio-btn'
                id='private'
                type='radio'
                name='privacy'
                onClick={() => updatePrivacy(true)}
                defaultChecked={userData.privacy}
                data-testid='private-radio'
              />
              <label htmlFor='private'>Private</label>
            </div>
            <div className='radio-item'>
              <input
                className='radio-btn'
                id='public'
                type='radio'
                name='privacy'
                onClick={() => updatePrivacy(false)}
                defaultChecked={!userData.privacy}
                data-testid='public-radio'
              />
              <label htmlFor='public'>Public</label>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <label htmlFor='bio'></label>
            <textarea
              id='bio'
              type='text'
              name='bio'
              className='bio1'
              placeholder='Change your bio...'
              value={userData.bio}
              onChange={handleChange}
              data-testid='bio'
            ></textarea>
            <button className='update-button' type='submit'>Update Profile</button>
          </form>
        </div>
      ) : (
        <div>
          <div className='check-container'>
            <label htmlFor='block'>Block</label>
            <input
              id='block'
              type='checkbox'
              defaultChecked={isBlocked}
              onChange={handleBlock}
              style={{
                width: 'fit-content',
                margin: 0,
                marginBottom: 4,
              }}
              data-testid='block-checkbox'
            />
          </div>
          <div className='top-left'>
            <p className='bio'>{userData.bio}</p>
          </div>
        </div>
      )}
      <div className='clucks-list'>
        {userClucks?.map((cluck) => (
          <CluckBox
            key={cluck._id}
            cluck={cluck}
            profileView={true}
            onUpdate={getUserData}
          />
        ))}
      </div>
    </div>
  );
}