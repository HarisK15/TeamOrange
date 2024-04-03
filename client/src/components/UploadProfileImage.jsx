import React, { useState } from 'react';
import axios from 'axios';
import '../pages/Profile.css';
const UploadProfileImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const fileSelectedHandler = event => {
    setSelectedFile(event.target.files[0]);
  };

  const fileUploadHandler = async () => {
    const formData = new FormData();
    formData.append('profileImage', selectedFile);

    try {
      const response = await axios.post('/profileImage', formData);
      console.log(response);
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

 
};

export default UploadProfileImage;