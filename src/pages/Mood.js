import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Heart, Bolt } from 'lucide-react';

import { useSettings } from '../context/SettingsContext';

const Mood = () => {
  const navigate = useNavigate();
  const { settings, t } = useSettings();
  const [selectedMood, setSelectedMood] = useState('');
  const [stressLevel, setStressLevel] = useState(5);

  const moods = [
    { name: t('moodGreat'), emoji: '😁' },
    { name: t('moodAngry'), emoji: '😠' },
    { name: t('moodTired'), emoji: '😫' },
    { name: t('moodStressed'), emoji: '😰' },
    { name: t('moodSad'), emoji: '😢' }
  ];

  const handleContinue = () => {
    if (selectedMood) {
      navigate('/check-in', { state: { mood: selectedMood, stress: stressLevel } });
    }
  };

  return (
    <div className="mood-page" style={{ background: 'var(--bg-light)', minHeight: '100%' }}>
      <div className="android-header">
        <h1 className="android-title">{t('feelingPrompt')}</h1>
        <p className="android-subtitle">{t('moodSubtitle')}</p>
      </div>

      <div style={{ padding: '0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '48px', paddingTop: '32px' }}>
          {moods.map((mood) => {
            const isSelected = selectedMood === mood.name;
            return (
              <motion.div
                key={mood.name}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMood(mood.name)}
                className={`mood-chip ${isSelected ? 'selected' : ''}`}
                style={{
                  height: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  background: isSelected ? 'var(--gradient)' : 'var(--dynamic-white)',
                  color: isSelected ? 'white' : 'var(--primary-start)',
                  padding: '24px',
                  borderRadius: '32px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <span style={{ fontSize: '48px', marginBottom: '12px' }}>{mood.emoji}</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{mood.name}</span>
                {isSelected && <Heart size={20} fill="white" style={{ position: 'absolute', top: '20px', right: '20px' }} />}
              </motion.div>
            );
          })}
        </div>

      {/* Stress Level Section */}
        <div className="card" style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary-start)', margin: 0 }}>{t('stressLevel')}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Bolt size={20} color="#FFB300" fill="#FFB300" />
              <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)' }}>{stressLevel}/10</span>
            </div>
          </div>

          <input
            type="range"
            min="1"
            max="10"
            value={stressLevel}
            onChange={(e) => setStressLevel(parseInt(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              background: 'var(--bg-light)',
              borderRadius: '3px',
              appearance: 'none',
              outline: 'none',
              accentColor: 'var(--primary-start)'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.75rem', color: 'var(--primary-start)', fontWeight: 500 }}>
            <span>{t('low')}</span>
            <span>{t('high')}</span>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          disabled={!selectedMood}
          style={{
            width: '100%',
            height: '64px',
            borderRadius: '32px',
            background: selectedMood ? 'var(--gradient)' : 'rgba(149, 117, 205, 0.5)',
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: 700,
            border: 'none',
            boxShadow: selectedMood ? 'var(--shadow-md)' : 'none',
            cursor: selectedMood ? 'pointer' : 'default',
            marginBottom: '32px'
          }}
        >
          {t('continue')}
        </motion.button>
      </div>
    </div>
  );
};

export default Mood;
