import { useState } from "react";
import "./CluckBox.css";
import profilePicUrl from "../images/default-pic.jpg";

const CluckBox = ({ cluck }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(cluck.text);

  const handleSave = async () => {
    if (isEditing) {
      const response = await fetch(
        `http://localhost:8000/clucks/${cluck._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: editedText }),
        }
      );

      if (response.ok) {
        // Update the cluck text and exit editing mode
        cluck.text = editedText;
        setIsEditing(false);
      } else {
        // Handle error
        console.error("Failed to update cluck");
      }
    }
  };

  return (
    <div className="cluckBox">
      <div className="cluck-header">
        <img src={profilePicUrl} alt="Profile" className="profile-pic" />
        <div className="name-username">
          <h4 className="name">Name</h4>
          <h4 className="username">@username</h4>
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
          <p>{cluck.text}</p>
        )}
      </div>

      <div className="buttons">
        {isEditing && (
          <button onClick={() => setIsEditing(false)} className="cancel-button">
            Cancel
          </button>
        )}
        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="edit-button"
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>

      <div className="cluck-info">
        <div className="cluck-timestamp">
          <p>Posted at: {new Date(cluck.createdAt).toLocaleString()}</p>
          {cluck.updatedAt != cluck.createdAt && (
            <p>Last edited: {new Date(cluck.updatedAt).toLocaleString()}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CluckBox;
