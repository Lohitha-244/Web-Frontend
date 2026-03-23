import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Heart, Book, Calendar, 
  TrendingUp, Award, ChevronRight, TrendingDown,
  BarChart, Sparkles, LayoutGrid, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

import { useSettings } from '../context/SettingsContext';

const Progress = () => {
  const navigate = useNavigate();
  const { t } = useSettings();
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await api.get('/api/progress/summary/');
        setProgressData(response.data);
      } catch (error) {
        console.error('Error fetching progress summary:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', background: 'var(--bg-light)' }}>
        <div style={{ textAlign: 'center' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            style={{ display: 'inline-block', marginBottom: '16px' }}
          >
            <Sparkles size={48} color="var(--primary-start)" />
          </motion.div>
          <div style={{ color: 'var(--primary-start)', fontSize: '1.2rem', fontWeight: 800 }}>{t('analyzingJourney')}</div>
        </div>
      </div>
    );
  }

  const data = progressData || {
    mood_checkins: 0,
    journal_entries: 0,
    achievements: { level: 1, count: 0, label: t('unlockBadges') }
  };

  const hubItems = [
    { 
      title: t('weeklyReport'), 
      subtitle: t('weeklyReportSub'), 
      icon: <Calendar size={24} />, 
      path: '/weekly-report', 
      color: '#42A5F5',
      bg: 'rgba(66, 165, 245, 0.1)'
    },
    { 
      title: t('monthlyReport'), 
      subtitle: t('monthlyReportSub'), 
      icon: <TrendingUp size={24} />, 
      path: '/monthly-report', 
      color: '#AB47BC',
      bg: 'rgba(171, 71, 188, 0.1)'
    },
    { 
      title: t('moodAnalytics'), 
      subtitle: t('analyticsSubtitle'), 
      icon: <BarChart size={24} />, 
      path: '/mood-analytics', 
      color: '#66BB6A',
      bg: 'rgba(102, 187, 106, 0.1)'
    },
    { 
      title: t('aiInsights'), 
      subtitle: t('aiInsightsSub'), 
      icon: <Sparkles size={24} />, 
      path: '/insights', 
      color: '#FFA726',
      bg: 'rgba(255, 167, 38, 0.1)'
    },
  ];

  return (
    <div style={{ background: 'var(--bg-light)', minHeight: '100dvh', paddingBottom: '100px' }}>
      
      {/* PREMIUM HEADER */}
      <div style={{
        background: 'var(--gradient-vertical)',
        padding: '60px 24px 40px',
        color: 'white',
        borderRadius: '0 0 40px 40px',
        boxShadow: '0 10px 32px rgba(103, 58, 183, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', blur: '50px' }} />
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{t('progressHub')}</h1>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '8px 16px', 
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.875rem',
              fontWeight: 700
            }}>
              <Zap size={16} fill="white" />
              {t('level')} {data.achievements?.level || 1}
            </div>
          </div>
          
          <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem', lineHeight: 1.5, maxWidth: '90%' }}>
            {data.keep_going_message || t('unlockBadges')}
          </p>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: '800px', margin: '-20px auto 0' }}>

        {/* TOP METRICS GLASS CARDS */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <motion.div 
            whileHover={{ y: -5 }}
            style={{ 
              flex: 1, background: 'white', borderRadius: '32px', padding: '24px', 
              display: 'flex', flexDirection: 'column', alignItems: 'center', 
              boxShadow: 'var(--shadow-md)', border: '1px solid rgba(149, 117, 205, 0.05)'
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: '16px', background: 'rgba(171, 71, 188, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Heart size={28} color="var(--primary-start)" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1 }}>{data.mood_checkins}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>{t('moodChecks')}</div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            style={{ 
              flex: 1, background: 'white', borderRadius: '32px', padding: '24px', 
              display: 'flex', flexDirection: 'column', alignItems: 'center', 
              boxShadow: 'var(--shadow-md)', border: '1px solid rgba(149, 117, 205, 0.05)'
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: '16px', background: 'rgba(33, 150, 243, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Book size={28} color="#2196F3" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1 }}>{data.journal_entries}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>{t('journalEntries')}</div>
          </motion.div>
        </div>

        {/* NAVIGATION GRID */}
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-start)', marginBottom: '16px', paddingLeft: '8px' }}>
          {t('insightsReports')}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {hubItems.map((item, idx) => (
            <motion.div
              key={idx}
              whileTap={{ scale: 0.96 }}
              whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
              onClick={() => navigate(item.path)}
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '28px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid rgba(149, 117, 205, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ 
                width: 44, height: 44, borderRadius: '14px', 
                background: item.bg, color: item.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontWeight: 800, color: 'var(--text-dark)', fontSize: '1rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.subtitle}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ACHIEVEMENTS CARD */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          style={{ 
            background: 'white', 
            borderRadius: '32px', 
            padding: '24px', 
            marginBottom: '32px',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid rgba(149, 117, 205, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <div style={{ 
            width: 64, height: 64, borderRadius: '20px', 
            background: 'linear-gradient(135deg, #FFD54F 0%, #FFA000 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(255, 160, 0, 0.2)',
            flexShrink: 0
          }}>
            <Award size={32} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-dark)' }}>{t('achievements')}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {data.achievements?.label || t('unlockBadges')}
            </div>
          </div>
          <ChevronRight size={24} color="var(--text-muted)" />
        </motion.div>

      </div>
    </div>
  );
};

export default Progress;
