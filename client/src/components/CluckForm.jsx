import React, { useState } from "react";

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
    <form className="create" onSubmit={handleSubmit}>
      <input
        type="text"
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <button type="submit">Cluck</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default CluckForm;
