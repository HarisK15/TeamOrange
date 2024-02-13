import { useEffect, useState } from "react";
import CluckBox from "../components/CluckBox";
import CluckForm from "../components/CluckForm";

const Clucks = () => {
  const [clucks, setClucks] = useState(null);

  useEffect(() => {
    const fetchClucks = async () => {
      const response = await fetch("http://localhost:8000/clucks");
      const json = await response.json();

      if (response.ok) {
        setClucks(json);
      }
    };

    fetchClucks();
  }, []);

  return (
    <div className="clucks">
      <CluckForm />
      <div className="clucksList">
        <h2>Clucks</h2>
        {clucks &&
          clucks.map((cluck) => <CluckBox key={cluck._id} cluck={cluck} />)}
      </div>
    </div>
  );
};

export default Clucks;
