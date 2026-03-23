import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Trash2, Heart, Palette, Book, Smile, ChevronRight, Filter, UserCheck } from 'lucide-react';
import api from '../api';
import { useSettings } from '../context/SettingsContext';

const History = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useSettings();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'mood'); // mood, gratitude, creative, journal, reflection
  const [loading, setLoading] = useState(false);
  
  const [moodEntries, setMoodEntries] = useState([]);
  const [gratitudeEntries, setGratitudeEntries] = useState([]);
  const [artEntries, setArtEntries] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [reflectionEntries, setReflectionEntries] = useState([]);

  const tabs = [
    { id: 'mood', label: t('mood'), icon: <Smile size={18} />, color: '#7B1FA2' },
    { id: 'gratitude', label: t('gratitude'), icon: <Heart size={18} />, color: '#D81B60' },
    { id: 'creative', label: t('art'), icon: <Palette size={18} />, color: '#EC407A' },
    { id: 'journal', label: t('journal'), icon: <Book size={18} />, color: '#1B5E20' },
    { id: 'reflection', label: t('reflection'), icon: <UserCheck size={18} />, color: '#7B1FA2' },
  ];

  const fetchData = async (tab) => {
    setLoading(true);
    let endpoint = '';
    if (tab === 'mood') endpoint = '/api/mood/history/';
    else if (tab === 'gratitude') endpoint = '/api/gratitude/entries/';
    else if (tab === 'creative') endpoint = '/api/creative/entries/';
    else if (tab === 'journal') endpoint = '/api/journal/entries/';
    else if (tab === 'reflection') endpoint = '/api/body-scan/dashboard/'; // Using dashboard for now or I'll implement session list if it exists

    try {
      const response = await api.get(endpoint);

      if (tab === 'mood') setMoodEntries(response.data);
      else if (tab === 'gratitude') setGratitudeEntries(response.data);
      else if (tab === 'creative') setArtEntries(response.data);
      else if (tab === 'journal') setJournalEntries(response.data);
      else if (tab === 'reflection') setReflectionEntries(response.data.last_session ? [response.data.last_session] : []);
    } catch (error) {
      console.error(`Error fetching ${tab} entries:`, error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const getMoodEmoji = (mood) => {
    const emojis = { 'great': '😁', 'happy': '😊', 'okay': '😐', 'stressed': '😰', 'sad': '😢', 'angry': '😡' };
    return emojis[mood.toLowerCase()] || '😶';
  };

  return (
    <div style={{ background: '#FBFAFF', minHeight: '100%' }}>
      <div className="android-header">
        <h1 className="android-title">{t('wellnessHistory')}</h1>
        <p className="android-subtitle">{t('reviewEntries')}</p>
      </div>

      <div style={{ padding: '0 24px' }}>
        <div className="no-scrollbar" style={{ display: 'flex', gap: '0.75rem', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '20px',
                background: activeTab === tab.id ? 'var(--gradient)' : 'white',
                color: activeTab === tab.id ? 'white' : tab.color,
                border: activeTab === tab.id ? 'none' : `1px solid ${tab.color}40`,
                display: 'flex', alignItems: 'center', gap: '8px',
                fontWeight: 700, fontSize: '0.875rem',
                whiteSpace: 'nowrap',
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: activeTab === tab.id ? 'var(--shadow-md)' : 'var(--shadow-sm)'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '24px', flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--primary-start)', fontWeight: 600 }}>{t('loadingEntries')}</div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'mood' && (
                <motion.div key="mood" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {moodEntries.length > 0 ? moodEntries.map((entry) => (
                    <div key={entry.id} className="android-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ fontSize: '32px' }}>{getMoodEmoji(entry.mood)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--bg-dark)' }}>{t(entry.mood)}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(entry.created_at).toLocaleDateString()} • {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-start)' }}>{t('stressLevel')}: {entry.stress_level}/10</div>
                      </div>
                    </div>
                  )) : <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{t('noEntries')}</div>}
                </motion.div>
              )}

              {activeTab === 'gratitude' && (
                <motion.div key="gratitude" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {gratitudeEntries.length > 0 ? gratitudeEntries.map((entry) => (
                    <div key={entry.id} className="android-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ background: 'var(--bg-light)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-start)', textTransform: 'capitalize' }}>
                          {entry.category}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{entry.date_label}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--bg-dark)', lineHeight: 1.5 }}>"{entry.text}"</p>
                    </div>
                  )) : <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{t('noEntries')}</div>}
                </motion.div>
              )}

              {activeTab === 'creative' && (
                <motion.div key="creative" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  {artEntries.length > 0 ? artEntries.map((entry) => (
                    <div key={entry.id} className="android-card" style={{ padding: 0, overflow: 'hidden' }}>
                      <div style={{ height: '120px', background: 'var(--bg-light)', overflow: 'hidden' }}>
                        <img src={entry.image_url} alt={entry.prompt_text} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ padding: '12px' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--bg-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.prompt_text}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{new Date(entry.created_at).toLocaleDateString()} • {entry.strokes} {t('strokes')}</div>
                      </div>
                    </div>
                  )) : <div style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>{t('noEntries')}</div>}
                </motion.div>
              )}

              {activeTab === 'journal' && (
                <motion.div key="journal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {journalEntries.length > 0 ? journalEntries.map((entry) => (
                    <div key={entry.id} className="android-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                         <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{entry.date_label}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--bg-dark)', opacity: 0.8, lineHeight: 1.4 }}>{entry.text}</p>
                    </div>
                  )) : <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{t('noEntries')}</div>}
                </motion.div>
              )}

              {activeTab === 'reflection' && (
                <motion.div key="reflection" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {reflectionEntries.length > 0 ? reflectionEntries.map((entry) => (
                    <div key={entry.id} className="android-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ background: '#F3E5F5', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, color: '#7B1FA2' }}>
                          {t('bodyScanSession')}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(entry.started_at).toLocaleDateString()}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('stepsCompleted')}</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--bg-dark)' }}>{entry.steps_completed} / {entry.steps_total}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('totalDuration')}</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--bg-dark)' }}>{Math.floor(entry.total_seconds / 60)}{t('minShort')} {entry.total_seconds % 60}{t('secShort')}</div>
                        </div>
                      </div>
                    </div>
                  )) : <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{t('noEntries')}</div>}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default History;
