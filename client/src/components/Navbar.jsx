import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Navbar.css";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("/check-login");
        setIsLoggedIn(response.data.isLoggedIn);
      } catch (error) {
        console.error("Failed to check login status:", error);
      }
    };

    checkLoginStatus();
  }, []);

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
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/Clucks")}>Clucks</button>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={() => navigate("/Register")}>Register</button>
          <button onClick={() => navigate("/Login")}>Login</button>
        </>
      )}
    </nav>
  );
}
