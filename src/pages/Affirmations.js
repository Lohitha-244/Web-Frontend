import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, RefreshCw, Heart, Star, Sparkles, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Affirmations = () => {
  const navigate = useNavigate();
  const { t } = useSettings();
  const [isMuted, setIsMuted] = useState(false);
  const [sessionCount, setSessionCount] = useState(1);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentAffirmation, setCurrentAffirmation] = useState({
    text: "I am worthy of all the good things that happen in my life.",
    category: "LOVE",
    emoji: "❤️"
  });

  const fetchNextAffirmation = async () => {
    try {
      const response = await api.get('/api/affirmations/next/');
      setCurrentAffirmation({
        id: response.data.id,
        text: response.data.text,
        category: response.data.category_name || "MINDSET",
        emoji: "✨"
      });
    } catch (error) {
      console.error('Error fetching affirmation:', error);
    }
  };

  useEffect(() => {
    fetchNextAffirmation();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTimeSpent(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);


  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    fetchNextAffirmation();
    setSessionCount(prev => prev + 1);
    setIsFavorited(false);
  };

  const HeaderStat = ({ label, value }) => (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.15)', 
      padding: '12px', 
      borderRadius: '16px', 
      flex: 1, 
      textAlign: 'center' 
    }}>
      <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white' }}>{value}</div>
      <div style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );

  return (
    <div style={{ background: '#FBFAFF', minHeight: '100%', paddingBottom: '40px' }}>
      <div className="android-header">
        <h1 className="android-title">{t('dailyAffirmations')}</h1>
        <p className="android-subtitle">{t('mindsetTraining')} • {t('sessionCount')}: {sessionCount}</p>
        <div style={{ position: 'absolute', top: '40px', right: '24px', display: 'flex', gap: '8px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '6px 12px', borderRadius: '12px', color: 'white', fontSize: '0.8rem', fontWeight: 700 }}>⏱ {formatTime(timeSpent)}</div>
          <button onClick={() => setIsMuted(!isMuted)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>

      <div style={{ padding: '0 24px 32px' }}>
        {/* Main Pink Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAffirmation.text}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="android-card"
            style={{ 
              background: 'linear-gradient(135deg, #FF6699 0%, #D81B60 100%)',
              height: '320px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px',
              boxShadow: '0 16px 32px rgba(216, 27, 96, 0.2)',
              marginBottom: '24px',
              border: 'none'
            }}
          >
            <button 
              onClick={() => setIsFavorited(!isFavorited)}
              style={{ 
                position: 'absolute', 
                top: '20px', 
                right: '20px', 
                width: 44, 
                height: 44, 
                borderRadius: '50%', 
                background: 'rgba(255,255,255,0.2)', 
                border: 'none', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Heart size={24} fill={isFavorited ? "white" : "none"} />
            </button>

            <div style={{ fontSize: '4.5rem', marginBottom: '16px' }}>{currentAffirmation.emoji}</div>
            <div style={{ 
              background: 'rgba(255,255,255,0.25)', 
              padding: '6px 16px', 
              borderRadius: '16px', 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              color: 'white', 
              letterSpacing: '1px',
              marginBottom: '16px'
            }}>
              {currentAffirmation.category}
            </div>
            <h2 style={{ 
              fontSize: '1.75rem', 
              fontWeight: 700, 
              color: 'white', 
              textAlign: 'center', 
              lineHeight: 1.4,
              margin: 0
            }}>
              "{currentAffirmation.text}"
            </h2>
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            style={{ 
              flex: 1, 
              height: '72px', 
              background: 'var(--gradient)',
              borderRadius: '24px',
              border: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={24} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.125rem', fontWeight: 800 }}>{t('next')}</div>
              <div style={{ fontSize: '0.875rem' }}>{t('affirmation')}</div>
            </div>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            style={{ 
              width: '40%', 
              height: '72px', 
              background: 'white',
              borderRadius: '24px',
              border: '1px solid rgba(149, 117, 205, 0.2)',
              color: 'var(--primary-start)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontWeight: 800,
              fontSize: '1.125rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Volume2 size={24} />
            {t('listen')}
          </motion.button>
        </div>

        {/* Tip Card */}
        <div className="android-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-start)', marginBottom: '20px' }}>
            <Sparkles size={20} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, margin: 0 }}>{t('practiceTips')}</h3>
          </div>
          
          {[
            { icon: <Star size={18} />, title: t('repeat3Times'), desc: t('sayItOutloud') },
            { icon: <Sparkles size={18} />, title: t('visualize'), desc: t('imagineTrue') },
            { icon: <Heart size={18} />, title: t('feelIt'), desc: t('connectEmotion') }
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: i === 2 ? 0 : '16px' }}>
              <div style={{ color: 'var(--primary-start)', marginTop: '2px' }}>{tip.icon}</div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--bg-dark)' }}>{tip.title}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{tip.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Affirmations;
