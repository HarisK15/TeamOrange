import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./PasswordUpdate.css";

export default function ChangePasswordForm() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword } = data;
    try {
      const response = await axios.post("/change-password", {
        currentPassword,
        newPassword,
      });
      toast.success(response.data.message);
      setData({
        currentPassword: "",
        newPassword: "",
      });
      navigate("/Clucks");
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };
  return (
    <div className="form-container-pass">
      <h2 className="title">Change Your Password</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="currentPassword">Current Password:</label>
        <input
          id="currentPassword"
          type="password"
          name="currentPassword"
          placeholder="Enter current password..."
          value={data.currentPassword}
          onChange={handleChange}
        />
        <label htmlFor="newPassword">New Password:</label>
        <input
          id="newPassword"
          type="password"
          name="newPassword"
          placeholder="Enter new password..."
          value={data.newPassword}
          onChange={handleChange}
        />
        <button type="submit" className="change-button">
          Change Password
        </button>
      </form>
    </div>
  );
}
