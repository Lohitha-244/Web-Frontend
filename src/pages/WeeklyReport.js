import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ChevronRight, TrendingUp, Sparkles,
  Activity, Calendar, CheckCircle2, BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';

import { useSettings } from '../context/SettingsContext';

const WeeklyReport = () => {
  const navigate = useNavigate();
  const { t } = useSettings();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get('/api/progress/weekly/');
        setReportData(response.data);
      } catch (error) {
        console.error('Error fetching weekly report:', error);
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
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Calendar size={48} color="#00B8D4" />
          </motion.div>
          <div style={{ color: '#00B8D4', fontSize: '1.2rem', fontWeight: 800, marginTop: '16px' }}>{t('generatingReport')}</div>
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
    week_start: "Mon", week_end: "Sun",
    summary: { total_checkins: 0, meditation_sessions: 0, journal_entries: 0 },
    improvement: { text: "Continue your journey to see your weekly wellness improvement score!", percent: 0 },
    insights: ["Track more activities to see personalized weekly insights."],
    cta: { button_text: "Personalized AI Tips" }
  };

  return (
    <div style={{ background: 'var(--bg-light)', minHeight: '100dvh', paddingBottom: '60px' }}>
      
      {/* CYAN GRADIENT HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #00B8D4 0%, #00E5FF 100%)',
        borderRadius: '0 0 40px 40px',
        padding: '60px 24px 40px',
        boxShadow: '0 10px 32px rgba(0, 184, 212, 0.2)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
             <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                <ArrowLeft size={24} color="white" />
             </button>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{t('weeklyReport')}</h1>
          </div>
          <p style={{ margin: 0, opacity: 0.9, fontWeight: 600 }}>{data.week_start} — {data.week_end}</p>
        </div>
      </div>

      <div style={{ padding: '0 24px', maxWidth: '800px', margin: '-20px auto 0' }}>

        {/* SUMMARY CARDS GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: t('checkins'), val: data.summary.total_checkins, icon: <Activity size={20} />, color: '#7B1FA2', bg: '#F3E5F5' },
            { label: t('sessions'), val: data.summary.meditation_sessions, icon: <Sparkles size={20} />, color: '#00B8D4', bg: '#E0F7FA' },
            { label: t('journals'), val: data.summary.journal_entries, icon: <BookOpen size={20} />, color: '#1E88E5', bg: '#E3F2FD' },
          ].map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i}
              style={{ background: 'white', borderRadius: '24px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.03)' }}
            >
              <div style={{ width: 36, height: 36, borderRadius: '12px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                {stat.icon}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)' }}>{stat.val}</div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* IMPROVEMENT CARD */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ background: 'white', borderRadius: '32px', padding: '24px', boxShadow: 'var(--shadow-md)', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '6px', background: '#00B8D4' }} />
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '12px' }}>
            <div style={{ padding: '8px', background: '#E0F7FA', borderRadius: '12px' }}>
              <TrendingUp size={24} color="#00B8D4" />
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>{t('progressScore')}</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#F5F5F5" strokeWidth="8" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#00B8D4" strokeWidth="8" strokeDasharray="213.6" strokeDashoffset={213.6 * (1 - (data.improvement.percent / 100))} strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>{data.improvement.percent}%</div>
            </div>
            <div style={{ flex: 1, fontSize: '0.9375rem', color: 'var(--text-dark)', lineHeight: 1.5, fontWeight: 500 }}>
              {data.improvement.text}
            </div>
          </div>
        </motion.div>

        {/* INSIGHTS SECTION */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-start)', marginBottom: '16px', paddingLeft: '8px' }}>{t('keyInsights')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.insights.map((insight, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                key={idx} 
                style={{ background: 'white', borderRadius: '24px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.03)' }}
              >
                <div style={{ padding: '6px', background: '#F3E5F5', borderRadius: '50%' }}>
                  <CheckCircle2 size={20} color="#8E24AA" />
                </div>
                <div style={{ fontSize: '0.9375rem', color: 'var(--text-dark)', fontWeight: 500 }}>{insight}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA BUTTON */}
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
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
          }}
        >
          <Sparkles size={24} />
          {data.cta.button_text}
        </motion.button>

      </div>
    </div>
  );
};

export default WeeklyReport;
