import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoggedInContext } from "../contexts/LoggedInContext";
import "./Navbar.css";

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useContext(LoggedInContext);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post("/logout");
      setIsLoggedIn(false);
      navigate("/Login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <nav className="navbar">
      {isLoggedIn ? (
        <>
          <button onClick={() => navigate("/Clucks")}>Clucks</button>
          <button onClick={() => navigate("/Profile")}>Profile</button>
          <button onClick={() => navigate("/Change-Password")}>
            Change Password
          </button>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/Register")}>Register</button>
          <button onClick={() => navigate("/Login")}>Login</button>
        </>
      )}
    </nav>
  );
}
