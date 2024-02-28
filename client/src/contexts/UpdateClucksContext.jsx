import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UpdateClucksContext = createContext();

export const UpdateClucksProvider = ({ children }) => {
  const [clucks, setClucks] = useState([]);

  useEffect(() => {
    const fetchClucks = async () => {
      try {
        const response = await axios.get("/clucks");
        setClucks(response.data);
      } catch (error) {
        console.error("Failed to fetch clucks", error);
      }
    };

    fetchClucks();
  }, []);

  const addCluck = (cluck) => {
    setClucks((prevClucks) => [cluck, ...prevClucks]);
  };

  const updateCluck = (updatedCluck) => {
    setClucks((prevClucks) =>
      prevClucks.map((cluck) =>
        cluck._id === updatedCluck._id ? updatedCluck : cluck
      )
    );
  };

  return (
    <UpdateClucksContext.Provider value={{ clucks, addCluck, updateCluck }}>
      {children}
    </UpdateClucksContext.Provider>
  );
};
