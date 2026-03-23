import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, User, Mail, Lock, EyeOff, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const SignUp = () => {
  const { t } = useSettings();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasNumber && hasSpecialChar;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const isFormValid = termsAccepted && isPasswordValid && passwordsMatch;

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await api.post(`/api/auth/register/`, {
        username: username,
        email: email,
        password: password,
      });

      setSuccessMsg(response.data.message || 'Signup successful!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.message || error.response.data.detail || `Error: ${error.response.status}`);
      } else {
        setErrorMsg(`Network error: ${error.message}`);
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

  const renderInput = (value, setValue, placeholder, IconComp, type = 'text', isPass = false, passVis = false, setPassVis = null) => (
    <div style={{ position: 'relative', marginBottom: '16px' }}>
      <div style={{ position: 'absolute', left: '16px', top: '18px', color: 'gray' }}>
        <IconComp size={24} />
      </div>
      <input
        type={isPass && !passVis ? 'password' : type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          width: '100%',
          height: '60px',
          background: 'transparent',
          border: '1px solid lightgray',
          borderRadius: '12px',
          padding: '0 48px',
          fontSize: '16px',
          color: '#212121',
          outline: 'none',
        }}
        onFocus={(e) => e.target.style.border = '2px solid #7B1FA2'}
        onBlur={(e) => e.target.style.border = '1px solid lightgray'}
      />
      {isPass && (
        <button 
          type="button"
          onClick={() => setPassVis(!passVis)}
          style={{ position: 'absolute', right: '16px', top: '18px', background: 'none', border: 'none', color: 'gray', cursor: 'pointer', padding: 0 }}
        >
          {passVis ? <Eye size={24} /> : <EyeOff size={24} />}
        </button>
      )}
    </div>
  );

  return (
    <div className="auth-layout">
      {/* Desktop Banner */}
      <div className="auth-banner">
        <div style={{ zIndex: 1, maxWidth: '400px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2 }}>{t('joinSolace')}</h1>
          <p style={{ fontSize: '1.25rem', fontWeight: 500, opacity: 0.9, lineHeight: 1.6 }}>{t('joinSolaceDesc')}</p>
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
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            zIndex: 10
          }}
        >
          <ArrowLeft size={24} color="#212121" />
        </button>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '440px', width: '100%', margin: '0 auto', justifyContent: 'center', padding: '48px 0' }}>
          
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#212121',
              margin: 0
            }}>
              {t('createAccount')}
            </h1>
            <p style={{
              fontSize: '16px',
              color: 'gray',
              fontWeight: 500,
              marginTop: '8px',
            }}>
              {t('createAccountSubtitle')}
            </p>
          </div>

          {errorMsg && (
            <div style={{ color: 'white', background: '#D32F2F', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}
          
          {successMsg && (
            <div style={{ color: 'white', background: '#4CAF50', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column' }}>
            
            {renderInput(username, setUsername, t('username'), User)}
            {renderInput(email, setEmail, t('email'), Mail, 'email')}
            {renderInput(password, setPassword, t('password'), Lock, 'password', true, passwordVisible, setPasswordVisible)}
            {renderInput(confirmPassword, setConfirmPassword, t('confirmPassword'), Lock, 'password', true, confirmPasswordVisible, setConfirmPasswordVisible)}

            {/* Validation Indicators */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 4px', marginBottom: '24px' }}>
              <ValidationRow text={t('minCharacters')} isValid={hasMinLength} />
              <ValidationRow text={t('oneUppercase')} isValid={hasUppercase} />
              <ValidationRow text={t('oneNumber')} isValid={hasNumber} />
              <ValidationRow text={t('oneSpecial')} isValid={hasSpecialChar} />
              <ValidationRow text={t('passwordsMatch')} isValid={passwordsMatch} />
            </div>

            {/* Terms & Privacy */}
            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '40px' }}>
              <input 
                type="checkbox" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                style={{ 
                  marginTop: '4px', 
                  marginRight: '8px', 
                  cursor: 'pointer',
                  accentColor: '#7B1FA2'
                }} 
              />
              <div style={{ fontSize: '14px', color: 'rgba(33,33,33,0.7)', lineHeight: '20px', cursor: 'pointer' }} onClick={() => setTermsAccepted(!termsAccepted)}>
                {t('agreeTerms')}
              </div>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              style={{
                width: '100%',
                height: '64px',
                borderRadius: '32px',
                background: isFormValid ? '#7B1FA2' : 'lightgray',
                color: isFormValid ? 'white' : 'gray',
                fontSize: '18px',
                fontWeight: 'bold',
                border: 'none',
                boxShadow: isFormValid ? '0 8px 16px rgba(103, 58, 183, 0.2)' : 'none',
                cursor: isFormValid ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => { if(isFormValid && !isLoading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(103, 58, 183, 0.3)'; } }}
              onMouseOut={(e) => { if(isFormValid && !isLoading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(103, 58, 183, 0.2)'; } }}
            >
              {isLoading ? 'Loading...' : t('createAccount')}
            </button>
          </form>

          {/* Sign In Link */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            marginTop: '40px',
            fontSize: '15px' 
          }}>
            <span style={{ color: 'gray' }}>{t('alreadyHaveAccount')} </span>
            <span 
              onClick={() => navigate('/login')} 
              style={{ color: '#7B1FA2', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer', marginLeft: '6px' }}
            >
              {t('login')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
