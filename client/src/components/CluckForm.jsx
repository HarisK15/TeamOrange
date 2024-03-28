import { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./CluckForm.css";
import profilePicUrl from "../images/default-pic.jpg";
import { UpdateClucksContext } from "../contexts/UpdateClucksContext";

const CluckForm = ({ onReply, replyTo }) => {
  const [text, setText] = useState('');
  const { addCluck } = useContext(UpdateClucksContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cluck = { text };

    try {
      const response = await axios.post(
        replyTo ? `/clucks/replyCluck/${replyTo}` : '/clucks',
        cluck,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setText('');
      toast.success("new cluck posted", response.data);
      !replyTo && addCluck(response.data);
      onReply();
    } catch (error) {
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
          <button type='submit' className='cluck-button'>
            {replyTo ? 'Reply' : 'Cluck'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CluckForm;
