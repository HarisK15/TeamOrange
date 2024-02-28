import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const loginRedir = (e) => {
    toast.success("Redirecting to Login...");
    navigate("/login");
  };
  const registerRedir = (e) => {
    toast.success("Redirecting to Register...");
    navigate("/register");
  };
  return (
    <div className="form-container">
      <h1 className="brand-name">Clucker</h1>
      <button type="button" className="login-button" onClick={loginRedir}>
        Login
      </button>
      <button type="button" className="register-button" onClick={registerRedir}>
        Register
      </button>
    </div>
  );
}
