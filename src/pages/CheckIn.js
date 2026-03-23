import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import api from '../api';
import { useSettings } from '../context/SettingsContext';

const CheckIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useSettings();
  const mood = location.state?.mood || 'Okay';

  const [answers, setAnswers] = useState(['', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch translated question sets
  const questionSets = t('checkinQuestions') || {};
  const currentQuestions = questionSets[mood] || questionSets["Okay"] || [];

  const handleOptionSelect = (qIdx, opt) => {
    const newAnswers = [...answers];
    newAnswers[qIdx] = opt;
    setAnswers(newAnswers);
  };

  const handleComplete = async () => {
    if (!isComplete) return;
    setIsSubmitting(true);
    try {
      const payload = {
        mood: mood,
        answers: { q1: answers[0], q2: answers[1], q3: answers[2] }
      };
      await api.post('/api/mood/checkin/', payload);
      navigate('/checkin-complete', { state: { mood } });
    } catch (error) {
      console.error('Error submitting check-in:', error);
      navigate('/checkin-complete', { state: { mood } });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplete = answers.every(ans => ans !== '');

  return (
    <div style={{ minHeight: '100vh', background: '#FBFAFF', display: 'flex', flexDirection: 'column', padding: '24px' }}>
      <button 
        onClick={() => navigate(-1)}
        style={{ width: 44, height: 44, borderRadius: '50%', background: 'transparent', border: 'none', color: '#7B1FA2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-12px', marginBottom: '8px' }}
      >
        <ArrowLeft size={28} />
      </button>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#4A148C', lineHeight: 1.2, margin: 0 }}>
          {t('quickQuestions')}
        </h1>
        <p style={{ fontSize: '1rem', color: '#AB47BC', marginTop: '8px', lineHeight: 1.4, fontWeight: 500 }}>
          {t('tailoredForMood').replace('{mood}', mood)}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
        {currentQuestions.map((q, qIdx) => (
          <div key={qIdx} style={{ background: 'white', padding: '24px', borderRadius: '32px', boxShadow: '0 8px 16px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
              <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#AB47BC' }}>{t('qPrefix')}{qIdx + 1}</span>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#7B1FA2', margin: 0 }}>{q.text}</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {q.opts.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleOptionSelect(qIdx, opt)}
                  style={{ 
                    width: '100%', 
                    height: '56px', 
                    borderRadius: '16px', 
                    background: answers[qIdx] === opt ? '#F3E5F5' : '#FBFAFF', 
                    border: answers[qIdx] === opt ? 'none' : '1px solid #F3E5F5',
                    color: answers[qIdx] === opt ? '#7B1FA2' : '#AB47BC',
                    fontSize: '1rem',
                    fontWeight: answers[qIdx] === opt ? 700 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleComplete}
        disabled={!isComplete || isSubmitting}
        style={{
          width: '100%',
          height: '64px',
          borderRadius: '32px',
          background: isComplete ? 'linear-gradient(90deg, #90CAF9 0%, #E1BEE7 100%)' : 'rgba(0,0,0,0.05)',
          color: isComplete ? 'white' : '#BDBDBD',
          fontSize: '1.125rem',
          fontWeight: 700,
          border: 'none',
          boxShadow: isComplete ? '0 8px 16px rgba(0,0,0,0.1)' : 'none',
          cursor: isComplete && !isSubmitting ? 'pointer' : 'default',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : t('completeCheckIn')}
      </motion.button>
    </div>
  );
};

export default CheckIn;
