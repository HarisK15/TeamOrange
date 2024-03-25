import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function EmailVerification() {
  const [verificationResult, setVerificationResult] = useState('');
  let { verificationToken } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.post(`/verify-email/${verificationToken}`); 
        
        setVerificationResult('Email verified successfully!');
      } catch (error) {
        setVerificationResult('Email verification failed.');
        console.error('Error verifying user', error);
      }
    };

    verifyEmail();
  }, [verificationToken]);

  return (
    <div>
      <h1>Your email verification status:</h1>
      <p>{verificationResult}</p>
    </div>
  );
};
