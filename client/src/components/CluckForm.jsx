import { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./CluckForm.css";
import profilePicUrl from "../images/default-pic.jpg";
import { UpdateClucksContext } from "../contexts/UpdateClucksContext";

const CluckForm = ({ onReply, replyTo }) => {
  const [text, setText] = useState('');
  const { addCluck } = useContext(UpdateClucksContext);
  const [error, setError] = useState(null);

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
      const response = await axios.post(
        replyTo ? `/clucks/replyCluck/${replyTo}` : '/clucks',
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': contentType,
          },
        
        }
        
      );
      setText('');
      setError(null);
      setImage();

      toast.success("new cluck posted", response.data);
      console.log(response.data);
      !replyTo && addCluck(response.data);
      typeof onReply === 'function' && onReply();
    } catch (error) {
      console.error(error);
      setError(error.message);
      toast.error("Failed to post cluck");
    }
  };

  return (
    <form
      className='cluck-form'
      data-testid='cluck-form'
      onSubmit={handleSubmit}
    >
      <div className='form-content'>
        <img src={profilePicUrl} alt='Profile' className='profile-pic' />
        <div className='cluck-content'>
          <textarea
            className='cluck-textarea'
            onChange={(e) => setText(e.target.value)}
            value={text}
            placeholder={`What's your ${replyTo ? 'reply' : 'cluck'}?`}
          />
           <label className="cluck-imagearea">
          <input
            type="file"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
              + image
        </label>
          <button type='submit' className='cluck-button'>
            {replyTo ? 'Reply' : 'Cluck'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CluckForm;
