import { useContext, useEffect, useState } from "react";
import axios from "axios";
import CluckBox from "../components/CluckBox";
import CluckForm from "../components/CluckForm";
import { UpdateClucksContext } from "../contexts/UpdateClucksContext";
import { LoggedInContext } from "../contexts/LoggedInContext";
import SearchBar from "../components/SearchBar";
import "./Clucks.css";

const Clucks = () => {
  const { clucks } = useContext(UpdateClucksContext);
  const { setUserId } = useContext(LoggedInContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/check-login");
        if (response.data.isLoggedIn) {
          setUserId(response.data.userId);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchUser();
  }, []);

  //console.log({ clucks })
  return (
    <div className="clucks-page">
      <h2 className="page-title">Clucks</h2>
      <div className="clucks-content">
        <div className="clucksList">
          <CluckForm />
          {clucks &&
            clucks.map((cluck) => <CluckBox key={cluck._id} cluck={cluck} />)}
        </div>
        <SearchBar />
      </div>
    </div>
  );
};

export default Clucks;
