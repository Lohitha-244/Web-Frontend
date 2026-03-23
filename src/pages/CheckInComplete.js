import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Sparkles, TrendingUp } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const CheckInComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useSettings();
  const mood = location.state?.mood || 'Okay';

  // Fetch translated recommendations
  const recommendations = t('recommendations') || {};
  const recommendationText = recommendations[mood] || recommendations['Okay'] || "";

  return (
    <div style={{ minHeight: '100vh', background: 'white', display: 'flex', flexDirection: 'column', padding: '0 24px', alignItems: 'center' }}>
      <div style={{ height: '60px' }} />

      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        style={{ 
          width: '140px', 
          height: '140px', 
          borderRadius: '50%', 
          background: '#1DE9B6', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 12px 24px rgba(29, 233, 182, 0.3)',
          marginBottom: '40px'
        }}
      >
        <Check size={80} color="white" strokeWidth={3} />
      </motion.div>

      <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#4A148C', textAlign: 'center', margin: '0 0 12px' }}>
        {t('checkinCompleteTitle')}
      </h1>
      
      <p style={{ fontSize: '1.125rem', color: '#AB47BC', textAlign: 'center', lineHeight: 1.4, fontWeight: 500, maxWidth: '280px', margin: '0 0 48px' }}>
        {t('checkinCompleteSub')}
      </p>

      {/* Mood Card */}
      <div style={{ 
        width: '100%', 
        background: 'linear-gradient(90deg, #E3F2FD 0%, #F3E5F5 100%)', 
        borderRadius: '24px', 
        padding: '20px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '18px',
        marginBottom: '20px'
      }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <Sparkles size={26} color="#7B1FA2" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#4A148C' }}>
            {t('yourMood').replace('{mood}', t(`mood${mood}`) || mood)}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#7B1FA2', lineHeight: 1.4, fontWeight: 500 }}>{recommendationText}</div>
        </div>
      </div>

      {/* History Tile */}
      <div 
        onClick={() => navigate('/history')}
        style={{ 
          width: '100%', 
          background: 'white', 
          borderRadius: '24px', 
          padding: '20px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          cursor: 'pointer',
          border: '1px solid #F3E5F5',
          marginBottom: '60px'
        }}
      >
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#F3E5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TrendingUp size={26} color="#AB47BC" />
        </div>
        <div>
          <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#4A148C' }}>{t('viewHistory')}</div>
          <div style={{ fontSize: '0.875rem', color: '#7B1FA2', fontWeight: 500 }}>{t('trackMoodOverTime')}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/progress')}
        style={{
          width: '100%',
          height: '64px',
          borderRadius: '32px',
          background: 'linear-gradient(90deg, #42A5F5 0%, #AB47BC 100%)',
          color: 'white',
          fontSize: '1rem',
          fontWeight: 700,
          border: 'none',
          boxShadow: '0 8px 16px rgba(103, 58, 183, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '16px'
        }}
      >
        {t('getPersonalizedSuggestions')}
      </motion.button>

      <button
        onClick={() => navigate('/home')}
        style={{
          width: '100%',
          height: '64px',
          borderRadius: '32px',
          background: 'transparent',
          color: '#7B1FA2',
          fontSize: '1rem',
          fontWeight: 700,
          border: '1.5px solid #E1BEE7'
        }}
      >
        {t('backToHome')}
      </button>

      <div style={{ height: '40px' }} />
    </div>
  );
};

export default CheckInComplete;
