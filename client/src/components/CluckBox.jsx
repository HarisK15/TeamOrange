import "./CluckBox.css";
import profilePicUrl from "../../public/images/default-pic.jpg";

const CluckBox = ({ cluck }) => {
  return (
    <div className="cluckBox">
      <div className="cluck-header">
        <img src={profilePicUrl} alt="Profile" className="profile-pic" />
        <div className="name-username">
          <h4 className="name">Name</h4>
          <h4 className="username">@username</h4>
        </div>
      </div>
      <div className="cluck-content">
        <p>{cluck.text}</p>
      </div>
      <div className="cluck-info">
        <div className="cluck-timestamp">
          <p>Posted at: {new Date(cluck.createdAt).toLocaleString()}</p>
          {cluck.updatedAt != cluck.createdAt && (
            <p>Last edited: {new Date(cluck.updatedAt).toLocaleString()}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CluckBox;
