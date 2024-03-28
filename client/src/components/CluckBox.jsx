import { useState, useContext, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UpdateClucksContext } from '../contexts/UpdateClucksContext';
import { LoggedInContext } from '../contexts/LoggedInContext';
import './CluckBox.css';
import profilePicUrl from '../images/default-pic.jpg';
import HeartIcon from './HeartIcon';

const CluckBox = ({ cluck, profileView, onUpdate = () => {} }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(cluck.text);
  const [isDeleted, setIsDeleted] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState([]);
  const { addCluck, updateCluck } = useContext(UpdateClucksContext);
  const { userId } = useContext(LoggedInContext);

  const showContent = useMemo(
    () =>
      !cluck.user.blocked?.includes(userId) &&
      (userId === cluck.user._id ||
        !cluck.user.privacy ||
        (cluck.user.following?.includes(userId) &&
          cluck.user.followers?.includes(userId))),
    [(userId, cluck.user.followers, cluck.user.following)]
  );

  const liked = useMemo(() => cluck?.likedBy?.includes(userId), [cluck.likedBy]);

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
          setIsEditing(false);
          updateCluck(updatedCluck);
          //console.log('Cluck updated successfully');
        } else {
          // Handle error
          console.error('Failed to update cluck');
        }
      } catch (error) {
        console.error('Failed to update cluck', error);
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
        setIsDeleted(true);
        //console.log('Cluck deleted successfully');
      } else {
        // Handle error
        console.error('Failed to delete cluck');
      }
    } catch (error) {
      console.error('Failed to delete cluck', error);
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
        //console.log('Cluck updated successfully');
      } else {
        // Handle error
        console.error('Failed to update cluck');
      }
    } catch (error) {
      console.error('Failed to update cluck', error);
    }
  };

  const handleReply = async () => {
    try {
      const response = await axios.post(
        `/clucks/${cluck._id}/replies`,
        { text: replyText },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        // Update the replies
        const newReply = response.data;
        setReplies([...replies, newReply]);
        setReplyText('');
        //console.log('Reply added successfully');
      } else {
        // Handle error
        console.error('Failed to add reply');
      }
    } catch (error) {
      console.error('Failed to add reply', error);
    }
  };

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
        //console.log("Cluck successfully reclucked");
      } else {
        console.error('Failed to recluck cluck');
      }
    } catch (error) {
      console.error('Failed to recluck cluck', error);
    }
  };
  //console.log( {cluck})
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
        {userId !== cluck.user._id && (
          <button className='like-button' onClick={handleLike} data-testid='like-button'>
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
        {userId !== cluck.user._id && userId !== cluck.recluckUser && !cluck.recluck && (
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

      <div className='cluck-info'>
        <div className='cluck-timestamp'>
          <p>Posted at: {new Date(cluck.createdAt).toLocaleString()}</p>
          {cluck.updatedAt !== cluck.createdAt && (
            <p data-testid='last-edited'>
              Last edited: {new Date(cluck.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <div className='reply-section'>
        <textarea
          className='reply-textarea'
          placeholder='Reply to this cluck...'
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
        />
        <button className='reply-button' onClick={handleReply}>
          Reply
        </button>
        {replies.map((reply) => (
          <div key={reply._id} className='reply'>
            <Link to={`/Profile/${reply.user._id}`}>
              <h4 className='username'>@{reply.user.userName}</h4>
            </Link>
            <p>{reply.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CluckBox;
