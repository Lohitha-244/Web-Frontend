import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Heart, Smile, Zap, TrendingDown, TrendingUp, Lightbulb,
  Activity, BarChart3, Target, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';
import { useSettings } from '../context/SettingsContext';

const MoodAnalytics = () => {
  const navigate = useNavigate();
  const { t } = useSettings();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/api/mood/analytics/');
        setAnalyticsData(response.data);
      } catch (error) {
        console.error('Error fetching mood analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', background: 'var(--bg-light)' }}>
        <div style={{ textAlign: 'center' }}>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <BarChart3 size={48} color="var(--primary-start)" />
          </motion.div>
          <div style={{ color: 'var(--primary-start)', fontSize: '1.2rem', fontWeight: 800, marginTop: '16px' }}>{t('crunching')}</div>
        </div>
      </div>
    );
  }

  const data = analyticsData || {
    total_checkins: 0,
    this_period_checkins: 0,
    insights: [t('keepLoggingPatterns')]
  };

  const getDiagnosisColor = (stress) => {
    if (stress <= 3) return '#4CAF50';
    if (stress <= 6) return '#FFA000';
    return '#D32F2F';
  };

  return (
    <div style={{ background: 'var(--bg-light)', minHeight: '100dvh', paddingBottom: '80px' }}>
      
      {/* PREMIUM HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #AB47BC 0%, #42A5F5 100%)',
        borderRadius: '0 0 40px 40px',
        padding: '60px 24px 40px',
        boxShadow: '0 10px 32px rgba(103, 58, 183, 0.2)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
             <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                <ArrowLeft size={24} color="white" />
             </button>
             <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{t('analyticsTitle')}</h1>
          </div>
          <p style={{ margin: 0, opacity: 0.9, fontWeight: 500 }}>{t('analyticsSubtitle')}</p>
        </div>
      </div>

      <div style={{ padding: '0 24px', maxWidth: '800px', margin: '-20px auto 0' }}>
        
        {/* TOP STATS CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ background: 'white', borderRadius: '32px', padding: '24px', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(0,0,0,0.03)' }}
          >
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(171, 71, 188, 0.1)', color: '#AB47BC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <Calendar size={24} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1 }}>{data.total_checkins}</div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '4px' }}>{t('totalChecks')}</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ background: 'white', borderRadius: '32px', padding: '24px', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid rgba(0,0,0,0.03)' }}
          >
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(33, 150, 243, 0.1)', color: '#42A5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <Activity size={24} />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1 }}>{data.this_period_checkins}</div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '4px' }}>{t('thisWeek')}</div>
          </motion.div>
        </div>

        {/* MOST COMMON MOOD SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: 'white', borderRadius: '32px', padding: '24px', boxShadow: 'var(--shadow-md)', marginBottom: '24px', border: '1px solid rgba(149, 117, 205, 0.05)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ padding: '8px', background: '#F3E5F5', borderRadius: '12px' }}>
              <Smile size={24} color="#AB47BC" />
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>{t('primaryMood')}</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(243, 229, 245, 0.2)', borderRadius: '24px', padding: '20px' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4A148C', textTransform: 'capitalize' }}>
                {data.most_common_mood.mood && data.most_common_mood.mood !== 'None' ? t(data.most_common_mood.mood.toLowerCase()) : t('gatheringData')}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#7B1FA2', fontWeight: 500, marginTop: '4px' }}>
                {data.most_common_mood.mood && data.most_common_mood.mood !== 'None' 
                  ? `${data.most_common_mood.percent}% of your check-ins` 
                  : t('keepLoggingPatterns')}
              </div>
            </div>
            <div style={{ fontSize: '2.5rem' }}>
              {data.most_common_mood.mood?.toLowerCase().includes('great') ? '🌟' : 
               data.most_common_mood.mood?.toLowerCase().includes('happy') ? '😊' :
               data.most_common_mood.mood?.toLowerCase().includes('sad') ? '😔' :
               data.most_common_mood.mood?.toLowerCase().includes('stressed') ? '😫' : '💭'}
            </div>
          </div>
        </motion.div>

        {/* STRESS LEVEL & TREND */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '32px' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ background: 'white', borderRadius: '32px', padding: '24px', boxShadow: 'var(--shadow-md)', border: '1px solid rgba(149, 117, 205, 0.05)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ padding: '8px', background: '#FFFDE7', borderRadius: '12px' }}>
                <Zap size={24} color="#FBC02D" />
              </div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>{t('avgStress')}</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: getDiagnosisColor(data.avg_stress) }}>{data.avg_stress.toFixed(1)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ height: '8px', width: '100%', background: '#F5F5F5', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${data.avg_stress * 10}%` }}
                    style={{ height: '100%', background: getDiagnosisColor(data.avg_stress), borderRadius: '4px' }}
                  />
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('stressScaleNote')}</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ 
              background: data.trend === 'down' ? '#E8F5E9' : data.trend === 'up' ? '#FFEBEE' : '#E3F2FD', 
              borderRadius: '32px', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' 
            }}
          >
            <div style={{ 
              width: 56, height: 56, borderRadius: '50%', background: 'white', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
              {data.trend === 'down' ? <TrendingDown color="#2E7D32" size={32} /> : 
               data.trend === 'up' ? <TrendingUp color="#C62828" size={32} /> : 
               <Target color="#1565C0" size={32} />}
            </div>
            <div>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-dark)', textTransform: 'capitalize' }}>{t('trend')}: {t(data.trend)}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-dark)', opacity: 0.7, fontWeight: 500, marginTop: '2px' }}>
                {data.trend === 'down' ? t('down') : data.trend === 'up' ? t('up') : t('stable')}
              </div>
            </div>
          </motion.div>
        </div>

        {/* INSIGHTS */}
        {data.insights.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-start)', marginBottom: '16px', paddingLeft: '8px' }}>{t('growthInsights')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.insights.map((insight, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  key={i} 
                  style={{ background: 'white', borderRadius: '24px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.03)' }}
                >
                  <div style={{ padding: '6px', background: '#FFF3E0', borderRadius: '50%' }}>
                    <Lightbulb size={20} color="#F57C00" />
                  </div>
                  <div style={{ fontSize: '0.9375rem', color: 'var(--text-dark)', fontWeight: 500 }}>{insight}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/insights')}
          style={{
            width: '100%', height: '64px', borderRadius: '32px',
            background: 'var(--gradient)', color: 'white',
            fontSize: '1.125rem', fontWeight: 800, border: 'none',
            boxShadow: '0 8px 24px rgba(103, 58, 183, 0.25)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
          }}
        >
          <Sparkles size={24} />
          {t('viewRecommendations')}
        </motion.button>

      </div>
    </div>
  );
};

export default MoodAnalytics;
