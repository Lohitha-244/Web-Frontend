import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wind, Moon, Sun, Book, Heart, Palette, UserCheck, Music, Smile, Sparkles, MessageSquare, Flame, TrendingUp } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Care = () => {
  const navigate = useNavigate();
  const { settings, t } = useSettings();
  const sections = [
    {
      title: t('mindfulness'),
      items: [
        { title: t('meditation'), subtitle: t('meditationSub'), icon: <Moon size={24} />, color: '#AB47BC', bg: '#EBE3FF', path: '/meditation' },
        { title: t('breathing'), subtitle: t('breathingSub'), icon: <Wind size={24} />, color: '#9575CD', bg: '#E0F7FA', path: '/breathing' },
        { title: t('natureSounds'), subtitle: t('natureSoundsSub'), icon: <Sun size={24} />, color: '#43A047', bg: '#E8F5E9', path: '/soundscape' },
      ]
    },
    {
      title: t('expression'),
      items: [
        { title: t('journaling'), subtitle: t('journalingSub'), icon: <Book size={24} />, color: '#1B5E20', bg: '#E8F5E9', path: '/journal' },
        { title: t('gratitudePractice'), subtitle: t('gratitudePracticeSub'), icon: <Heart size={24} />, color: '#F4511E', bg: '#FFF9C4', path: '/gratitude' },
        { title: t('creativeExpression'), subtitle: t('creativeExpressionSub'), icon: <Palette size={24} />, color: '#D81B60', bg: '#FFEBEE', path: '/creative' },
      ]
    },
    {
      title: t('bodyMind'),
      items: [
        { title: t('bodyScanRelaxation'), subtitle: t('bodyScanRelaxationSub'), icon: <UserCheck size={24} />, color: '#7B1FA2', bg: '#F3E5F5', path: '/body-scan' },
        { title: t('musicTherapy'), subtitle: t('musicTherapySub'), icon: <Music size={24} />, color: '#0277BD', bg: '#E3F2FD', path: '/music-therapy' },
      ]
    },
    {
      title: t('positiveMindset'),
      items: [
        { title: t('dailyAffirmations'), subtitle: t('dailyAffirmationsSub'), icon: <Sparkles size={24} />, color: '#9575CD', bg: '#EBE3FF', path: '/affirmations' },
        { title: t('trackProgress'), subtitle: t('trackProgressSub'), icon: <TrendingUp size={24} />, color: '#9575CD', bg: '#E3F2FD', path: '/progress' },
      ]
    }
  ];

  return (
    <div className="care-page" style={{ background: 'var(--bg-light)', minHeight: '100%' }}>
      <div className="android-header">
        <h1 className="android-title">{t('selfcare')}</h1>
        <p className="android-subtitle">{t('chooseActivity')}</p>
      </div>

      <div style={{ padding: '0 32px' }}>
        {/* Featured AI Companion Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          onClick={() => navigate('/chat')}
          className="android-card"
          style={{
            background: 'var(--surface-alt)',
            display: 'flex',
            alignItems: 'center',
            padding: '1.5rem',
            marginBottom: '20px',
            cursor: 'pointer',
            border: 'none',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              width: 80, height: 80,
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #EC407A, #AB47BC)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 8px 16px rgba(236, 64, 122, 0.3)'
            }}>
              <MessageSquare size={40} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-start)' }}>{t('aiCompanion')}</h3>
              <p style={{ fontSize: '1rem', color: 'var(--primary-start)', fontWeight: 500, margin: '4px 0 0', opacity: 0.8 }}>{t('aiCompanionSub')}</p>
            </div>
          </div>
          <button style={{
            background: 'var(--gradient)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '16px',
            fontWeight: 800,
            boxShadow: '0 4px 12px rgba(103, 58, 183, 0.2)'
          }}>
            {t('chatNow')}
          </button>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          {sections.map((section, idx) => (
            <div key={idx} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-start)', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
                {section.title}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                {section.items.map((item, i) => (
                  <motion.div
                    key={i}
                    className="android-card"
                    whileHover={{ scale: 1.02, x: 10 }}
                    onClick={() => item.path && navigate(item.path)}
                    style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', background: 'var(--dynamic-white)' }}
                  >
                    <div style={{
                      width: 64,
                      height: 64,
                      borderRadius: '20px',
                      background: 'var(--surface-alt)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.color,
                      boxShadow: 'var(--shadow-sm)',
                      flexShrink: 0
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', fontWeight: 500 }}>{item.subtitle}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="android-card" style={{
          background: 'rgba(149, 117, 205, 0.1)',
          textAlign: 'center',
          marginTop: '2rem',
          marginBottom: '32px'
        }}>
          <p style={{ color: 'var(--bg-dark)', fontWeight: 600, fontSize: '1rem', lineHeight: 1.4 }}>
            💡 {t('careTip')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Care;
