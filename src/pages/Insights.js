import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, History, Lightbulb, Loader2, ArrowLeft, Target, TrendingUp } from 'lucide-react';
import api from '../api';

import { useSettings } from '../context/SettingsContext';

const Insights = () => {
  const navigate = useNavigate();
  const { t } = useSettings();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await api.get('/api/ai/insights/');
        const data = response.data;
        if (data.insights && data.insights.length > 0) {
          setInsights(data.insights || []);
          setPatterns(data.patterns || data.recommendations || []);
          setHasData(true);
        } else {
          setHasData(false);
        }
      } catch (error) {
        console.error('Error fetching insights:', error);
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', background: 'var(--bg-light)' }}>
        <div style={{ textAlign: 'center' }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Sparkles size={60} color="var(--primary-start)" />
          </motion.div>
          <div style={{ color: 'var(--primary-start)', fontSize: '1.2rem', fontWeight: 800, marginTop: '20px' }}>{t('consultingAi')}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-light)', minHeight: '100dvh', paddingBottom: '60px' }}>
      
      {/* PREMIUM HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #673AB7 0%, #9575CD 100%)',
        borderRadius: '0 0 40px 40px',
        padding: '60px 24px 40px',
        boxShadow: '0 10px 32px rgba(103, 58, 183, 0.2)',
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
             <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{t('aiInsights')}</h1>
          </div>
          <p style={{ margin: 0, opacity: 0.9, fontWeight: 500 }}>{t('wellnessGuidance')}</p>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        {!hasData ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ 
              background: 'white', padding: '48px 32px', borderRadius: '32px', 
              boxShadow: 'var(--shadow-md)', textAlign: 'center',
              border: '1px solid rgba(0,0,0,0.03)', marginTop: '20px'
            }}
          >
            <div style={{ width: '100px', height: '100px', background: '#F3E5F5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <History size={48} color="#AB47BC" style={{ opacity: 0.6 }} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '12px' }}>{t('gatheringWisdom')}</h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '32px', maxWidth: '300px', margin: '0 auto 32px' }}>
              {t('minChecksRequired')}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/mood')}
              style={{ 
                padding: '16px 32px', borderRadius: '18px', 
                background: 'var(--gradient)', color: 'white', 
                border: 'none', fontWeight: 800, cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(103, 58, 183, 0.25)',
                fontSize: '1rem'
              }}
            >
              {t('startFirstCheckin')}
            </motion.button>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* ANALYSIS SECTION */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingLeft: '8px' }}>
                <TrendingUp size={20} color="var(--primary-start)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>{t('wellnessAnalysis')}</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {insights.map((insight, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ 
                      background: 'white', padding: '20px', borderRadius: '24px', 
                      display: 'flex', gap: '16px', alignItems: 'center',
                      boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(149, 117, 205, 0.05)'
                    }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Sparkles size={18} color="#1E88E5" />
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-dark)', fontWeight: 600, lineHeight: 1.5 }}>{insight}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* PATTERNS SECTION */}
            {patterns.length > 0 && (
              <section>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingLeft: '8px' }}>
                  <Target size={20} color="#8E24AA" />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>{t('actionablePatterns')}</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {patterns.map((pattern, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + 0.3 }}
                      style={{ 
                        background: 'white', padding: '20px', borderRadius: '24px', 
                        display: 'flex', gap: '16px', alignItems: 'center',
                        boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(149, 117, 205, 0.05)'
                      }}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F3E5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Target size={18} color="#8E24AA" />
                      </div>
                      <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-dark)', fontWeight: 600, lineHeight: 1.5 }}>{pattern}</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* TIP BOX */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ background: 'rgba(76, 175, 80, 0.08)', padding: '20px', borderRadius: '24px', display: 'flex', gap: '16px', alignItems: 'center', border: '1px solid rgba(76, 175, 80, 0.15)' }}
            >
              <div style={{ padding: '8px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(76, 175, 80, 0.1)' }}>
                <Lightbulb size={24} color="#2E7D32" />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#2E7D32', fontWeight: 800 }}>{t('proTip')}</div>
                <p style={{ margin: '2px 0 0', fontSize: '0.8125rem', color: '#2E7D32', fontWeight: 600, opacity: 0.8 }}>
                  {t('proTipText')}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
