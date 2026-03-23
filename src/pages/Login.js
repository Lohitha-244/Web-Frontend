import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Lock, EyeOff, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';
import { useSettings } from '../context/SettingsContext';

const Login = () => {
  const { t } = useSettings();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const isFormValid = username.trim() !== '' && password.trim() !== '';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await api.post('/api/auth/login/', {
        username: username.trim(),
        password: password,
      });

      if (response.data && response.data.access) {
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh || '');
        navigate('/home');
      } else {
        setErrorMsg('Login failed: No access token');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMsg(
          error.response.data.message ||
          error.response.data.detail ||
          `Error: ${error.response.status}`
        );
      } else {
        setErrorMsg(`Network error: ${error.message}`);
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
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2 }}>{t('welcomeBackTitle')}</h1>
          <p style={{ fontSize: '1.25rem', fontWeight: 500, opacity: 0.9, lineHeight: 1.6 }}>
            "{t('welcomeBackQuote')}"
          </p>
        </div>
      </div>

      <div className="auth-content" style={{ position: 'relative' }}>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute', top: '24px', left: '24px',
            width: '48px', height: '48px',
            background: 'none', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0, zIndex: 10
          }}
        >
          <ArrowLeft size={24} color="#7B1FA2" />
        </button>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '440px', width: '100%', margin: '0 auto', justifyContent: 'center' }}>

          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#4A148C', margin: 0 }}>{t('userLogin')}</h1>
            <p style={{ fontSize: '16px', color: '#7B1FA2', marginTop: '8px' }}>
              {t('loginSubtitle')}
            </p>
          </div>

          {errorMsg && (
            <div style={{ color: 'white', background: '#D32F2F', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Username Field */}
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <div style={{ position: 'absolute', left: '16px', top: '18px', color: '#7B1FA2' }}>
                <User size={24} />
              </div>
              <input
                type="text"
                placeholder={t('username')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%', height: '60px',
                  background: 'var(--bg-light)',
                  border: '1px solid rgba(149,117,205,0.3)',
                  borderRadius: '16px',
                  padding: '0 48px',
                  fontSize: '16px', color: '#212121',
                  outline: 'none', transition: 'border 0.2s ease',
                }}
                onFocus={(e) => e.target.style.border = '1.5px solid #7B1FA2'}
                onBlur={(e) => e.target.style.border = '1px solid rgba(149,117,205,0.3)'}
              />
            </div>

            {/* Password Field */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <div style={{ position: 'absolute', left: '16px', top: '18px', color: '#7B1FA2' }}>
                <Lock size={24} />
              </div>
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%', height: '60px',
                  background: 'var(--bg-light)',
                  border: '1px solid rgba(149,117,205,0.3)',
                  borderRadius: '16px',
                  padding: '0 48px',
                  fontSize: '16px', color: '#212121',
                  outline: 'none', transition: 'border 0.2s ease',
                }}
                onFocus={(e) => e.target.style.border = '1.5px solid #7B1FA2'}
                onBlur={(e) => e.target.style.border = '1px solid rgba(149,117,205,0.3)'}
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                style={{ position: 'absolute', right: '16px', top: '18px', background: 'none', border: 'none', color: '#7B1FA2', cursor: 'pointer', padding: 0 }}
              >
                {passwordVisible ? <Eye size={24} /> : <EyeOff size={24} />}
              </button>
            </div>

            {/* Forgot Password */}
            <div
              onClick={() => navigate('/forgot-password')}
              style={{ color: '#7B1FA2', fontSize: '14px', fontWeight: 500, cursor: 'pointer', marginBottom: '32px', alignSelf: 'flex-start' }}
            >
              {t('forgotPassword')}
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={!isFormValid || isLoading}
              whileHover={isFormValid && !isLoading ? { y: -2, boxShadow: '0 12px 24px rgba(103,58,183,0.3)' } : {}}
              style={{
                width: '100%', height: '64px',
                borderRadius: '32px',
                background: isFormValid ? 'var(--gradient)' : '#ccc',
                color: isFormValid ? 'white' : '#888',
                fontSize: '18px', fontWeight: 600,
                border: 'none',
                boxShadow: isFormValid ? '0 8px 16px rgba(103,58,183,0.2)' : 'none',
                cursor: isFormValid ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
            >
              {isLoading ? t('loggingIn') : t('login')}
            </motion.button>
          </form>

          <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center', fontSize: '15px' }}>
            <span style={{ color: '#7B1FA2' }}>{t('dontHaveAccount')} </span>
            <span
              onClick={() => navigate('/signup')}
              style={{ color: '#4A148C', fontWeight: 'bold', cursor: 'pointer', marginLeft: '6px' }}
            >
              {t('signUp')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
