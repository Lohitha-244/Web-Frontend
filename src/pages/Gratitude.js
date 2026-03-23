import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Plus, Heart, Star, LayoutGrid, Users, Zap, Gift, Leaf, Rocket, Sparkles } from 'lucide-react';

const Gratitude = () => {
  const navigate = useNavigate();
  const [gratitudeText, setGratitudeText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Moments');

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ today: 0, total: 0, streak: 0 });
  const fetchGratitudeData = async () => {
    try {
      const response = await api.get('/api/gratitude/dashboard/');
      setStats({
        today: response.data.today_count || 0,
        total: response.data.total_count || 0,
        streak: response.data.streak_days || 0
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gratitude data:', error);
      setLoading(false);
    }
  };

  const handleAddGratitude = async () => {
    if (!gratitudeText.trim()) return;
    try {
      await api.post('/api/gratitude/entries/', {
        text: gratitudeText,
        category: selectedCategory
      });
      setGratitudeText('');
      fetchGratitudeData();
    } catch (error) {
      console.error('Error adding gratitude:', error);
    }
  };

  const categories = [
    { name: "People", emoji: "👥", icon: <Users size={20} />, color: "#880E4F", bg: "#EBE3FF" },
    { name: "Moments", emoji: "✨", icon: <Sparkles size={20} />, color: "#4A148C", bg: "#F3E5F5" },
    { name: "Things", emoji: "🎁", icon: <Gift size={20} />, color: "#1A237E", bg: "#E3F2FD" },
    { name: "Self", emoji: "💪", icon: <Zap size={20} />, color: "#1B5E20", bg: "#E8F5E9" },
    { name: "Nature", emoji: "🍃", icon: <Leaf size={20} />, color: "#004D40", bg: "#E1F5FE" },
    { name: "Opportunities", emoji: "🚀", icon: <Rocket size={20} />, color: "#E65100", bg: "#FFF3E0" }
  ];

  const StatBox = ({ label, value }) => (
    <div style={{ 
      background: '#9575CD', 
      height: '64px', 
      borderRadius: '16px', 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.8)' }}>{label}</div>
      <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'white' }}>{value}</div>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg-light)', minHeight: '100vh' }}>
      {/* Desktop Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--bg-dark)' }}>Gratitude Practice</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Count your blessings daily</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {[{label: 'Today', value: stats.today}, {label: 'Total', value: stats.total}, {label: 'Streak', value: `${stats.streak}🔥`}].map((s, i) => (
            <div key={i} style={{ background: 'linear-gradient(135deg, #9575CD, #D81B60)', padding: '0.5rem 1rem', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>{s.label}</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'white' }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>


      <div style={{ padding: '24px' }}>
        {/* Today's Prompt */}
        <div style={{ 
          background: 'var(--surface-alt)', 
          padding: '20px', 
          borderRadius: '24px', 
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F57C00', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px' }}>
            <Sparkles size={16} />
            Today's Prompt
          </div>
          <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#5D4037', margin: 0 }}>
            What do you appreciate about yourself?
          </p>
        </div>

        {/* Main Input Area */}
        <div style={{ 
          background: 'var(--dynamic-white)', 
          padding: '24px', 
          borderRadius: '32px', 
          boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#D81B60', marginBottom: '20px' }}>
            <Heart size={24} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>What are you grateful for?</h2>
          </div>

          {/* Category Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {categories.map((cat, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.name)}
                style={{ 
                  height: '64px',
                  borderRadius: '16px',
                  border: selectedCategory === cat.name ? `2px solid ${cat.color}` : 'none',
                  background: selectedCategory === cat.name ? 'var(--dynamic-white)' : cat.bg,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <div style={{ fontSize: '1.25rem' }}>{cat.emoji}</div>
                <div style={{ fontSize: '0.625rem', fontWeight: 800, color: cat.color }}>{cat.name}</div>
              </motion.button>
            ))}
          </div>

          <textarea
            value={gratitudeText}
            onChange={(e) => setGratitudeText(e.target.value)}
            placeholder="I'm grateful for..."
            style={{ 
              width: '100%', 
              height: '120px', 
              borderRadius: '24px', 
              border: '1px solid var(--surface)', 
              padding: '16px', 
              fontSize: '1rem', 
              outline: 'none',
              resize: 'none',
              marginBottom: '24px'
            }}
          />

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAddGratitude}
            disabled={!gratitudeText.trim()}
            style={{ 
              width: '100%', 
              height: '56px', 
              borderRadius: '20px', 
              background: gratitudeText.trim() ? 'linear-gradient(90deg, #FFB74D 0%, #F06292 100%)' : '#CCC',
              border: 'none',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: gratitudeText.trim() ? '0 4px 12px rgba(240, 98, 146, 0.3)' : 'none',
              cursor: gratitudeText.trim() ? 'pointer' : 'default'
            }}
          >
            <Plus size={20} />
            Add Gratitude
          </motion.button>
        </div>

        {/* Benefits Card */}
        <div style={{ 
          background: 'var(--dynamic-white)', 
          padding: '24px', 
          borderRadius: '32px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#7B1FA2', marginBottom: '20px' }}>
            <Sparkles size={20} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Gratitude Benefits</h3>
          </div>
          
          {[
            { icon: <Heart size={18} />, color: "#D81B60", title: "Better Sleep:", desc: "Grateful thoughts before bed improve sleep quality" },
            { icon: <Zap size={18} />, color: "#9C27B0", title: "More Happiness:", desc: "Regular practice increases overall life satisfaction" },
            { icon: <Star size={18} />, color: "#FBC02D", title: "Stronger Relationships:", desc: "Expressing gratitude deepens connections" }
          ].map((benefit, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: i === 2 ? 0 : '16px' }}>
              <div style={{ color: benefit.color, marginTop: '2px' }}>{benefit.icon}</div>
              <div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#7B1FA2' }}>{benefit.title}</div>
                <div style={{ fontSize: '0.8125rem', color: '#AB47BC' }}>{benefit.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Tip */}
        <div style={{ 
          background: 'var(--surface-alt)', 
          padding: '20px', 
          borderRadius: '24px', 
          display: 'flex', 
          gap: '12px',
          marginBottom: '32px'
        }}>
          <div style={{ fontSize: '1.25rem' }}>💡</div>
          <p style={{ fontSize: '0.875rem', color: '#8D6E63', lineHeight: 1.5, fontWeight: 500, margin: 0 }}>
            Pro Tip: Try listing 3 things you're grateful for every morning. Your brain will start naturally looking for more good things throughout the day!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Gratitude;
