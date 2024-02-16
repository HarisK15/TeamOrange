import React, { useState } from "react";
import "./CluckForm.css";
import profilePicUrl from "/public/images/default-pic.jpg";

const CluckForm = () => {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cluck = { text };

    const response = await fetch("http://localhost:8000/clucks/", {
      method: "POST",
      body: JSON.stringify(cluck),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
    }

    if (response.ok) {
      setText("");
      setError(null);
      console.log("new cluck posted", json);
    }
  };

  return (
    <form className="cluck-form" onSubmit={handleSubmit}>
      <div className="form-content">
        <img src={profilePicUrl} alt="Profile" className="profile-pic" />
        <div className="cluck-content">
          <textarea
            className="cluck-textarea"
            onChange={(e) => setText(e.target.value)}
            value={text}
            placeholder="What's your cluck?"
          />
          <button type="submit" className="cluck-button">
            Cluck
          </button>
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    </form>
  );
};

export default CluckForm;
