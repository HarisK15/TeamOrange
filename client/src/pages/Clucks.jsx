import { useContext, useEffect, useState } from "react";
import axios from "axios";
import CluckBox from "../components/CluckBox";
import CluckForm from "../components/CluckForm";
import { UpdateClucksContext } from "../contexts/UpdateClucksContext";
import "./Clucks.css";

const Clucks = () => {
  const { clucks } = useContext(UpdateClucksContext);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

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
      <h2 className="page-title">Clucks</h2>
      <CluckForm />
      <div className="clucksList">
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
