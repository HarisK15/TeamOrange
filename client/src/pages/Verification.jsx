import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Verification.css';

export default function EmailVerification() {
  const [verificationResult, setVerificationResult] = useState(() => {
    return sessionStorage.getItem('verificationStatus') || '';
  });
  let { verificationToken } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (verificationResult !== 'Email verified successfully!') {
          await axios.post(`/verify-email/${verificationToken}`); 
          sessionStorage.setItem('verificationStatus', 'Email verified successfully!');
          setVerificationResult('Email verified successfully!');
        }
      } catch (error) {
        setVerificationResult('Email verification failed.');
        console.error('Error verifying user', error);
      }
    };

    verifyEmail();
  }, [verificationToken]);

  return (
    <div className='verification'>
      <h1 className='verification-status'>Your verification status:</h1>
      <p className='verification-result'>{verificationResult}</p>
    </div>
  );
};
