import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, Lock, EyeOff, Eye, CheckCircle2, XCircle } from 'lucide-react';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email';
  const resetToken = location.state?.reset_token || '';

  const hasMinLength = newPassword.length >= 6;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  
  const isPasswordValid = hasMinLength && hasUppercase && hasNumber && hasSpecialChar && passwordsMatch;

  const handleReset = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) return;
    
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await api.post(`/api/reset-password/`, {
        email: email,
        reset_token: resetToken,
        new_password: newPassword
      });

      alert(response.data.message || 'Password reset successful!');
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.error || 'Reset failed. Token might be expired.');
      } else {
        setErrorMsg(`Connection error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const ValidationRow = ({ text, isValid }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {isValid ? (
        <CheckCircle2 size={16} color="#4CAF50" />
      ) : (
        <XCircle size={16} color="rgba(128,128,128,0.5)" />
      )}
      <span style={{ 
        fontSize: '12px', 
        color: isValid ? '#4CAF50' : 'gray',
        fontWeight: isValid ? 500 : 400
      }}>
        {text}
      </span>
    </div>
  );

  const renderInput = (value, setValue, placeholder, passVis, setPassVis) => (
    <div style={{ position: 'relative', marginBottom: '16px' }}>
      <div style={{ position: 'absolute', left: '16px', top: '20px', color: '#7B1FA2' }}>
        <Lock size={24} />
      </div>
      <input
        type={passVis ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          width: '100%',
          height: '64px',
          background: '#F3E5F5',
          border: 'none',
          borderRadius: '16px',
          padding: '0 48px',
          fontSize: '16px',
          color: '#212121',
          outline: 'none',
        }}
        onFocus={(e) => e.target.style.border = '2px solid rgba(123, 31, 162, 0.5)'}
        onBlur={(e) => e.target.style.border = 'none'}
      />
      <button 
        type="button"
        onClick={() => setPassVis(!passVis)}
        style={{ position: 'absolute', right: '16px', top: '20px', background: 'none', border: 'none', color: '#7B1FA2', cursor: 'pointer', padding: 0 }}
      >
        {passVis ? <Eye size={24} /> : <EyeOff size={24} />}
      </button>
    </div>
  );

  return (
    <div className="auth-layout">
      {/* Desktop Banner */}
      <div className="auth-banner">
        <div style={{ zIndex: 1, maxWidth: '400px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2 }}>Secure Your Account</h1>
          <p style={{ fontSize: '1.25rem', fontWeight: 500, opacity: 0.9, lineHeight: 1.6 }}>Choose a strong password to keep your safe space protected.</p>
        </div>
      </div>

      <div className="auth-content" style={{ position: 'relative', overflowY: 'auto' }}>
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

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '440px', width: '100%', margin: '0 auto', justifyContent: 'center', padding: '48px 0' }}>
          
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#7B1FA2',
              margin: 0
            }}>
              Reset Password
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#7B1FA2',
              lineHeight: '22px',
              fontWeight: 500,
              marginTop: '12px',
            }}>
              Enter your new password for {email}
            </p>
          </div>

          {errorMsg && (
            <div style={{ color: 'white', background: '#D32F2F', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column' }}>
            
            {renderInput(newPassword, setNewPassword, 'New Password', newPasswordVisible, setNewPasswordVisible)}
            {renderInput(confirmPassword, setConfirmPassword, 'Confirm Password', confirmPasswordVisible, setConfirmPasswordVisible)}

            {/* Validation Indicators */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 4px', marginBottom: '32px' }}>
              <ValidationRow text="Minimum 6 characters" isValid={hasMinLength} />
              <ValidationRow text="One uppercase letter" isValid={hasUppercase} />
              <ValidationRow text="One number" isValid={hasNumber} />
              <ValidationRow text="One special character" isValid={hasSpecialChar} />
              <ValidationRow text="Passwords match" isValid={passwordsMatch} />
            </div>

            {/* Reset Button */}
            <button
              type="submit"
              disabled={!isPasswordValid || isLoading}
              style={{
                width: '100%',
                height: '64px',
                borderRadius: '32px',
                background: isPasswordValid ? 'linear-gradient(90deg, #7B1FA2, #AB47BC)' : 'lightgray',
                color: isPasswordValid ? 'white' : 'gray',
                fontSize: '18px',
                fontWeight: 'bold',
                border: 'none',
                boxShadow: isPasswordValid ? '0 12px 24px rgba(103, 58, 183, 0.2)' : 'none',
                cursor: isPasswordValid ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => { if(isPasswordValid && !isLoading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(103, 58, 183, 0.3)'; } }}
              onMouseOut={(e) => { if(isPasswordValid && !isLoading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(103, 58, 183, 0.2)'; } }}
            >
              {isLoading ? 'Loading...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
