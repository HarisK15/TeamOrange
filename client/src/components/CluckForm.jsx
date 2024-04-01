import { useContext, useState } from "react";
import axios from "axios";
import "./CluckForm.css";
import profilePicUrl from "../images/default-pic.jpg";
import { UpdateClucksContext } from "../contexts/UpdateClucksContext";


const CluckForm = () => {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const { addCluck } = useContext(UpdateClucksContext);
  const [image, setImage] = useState(null);
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    let data;
    let contentType;

    if (image) {
      data = new FormData();
      data.append("text", text);
      data.append("image", image);
      contentType = "multipart/form-data";
    } else {
      data = { text: text };
      contentType = "application/json";
    }

    try {
      const response = await axios.post("/clucks", data, {
        withCredentials: true,
        headers: {
          "Content-Type": contentType,
        },
      });
      setImage();
      setText("");
      setError(null);
      addCluck(response.data);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  return (
    <form
      className="cluck-form"
      data-testid="cluck-form"
      onSubmit={handleSubmit}
    >
      <div className="form-content">
        <img src={profilePicUrl} alt="Profile" className="profile-pic" />
        <div className="cluck-content">
          <textarea
            className="cluck-textarea"
            onChange={(e) => setText(e.target.value)}
            value={text}
            placeholder="What's your cluck?"
          />
        <label className="cluck-imagearea">
          <input
            type="file"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
              + image
          <i className="fas fa-upload"></i>
        </label>

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
