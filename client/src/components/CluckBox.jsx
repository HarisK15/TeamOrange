import { useState, useContext } from "react";
import axios from "axios";
import { UpdateClucksContext } from "../contexts/UpdateClucksContext";
import { LoggedInContext } from "../contexts/LoggedInContext";
import "./CluckBox.css";
import profilePicUrl from "../images/default-pic.jpg";

const CluckBox = ({ cluck }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(cluck.text);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isReclucked, setIsReclucked] = useState(false);
  const { updateCluck } = useContext(UpdateClucksContext);
  const { userId } = useContext(LoggedInContext);

  const handleSave = async () => {
    if (isEditing) {
      try {
        const response = await axios.patch(
          `/clucks/${cluck._id}`,
          { text: editedText },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
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
          console.log("Cluck updated successfully");
        } else {
          // Handle error
          console.error("Failed to update cluck");
        }
      } catch (error) {
        console.error("Failed to update cluck", error);
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
        console.log("Cluck deleted successfully");
      } else {
        // Handle error
        console.error("Failed to delete cluck");
      }
    } catch (error) {
      console.error("Failed to delete cluck", error);
    }
  };

  // Cluck is not rendered if the isDeleted flag is True
  if (isDeleted) {
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
          "Content-Type": "application/json",
        },
      }
    );
    setIsReclucked(true);
      if (response.status === 200) {
        console.log("Cluck successfully reclucked");
      } else {
        console.error("Failed to recluck cluck");
      }
    } catch (error) {
      console.error("Failed to recluck cluck", error);
    }
  };

  return (
    <div className="cluckBox" data-testid="cluck-box">
    {cluck.recluck && (
    <div className="cluck-recluck">
      <p>Reclucked by @{cluck.recluckUser.userName}</p>
    </div>
    )}
    <div className="cluck-header">
      <img src={profilePicUrl} alt="Profile" className="profile-pic" />
      <div className="name-username">
        <h4 className="name">Name</h4>
        <h4 className="username">@{cluck.user.userName}</h4>
      </div>
    </div>

    <div className="cluck-content">
      {isEditing ? (
        <textarea
          className="edit-textarea"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
        />
      ) : (
        <p data-testid="cluck-text">{cluck.text}</p>
      )}
    </div>

    <div className="buttons">
      {isEditing && (
        <button
          onClick={() => {
            setIsEditing(false);
            setEditedText(cluck.text);
          }}
          className="cancel-button"
        >
          Cancel
        </button>
      )}
      {userId != cluck.user._id && userId != cluck.recluckUser && (
      <button
          onClick={handleRecluck}
          className="recluck-button"
        >
          Recluck
        </button>
      )}
      {userId === cluck.user._id && (
        <div>
          <button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="edit-button"
            data-testid="edit-button"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
          <button
            onClick={handleDelete}
            className="delete-button"
            data-testid="delete-button"
          >
            Delete
          </button>
        </div>
      )}
    </div>

    <div className="cluck-info">
      <div className="cluck-timestamp">
        <p>Posted at: {new Date(cluck.createdAt).toLocaleString()}</p>
        {cluck.updatedAt != cluck.createdAt && (
          <p data-testid="last-edited">
            Last edited: {new Date(cluck.updatedAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  </div>
  );
};

export default CluckBox;
