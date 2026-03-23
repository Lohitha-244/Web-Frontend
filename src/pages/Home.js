import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Zap, Star, Quote, MessageCircle, Heart, Sparkles, TrendingUp, User, Settings as SettingsIcon, Loader2, BarChart3 } from 'lucide-react';
import api from '../api';
import { useSettings } from '../context/SettingsContext';

const StatCard = ({ label, value, icon, unit }) => (
  <div style={{
    width: '100px',
    height: '110px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.25)'
  }}>
    <div style={{ marginBottom: '6px' }}>{icon}</div>
    <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>{label}</span>
    <span style={{ fontSize: '1.375rem', fontWeight: 800 }}>{value}</span>
    {unit && <span style={{ fontSize: '0.625rem', opacity: 0.8 }}>{unit}</span>}
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const { settings, t } = useSettings();
  const [currentDate] = useState(new Date().toLocaleDateString(settings.app_language === 'en' ? 'en-US' : settings.app_language, {
    weekday: 'long', month: 'long', day: 'numeric'
  }));
  const [loading, setLoading] = useState(true);
  const [welcomeData, setWelcomeData] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await api.get('/api/home/summary/');
        setWelcomeData(response.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-light)' }}>
        <Loader2 size={48} color="var(--primary-start)" className="spin" />
      </div>
    );
  }

  const actions = [
    { title: t('aiChatbot'), subtitle: t('aiChatbotSub'), icon: <MessageCircle size={32} />, path: '/chat', bgColor: 'var(--dynamic-white)' },
    { title: t('moodCheckIn'), subtitle: t('moodCheckInSub'), icon: <Heart size={32} />, path: '/mood', bgColor: 'var(--dynamic-white)' },
    { title: t('selfCare'), subtitle: t('selfCareSub'), icon: <Sparkles size={32} />, path: '/care', bgColor: 'var(--dynamic-white)' },
    { title: t('analyticsTitle'), subtitle: t('analyticsSubtitle'), icon: <BarChart3 size={32} />, path: '/mood-analytics', bgColor: 'var(--dynamic-white)' },
    { title: t('progress'), subtitle: t('progressSub'), icon: <TrendingUp size={32} />, path: '/progress', bgColor: 'var(--dynamic-white)' },
  ];

  return (
    <div className="home-page" style={{ background: 'var(--bg-light)', padding: 0 }}>

      {/* Android-style Gradient Header */}
      <div style={{
        background: 'var(--gradient-vertical)',
        borderRadius: '0 0 40px 40px',
        padding: '32px 24px 24px',
        boxShadow: '0 12px 32px rgba(103,58,183,0.2)',
        color: 'white',
        marginBottom: '16px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                onClick={() => navigate('/profile')}
                style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <User size={28} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{t('welcomeBack')}!</h1>
                <p style={{ opacity: 0.8, fontSize: '1rem', margin: 0 }}>{currentDate}</p>
              </div>
            </div>
            <button onClick={() => navigate('/settings')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <SettingsIcon size={28} />
            </button>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '12px', marginBottom: '32px' }}>
            <StatCard label={t('level')} value={welcomeData?.level ?? 1} icon={<Trophy size={24} />} />
            <StatCard label={t('streak')} value={welcomeData?.streak ?? 0} icon={<Zap size={24} />} unit={t('days')} />
            <StatCard label={t('coins')} value={welcomeData?.coins ?? 0} icon={<Star size={24} />} />
          </div>

          {/* XP Progress Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}>
              <span style={{ fontWeight: 600 }}>{t('xpProgress')}</span>
              <span>{welcomeData?.xp_progress ?? 0}/100</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min((welcomeData?.xp_progress ?? 15), 100)}%`,
                background: 'white',
                borderRadius: '4px'
              }} />
            </div>
          </div>

        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 48px' }}>

        {/* Quote Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          style={{
            background: 'var(--dynamic-white)',
            padding: '20px',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '32px',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid rgba(149,117,205,0.1)'
          }}
        >
          <div style={{ color: '#A1887F', flexShrink: 0 }}>
            <Quote size={32} style={{ transform: 'rotate(180deg)' }} />
          </div>
          <div>
            <p style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--text-dark)', margin: 0 }}>
              "{welcomeData?.motivation || t('defaultMotivation')}"
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--primary-start)', margin: '4px 0 0', fontWeight: 700 }}>
              {t('dailyMotivation')}
            </p>
          </div>
        </motion.div>

        {/* Section heading */}
        <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--primary-start)', marginBottom: '20px' }}>
          {t('supportPrompt')}
        </h2>

        {/* Action Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {actions.map((action, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -3, boxShadow: '0 10px 28px rgba(103,58,183,0.15)' }}
              onClick={() => navigate(action.path)}
              style={{
                background: action.bgColor,
                padding: '20px',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(103,58,183,0.06)',
                border: '1px solid rgba(149,117,205,0.1)'
              }}
            >
              <div style={{
                width: 64, height: 64,
                borderRadius: '16px',
                background: 'var(--surface-alt)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                flexShrink: 0,
                color: 'var(--primary-start)'
              }}>
                {action.icon}
              </div>
              <div style={{ marginLeft: '20px' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--bg-dark)', margin: 0 }}>
                  {action.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--primary-start)', opacity: 0.8, margin: 0 }}>
                  {action.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
