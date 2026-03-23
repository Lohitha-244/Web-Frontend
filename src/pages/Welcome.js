import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const Welcome = () => {
  const navigate = useNavigate();
  const { t } = useSettings();

  return (
    <div className="auth-layout">
      {/* Desktop Banner */}
      <div className="auth-banner">
        <div style={{ zIndex: 1, maxWidth: '400px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>Solace</h1>
          <p style={{ fontSize: '1.25rem', fontWeight: 500, opacity: 0.9, lineHeight: 1.6 }}>
            "{t('healingQuote')}"
          </p>
        </div>
      </div>

      <div className="auth-content" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          maxWidth: '440px', 
          width: '100%', 
          margin: '0 auto',
          padding: '1.5rem 1.5rem 2.5rem 1.5rem',
          minHeight: '100%',
          justifyContent: 'center'
        }}>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'var(--gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 32px rgba(103, 58, 183, 0.2)',
                margin: '0 auto 16px auto'
              }}
            >
              <Heart size={40} color="white" fill="white" />
            </motion.div>

            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 800, 
              color: 'var(--primary-start)', 
              lineHeight: 1.2,
              marginBottom: '8px'
            }}>
              {t('welcomeToSolace')}
            </h1>

            <p style={{ 
              fontSize: '1rem', 
              color: 'var(--text-muted)', 
              fontWeight: 500,
            }}>
              {t('safeSpace')}
            </p>
          </div>

          {/* Info Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', marginBottom: '24px' }}>
            <div className="card" style={{ 
              background: 'var(--dynamic-white)', 
              padding: '16px', 
              display: 'flex', 
              alignItems: 'center',
              border: '1px solid rgba(209, 196, 233, 0.4)'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--surface-alt)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Sparkles size={28} color="var(--primary-start)" />
              </div>
              <div style={{ marginLeft: '20px' }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary-start)' }}>
                  {t('aiSupportTitle')}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {t('aiSupportDesc')}
                </div>
              </div>
            </div>

            <div className="card" style={{ 
              background: 'var(--dynamic-white)', 
              padding: '16px', 
              display: 'flex', 
              alignItems: 'center',
              border: '1px solid rgba(209, 196, 233, 0.4)'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--bg-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Shield size={28} color="var(--primary-start)" />
              </div>
              <div style={{ marginLeft: '20px' }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary-start)' }}>
                  {t('privateSecureTitle')}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {t('privateSecureDesc')}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/login')}
            style={{
              width: '100%',
              height: '56px',
              borderRadius: '28px',
              background: 'var(--gradient)',
              color: 'white',
              fontSize: '1.0625rem',
              fontWeight: 800,
              border: 'none',
              boxShadow: '0 8px 24px rgba(103, 58, 183, 0.25)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(103, 58, 183, 0.35)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(103, 58, 183, 0.25)'; }}
          >
            {t('getStarted')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
