import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Headphones, Sun, Shield, Waves, Moon, Play, Clock, Watch, Sparkles, Check, Loader2 } from 'lucide-react';
import api from '../api';

const Meditation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState([]);

  const iconMap = { morning: Sun, stress: Shield, deep: Waves, sleep: Moon };
  const bgColorMap = { morning: '#FFFDE7', stress: '#E0F7FA', deep: '#F3E5F5', sleep: '#E8EAF6' };
  const playColorsMap = {
    morning: ['#FFB300', '#FF6D00'], stress: ['#00B8D4', '#00B0FF'],
    deep: ['#BA68C8', '#8E24AA'], sleep: ['#3F51B5', '#1A237E']
  };

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await api.get('/api/meditations/');
        const data = response.data.map(p => ({
          ...p,
          icon: iconMap[p.category] || Sun,
          bgColor: bgColorMap[p.category] || '#F3E5F5',
          playColors: playColorsMap[p.category] || ['#9575CD', '#673AB7'],
          bullets: p.bullets || [],
          highlights: p.highlights || [p.duration_label || ''],
          bestTime: p.best_time || 'Best: Anytime'
        }));
        setPrograms(data);
      } catch (error) {
        console.error('Error fetching meditations:', error);
        // Fallback static programs if API fails
        setPrograms([
          { id: 1, category: 'morning', title: 'Morning Calm', description: 'Start your day with clarity.', duration_label: '5 min', icon: Sun, bgColor: '#FFFDE7', playColors: ['#FFB300', '#FF6D00'], bullets: ['Gratitude focus', 'Energizing breath'], highlights: ['Boost energy'], bestTime: 'Best: 6-9 AM' },
          { id: 2, category: 'stress', title: 'Stress Relief', description: 'Release tension and find your center.', duration_label: '7 min', icon: Shield, bgColor: '#E0F7FA', playColors: ['#00B8D4', '#00B0FF'], bullets: ['Body awareness', 'Calming breath'], highlights: ['Lower cortisol'], bestTime: 'Best: Anytime' },
          { id: 3, category: 'deep', title: 'Deep Relaxation', description: 'A deeper journey into mindfulness.', duration_label: '9 min', icon: Waves, bgColor: '#F3E5F5', playColors: ['#BA68C8', '#8E24AA'], bullets: ['Full body scan', 'Visualization'], highlights: ['Full mind reset'], bestTime: 'Best: Afternoon' },
          { id: 4, category: 'sleep', title: 'Sleep Preparation', description: 'Gently drift into restful sleep.', duration_label: '8 min', icon: Moon, bgColor: '#E8EAF6', playColors: ['#3F51B5', '#1A237E'], bullets: ['Body heaviness', 'Sleep imagery'], highlights: ['Fall asleep faster'], bestTime: 'Best: Night' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  return (
    <div style={{ background: '#FBFAFF', minHeight: '100%', paddingBottom: '40px' }}>
      <div className="android-header">
        <h1 className="android-title">Guided Meditation</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', opacity: 0.9 }}>
          <Headphones size={18} />
          <span style={{ fontSize: '1rem', fontWeight: 500 }}>Audio guided • Find your inner peace</span>
        </div>
      </div>

      <div style={{ padding: '0 24px', maxWidth: '600px', margin: '0 auto' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
          {programs.map((program) => (
            <MeditationCard 
              key={program.id}
              program={program}
              onClick={() => navigate(`/meditation-player?programId=${program.id}&sessionId=${program.category}`)}
            />
          ))}
        </div>

        {/* Pro Tip Card */}
        <div className="android-card" style={{ 
          background: 'rgba(149, 117, 205, 0.1)', 
          display: 'flex',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <Sparkles size={24} style={{ color: 'var(--primary-start)', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary-start)', margin: '0 0 4px 0' }}>Pro Tip:</h4>
            <p style={{ fontSize: '0.9375rem', color: 'var(--bg-dark)', lineHeight: 1.5, margin: 0, opacity: 0.8 }}>
              Each meditation uses different techniques. Try them at their recommended times for maximum benefit!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MeditationCard = ({ program, onClick }) => {
  const Icon = program.icon;
  
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="android-card"
      style={{
        background: program.bgColor,
        cursor: 'pointer',
        border: 'none',
        padding: '24px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ 
          width: 72, height: 72, borderRadius: '20px', 
          background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <Icon size={32} style={{ color: program.playColors[0] }} />
        </div>
        
        <div style={{ 
          width: 56, height: 56, borderRadius: '50%', 
          background: `linear-gradient(135deg, ${program.playColors[0]}, ${program.playColors[1]})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-md)'
        }}>
          <Play size={28} fill="white" color="white" style={{ marginLeft: '4px' }} />
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--bg-dark)', margin: '0 0 8px 0' }}>{program.title}</h3>
        <p style={{ fontSize: '0.9375rem', color: 'var(--bg-dark)', opacity: 0.7, margin: '0 0 16px 0', lineHeight: 1.4 }}>{program.description}</p>
        
        <div style={{ fontSize: '0.8125rem', color: 'var(--primary-start)', fontWeight: 600, opacity: 0.8, marginBottom: '12px' }}>
          {program.bullets.join(' • ')}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          {program.highlights.map((h, i) => (
            <div key={i} style={{ 
              background: 'rgba(255,255,255,0.6)', 
              borderRadius: '12px', 
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              color: 'var(--primary-start)',
              fontWeight: 700,
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <Check size={14} />
              {h}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '0.75rem', color: 'var(--bg-dark)', fontWeight: 700, opacity: 0.8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} />
            {program.duration_label}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Watch size={16} />
            {program.bestTime}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Meditation;
