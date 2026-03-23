import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const OTP = () => {
  const [otpCode, setOtpCode] = useState(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email';
  const inputRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (value === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otpCode[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isFormValid = otpCode.every((code) => code.trim() !== '');

  const handleVerify = async () => {
    if (!isFormValid) return;
    setIsLoading(true);
    setErrorMsg('');

    const otp = otpCode.join('');

    try {
      const response = await api.post(`/api/forgot-password/verify-otp/`, { email, otp });
      
      if (response.data && response.data.reset_token) {
        navigate('/reset-password', { state: { email, reset_token: response.data.reset_token } });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.error || 'Invalid OTP');
      } else {
        setErrorMsg('Connection error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post(`/api/forgot-password/`, { email });
      alert("OTP sent!");
    } catch (error) {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="auth-layout">
      {/* Desktop Banner */}
      <div className="auth-banner">
        <div style={{ zIndex: 1, maxWidth: '400px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2 }}>Check your inbox</h1>
          <p style={{ fontSize: '1.25rem', fontWeight: 500, opacity: 0.9, lineHeight: 1.6 }}>We've sent a 6-digit verification code. Please enter it to continue.</p>
        </div>
      </div>

      <div className="auth-content" style={{ position: 'relative' }}>
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            width: '48px',
            height: '48px',
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            zIndex: 10
          }}
        >
          <ArrowLeft size={24} color="#7B1FA2" />
        </button>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '440px', width: '100%', margin: '0 auto', justifyContent: 'center' }}>
          
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#7B1FA2',
              margin: 0
            }}>
              Verify Email
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#7B1FA2',
              fontWeight: 500,
              marginTop: '12px',
            }}>
              We've sent a 6-digit code to <span style={{fontWeight: 'bold'}}>{email}</span>
            </p>
          </div>

          {errorMsg && (
            <div style={{ color: 'white', background: '#D32F2F', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          {/* OTP Input Fields */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '48px' }}>
            {otpCode.map((code, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={code}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                style={{
                  width: '100%',
                  maxWidth: '56px',
                  height: '64px',
                  background: '#F8F9FA',
                  border: '1px solid rgba(0,0,0,0.05)',
                  borderRadius: '16px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#4A148C',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => { e.target.style.border = '2px solid #7B1FA2'; e.target.style.background = '#F3E5F5'; }}
                onBlur={(e) => { e.target.style.border = '1px solid rgba(0,0,0,0.05)'; e.target.style.background = '#F8F9FA'; }}
              />
            ))}
          </div>

          {/* Resend Text */}
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '15px', marginBottom: '48px' }}>
            <span style={{ color: '#7B1FA2' }}>Didn't receive code? </span>
            <span 
              onClick={handleResend}
              style={{ 
                color: '#4A148C', 
                fontSize: '16px', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                marginLeft: '6px',
                textDecoration: 'underline'
              }}
            >
              Resend
            </span>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={!isFormValid || isLoading}
            style={{
              width: '100%',
              height: '64px',
              borderRadius: '32px',
              background: `linear-gradient(90deg, ${isFormValid ? '#7B1FA2' : 'rgba(123,31,162,0.5)'}, ${isFormValid ? '#AB47BC' : 'rgba(123,31,162,0.5)'})`,
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              border: 'none',
              boxShadow: isFormValid ? '0 12px 24px rgba(103, 58, 183, 0.2)' : 'none',
              cursor: isFormValid ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => { if(isFormValid && !isLoading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(103, 58, 183, 0.3)'; } }}
            onMouseOut={(e) => { if(isFormValid && !isLoading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(103, 58, 183, 0.2)'; } }}
          >
            {isLoading ? 'Loading...' : 'Verify & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTP;
