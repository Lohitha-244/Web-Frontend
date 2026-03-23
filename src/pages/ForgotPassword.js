import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const ForgotPassword = () => {
  const { t } = useSettings();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      await api.post(`/api/forgot-password/`, { email });
      navigate('/otp', { state: { email } });
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.error || 'User not found or email invalid');
      } else {
        setErrorMsg(`Connection error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* Desktop Banner */}
      <div className="auth-banner">
        <div style={{ zIndex: 1, maxWidth: '400px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2 }}>{t('needHelp')}</h1>
          <p style={{ fontSize: '1.25rem', fontWeight: 500, opacity: 0.9, lineHeight: 1.6 }}>{t('resetPasswordDesc')}</p>
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
              {t('resetPassword')}
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#7B1FA2',
              lineHeight: '26px',
              fontWeight: 500,
              marginTop: '12px',
            }}>
              {t('resetPasswordDesc')}
            </p>
          </div>

          {errorMsg && (
            <div style={{ color: 'white', background: '#D32F2F', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Email Field */}
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <div style={{ position: 'absolute', left: '16px', top: '20px', color: '#7B1FA2' }}>
                <Mail size={24} />
              </div>
              <input
                type="email"
                placeholder={t('email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  height: '64px',
                  background: '#F8F9FA',
                  border: '1px solid rgba(0,0,0,0.05)',
                  borderRadius: '16px',
                  padding: '0 48px',
                  fontSize: '16px',
                  color: '#212121',
                  outline: 'none',
                  transition: 'border 0.2s ease',
                }}
                onFocus={(e) => e.target.style.border = '1px solid #7B1FA2'}
                onBlur={(e) => e.target.style.border = '1px solid rgba(0,0,0,0.05)'}
              />
            </div>

            {/* Remember Password Card */}
            <div style={{
              background: '#F3E5F5',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              marginBottom: '48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#7B1FA2' }}>
                {t('rememberPassword')}
              </div>
              <div 
                onClick={() => navigate('/login')}
                style={{ 
                  fontSize: '15px', 
                  fontWeight: 600, 
                  color: '#4A148C', 
                  textDecoration: 'underline', 
                  marginTop: '8px',
                  cursor: 'pointer',
                  display: 'inline-block'
                }}
              >
                {t('signInHere')}
              </div>
            </div>

            {/* Send OTP Button */}
            <button
              type="submit"
              disabled={!email || isLoading}
              style={{
                width: '100%',
                height: '64px',
                borderRadius: '32px',
                background: '#7B1FA2',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                border: 'none',
                boxShadow: email && !isLoading ? '0 12px 24px rgba(103, 58, 183, 0.2)' : 'none',
                cursor: email ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: email ? 1 : 0.6,
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => { if(email && !isLoading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(103, 58, 183, 0.3)'; } }}
              onMouseOut={(e) => { if(email && !isLoading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(103, 58, 183, 0.2)'; } }}
            >
              {isLoading ? 'Loading...' : t('sendOTP')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
