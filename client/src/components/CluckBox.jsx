import { useState, useContext, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UpdateClucksContext } from '../contexts/UpdateClucksContext';
import { LoggedInContext } from '../contexts/LoggedInContext';
import toast from 'react-hot-toast';
import './CluckBox.css';
import profilePicUrl from '../images/default-pic.jpg';
import HeartIcon from './HeartIcon';
import CluckForm from './CluckForm';

const CluckBox = ({ cluck, profileView, onUpdate = () => {} }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editedText, setEditedText] = useState(cluck.text);
  const [isDeleted, setIsDeleted] = useState(false);
  const { addCluck, updateCluck } = useContext(UpdateClucksContext);
  const { userId } = useContext(LoggedInContext);

  const [replies, setReplies] = useState([]);

  const showContent = useMemo(
    () =>
      !cluck.user.blocked?.includes(userId) &&
      (userId === cluck.user._id ||
        !cluck.user.privacy ||
        (cluck.user.following?.includes(userId) &&
          cluck.user.followers?.includes(userId))),
    [(userId, cluck.user.followers, cluck.user.following)]
  );

  const liked = useMemo(
    () => cluck?.likedBy?.includes(userId),
    [cluck.likedBy]
  );

  const handleSave = async () => {
    if (isEditing) {
      try {
        const response = await axios.patch(
          `/clucks/${cluck._id}`,
          { text: editedText },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          // Update the cluck text and exit editing mode
          const updatedCluck = {
            ...cluck,
            text: editedText,
            updatedAt: new Date().toISOString(),
          };
          onUpdate();
          setIsEditing(false);
          updateCluck(updatedCluck);
          toast.success('Cluck updated successfully');
        } else {
          // Handle error
          toast.error('Failed to update cluck');
        }
      } catch (error) {
        toast.error('Failed to update cluck', error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`clucks/${cluck._id}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        // Sets the isDeleted flag to true if the cluck is successfully deleted
        onUpdate();
        setIsDeleted(true);
        toast.success('Cluck deleted successfully');
      } else {
        // Handle error
        toast.error('Failed to delete cluck');
      }
    } catch (error) {
      toast.error('Failed to delete cluck', error)
    }
  };

  const handleLike = async () => {
  try {
      const response = await axios.patch(
        `/clucks/like/${cluck._id}`,
        { liked: !liked },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        // Update the cluck liked
        const updatedCluck = {
          ...cluck,
          likedBy: response.data.likedBy,
        };
        updateCluck(updatedCluck);
        onUpdate();
        toast.success('Cluck updated successfully');
      } else {
        // Handle error
        toast.error('Failed to update cluck');
      }
    } catch (error) {
      toast.error('Failed to update cluck', error);
    }
  };
  const showReplies = async () => {
    try {
      const response = await axios.get(`/clucks/replies/${cluck._id}`);

      if (response.status === 200) {
        setReplies(response.data);
        console.log('cluck :', cluck);
        console.log(
          'response.data.map((el) => el._id) :',
          response.data.map((el) => el._id)
        );
        cluck = { ...cluck, replies: response.data.map((el) => el._id) };
        console.log('cluck :', cluck);
        updateCluck(cluck);
        onUpdate();
      } else {
        // Handle error
        console.error('Failed to fetch replies');
      }
    } catch (error) {
      console.error('Failed to fetch replies', error);
    }
  };
  // showReplies();

  // Cluck is not rendered if the isDeleted flag is True
  if (isDeleted) {
    return null;
  } else if (profileView && cluck.recluck) {
    return null;
  }

  const handleRecluck = async () => {
    try {
      const response = await axios.post(
        `clucks/${cluck._id}/recluck`,
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        console.log('Cluck successfully reclucked');
      } else {
        console.error('Failed to recluck cluck');
      }
    } catch (error) {
      console.error('Failed to recluck cluck', error);
    }
  };

  return (
    <div className='cluckBox' data-testid='cluck-box'>
      {cluck.recluck && (
        <div className='cluck-recluck'>
          <Link to={`/Profile/${cluck.recluckUser._id}`}>
            <p>Reclucked by @{cluck.recluckUser.userName}</p>
          </Link>
        </div>
      )}
      <div className='cluck-header'>
        <img src={profilePicUrl} alt='Profile' className='profile-pic' />
        <div className='name-username'>
          <Link to={`/Profile/${cluck.user._id}`}>
            <h4 className='username'>@{cluck.user.userName}</h4>
          </Link>
        </div>
      </div>

      <div className='cluck-content'>
      {cluck.image && <img src={`http://localhost:8000/${cluck.image}`} alt='Cluck image' />}

        {isEditing ? (
          <textarea
            className='edit-textarea'
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
        ) : (
          <p data-testid='cluck-text'>{showContent ? cluck.text : ''}</p>
        )}
      </div>

      <div className='buttons'>
        <div>
          {cluck?.replies?.length ? (
            <button
              className='show-replies-button'
              onClick={() => {
                replies.length ? setReplies([]) : showReplies();
              }}
              data-testid='replies-button'
            >
              {replies.length ? 'Hide' : 'Show'} Replies (
              {cluck?.replies?.length || 0})
            </button>
          ) : (
            <></>
          )}
        </div>
        <button
          className='reply-button'
          onClick={() => setIsReplying(true)}
          data-testid='reply-button'
        >
          Reply
        </button>

        {userId !== cluck.user._id && (
          <button
            className='like-button'
            onClick={handleLike}
            data-testid='like-button'
          >
            <HeartIcon fillColor={liked ? 'red' : 'lightgray'} />
            {cluck?.likedBy?.length}
          </button>
        )}
        {isEditing && (
          <button
            onClick={() => {
              setIsEditing(false);
              setEditedText(cluck.text);
            }}
            className='cancel-button'
          >
            Cancel
          </button>
        )}
        {userId === cluck.user._id && (
          <div>
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className='edit-button'
              data-testid='edit-button'
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        )}
        {userId != cluck.user._id &&
          userId != cluck.recluckUser &&
          !cluck.recluck && (
            <button onClick={handleRecluck} className='recluck-button'>
              Recluck
            </button>
          )}
        {userId === cluck.user._id && (
          <div>
            <button
              onClick={handleDelete}
              className='delete-button'
              data-testid='delete-button'
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <div className='reply-box'>
        {isReplying && (
          <CluckForm
            replyTo={cluck._id}
            onReply={() => {
              showReplies();
              setIsReplying(false);
            }}
          />
        )}
        {replies?.map((el) => (
          <CluckBox key={el._id} cluck={el} onUpdate={() => showReplies()} />
        ))}
      </div>

      <div className='cluck-info'>
        <div className='cluck-timestamp'>
          <p>Posted at: {new Date(cluck.createdAt).toLocaleString()}</p>
          {cluck.updatedAt != cluck.createdAt && (
            <p data-testid='last-edited'>
              Last edited: {new Date(cluck.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CluckBox;