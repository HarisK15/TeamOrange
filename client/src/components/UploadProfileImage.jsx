import React, { useState } from 'react';
import axios from 'axios';

const UploadProfileImage = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const fileSelectedHandler = event => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('profileImage', selectedFile);
    
    try {
      console.log('Sending POST request ....'); // Log before sending the request

      const response = await axios.post('http://localhost:8000/profile/profileImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onUpload(response.data.profileImage); // Call the onUpload function with the message from the response
      console.log('Received response:', response); // Log the received response

      if (response.status === 200) {
        // Handle the response
      } else {
        console.error('Error uploading profile image:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      
    }
  };

  return (
    <div>
      <input type="file" onChange={fileSelectedHandler} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadProfileImage;