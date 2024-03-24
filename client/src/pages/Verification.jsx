import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function EmailVerification() {
  const [verificationResult, setVerificationResult] = useState('');
  let { verificationToken } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/verify-email/${verificationToken}`); 
        
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
      <h1>Email Verification</h1>
      <p>{verificationResult}</p>
    </div>
  );
};
