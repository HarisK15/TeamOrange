import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const LoggedInContext = createContext();

export const LoggedInProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("/check-login");
        setIsLoggedIn(response.data.isLoggedIn);
        if (response.data.isLoggedIn) {
          setUserId(response.data.userId);
        }
      } catch (error) {
        console.error("Failed to check login status:", error);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <LoggedInContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, userId, setUserId }}
    >
      {children}
    </LoggedInContext.Provider>
  );
};
