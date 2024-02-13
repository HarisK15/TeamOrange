const CluckBox = ({ cluck }) => {
  return (
    <div className="cluckBox">
      <h4>{cluck._id}</h4>
      <p>{cluck.text}</p>
      {cluck.updatedAt != cluck.createdAt && (
        <p>Last edited: {cluck.updatedAt}</p>
      )}
      <p>{cluck.createdAt}</p>
    </div>
  );
};

export default CluckBox;
