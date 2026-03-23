import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar as DateRange, Award as EmojiEvents,
  BarChart3, Target, Zap, ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';

import { useSettings } from '../context/SettingsContext';

const MonthlyReport = () => {
  const navigate = useNavigate();
  const { t } = useSettings();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get('/api/progress/monthly/');
        setReportData(response.data);
      } catch (error) {
        console.error('Error fetching monthly report:', error);
        setErrorMessage("Network error: failed to load report data");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', background: 'var(--bg-light)' }}>
        <div style={{ textAlign: 'center' }}>
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <EmojiEvents size={60} color="#BA68C8" />
          </motion.div>
          <div style={{ color: '#BA68C8', fontSize: '1.2rem', fontWeight: 800, marginTop: '20px' }}>{t('compilingHighlights')}</div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center', background: 'var(--bg-light)', minHeight: '100dvh' }}>
        <div style={{ color: '#D32F2F', fontSize: '1.125rem', fontWeight: 600 }}>{errorMessage}</div>
        <button onClick={() => navigate(-1)} style={{ marginTop: '20px', background: 'var(--gradient)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700 }}>{t('back') || 'Go Back'}</button>
      </div>
    );
  }

  const data = reportData || {
    month: "This Month",
    cards: { active_days: 0, consistency_percent: 0, mood_checks: 0, meditations: 0 },
    achievement: { title: "Getting Started", subtitle: "Keep tracking your wellness journey." },
    cta: { button_text: "Get Next Month's Plan" }
  };

  const isUnlocked = data.achievement?.title?.toLowerCase()?.includes("unlocked") || false;
  const achievementColor = isUnlocked ? 'linear-gradient(135deg, #00E676 0%, #00C853 100%)' : 'linear-gradient(135deg, #FFD54F 0%, #FFA000 100%)';

  return (
    <div style={{ background: 'var(--bg-light)', minHeight: '100dvh', paddingBottom: '80px' }}>
      
      {/* MAGENTA GRADIENT HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #BA68C8 0%, #EC407A 100%)',
        borderRadius: '0 0 40px 40px',
        padding: '60px 24px 40px',
        boxShadow: '0 10px 32px rgba(236, 64, 122, 0.2)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '180px', height: '180px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
             <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                <ArrowLeft size={24} color="white" />
             </button>
             <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{t('monthlyReport')}</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9 }}>
            <DateRange size={18} />
            <span style={{ fontWeight: 600 }}>{data.month}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 24px', maxWidth: '800px', margin: '-20px auto 0' }}>

        {/* STATS GRID (2x2) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: t('activeDays'), val: data.cards.active_days, icon: <BarChart3 size={24} />, color: '#1E88E5', bg: '#E3F2FD' },
            { label: t('consistency'), val: `${data.cards.consistency_percent}%`, icon: <Target size={24} />, color: '#43A047', bg: '#E8F5E9' },
            { label: t('moodChecks'), val: data.cards.mood_checks, icon: <Zap size={24} />, color: '#8E24AA', bg: '#F3E5F5' },
            { label: t('meditations'), val: data.cards.meditations, icon: <ShieldCheck size={24} />, color: '#FBC02D', bg: '#FFFDE7' },
          ].map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              style={{ background: 'white', borderRadius: '32px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.03)' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: '16px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                {stat.icon}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-dark)' }}>{stat.val}</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ACHIEVEMENT CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: achievementColor, 
            borderRadius: '40px', 
            padding: '40px 32px', 
            boxShadow: '0 16px 32px rgba(0,0,0,0.1)', 
            marginBottom: '40px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textAlign: 'center',
            color: 'white'
          }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <EmojiEvents size={72} color="white" style={{ marginBottom: '20px' }} />
          </motion.div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>{data.achievement.title}</div>
          <div style={{ fontSize: '1rem', opacity: 0.9, fontWeight: 500, maxWidth: '250px' }}>{data.achievement.subtitle}</div>
        </motion.div>

        {/* BOTTOM BUTTON */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/insights')}
          style={{
            width: '100%',
            height: '64px',
            borderRadius: '32px',
            background: 'var(--gradient)',
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: 800,
            border: 'none',
            boxShadow: '0 8px 24px rgba(103, 58, 183, 0.25)',
            cursor: 'pointer'
          }}
        >
          {data.cta.button_text}
        </motion.button>

      </div>
    </div>
  );
};

export default MonthlyReport;
