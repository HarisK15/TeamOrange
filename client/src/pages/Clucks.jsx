import { useEffect, useState } from "react";
import axios from "axios";
import CluckBox from "../components/CluckBox";
import CluckForm from "../components/CluckForm";

const Clucks = () => {
  const [clucks, setClucks] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    const fetchClucks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/clucks");
        setClucks(response.data);
      } catch (error) {
        console.error("Failed to fetch clucks", error);
      }
    };

    fetchClucks();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/check-login");
        setLoggedInUserId(response.data.userId);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="clucks">
      <CluckForm />
      <div className="clucksList">
        <h2>Clucks</h2>
        {clucks &&
          clucks.map((cluck) => (
            <CluckBox
              key={cluck._id}
              cluck={cluck}
              loggedInUserId={loggedInUserId}
            />
          ))}
      </div>
    </div>
  );
};

export default Clucks;
