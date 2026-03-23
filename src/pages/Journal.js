import React, { useState } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Book, Calendar, Plus } from 'lucide-react';

const Journal = () => {
  const navigate = useNavigate();
  const [entry, setEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!entry.trim()) return;
    setIsLoading(true);
    try {
      await api.post('/api/journal/entries/', { text: entry });
      setIsLoading(false);
      navigate('/history');
    } catch (error) {
      console.error('Error saving journal entry:', error);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ background: '#FBFAFF' }}>
      {/* Desktop Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--bg-dark)' }}>Mindful Journal</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Pour your heart out onto the digital paper</p>
        </div>
        <button onClick={() => navigate('/journal-history')} style={{ background: 'white', border: '1px solid rgba(209,196,233,0.5)', borderRadius: '14px', padding: '10px 18px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-start)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <Calendar size={16} /> History
        </button>
      </div>

      <div style={{ position: 'relative' }}>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="How was your day? What's on your mind?..."
          style={{
            width: '100%',
            minHeight: '400px',
            padding: '24px',
            borderRadius: '24px',
            border: '1px solid #EEE',
            background: 'white',
            fontSize: '1.125rem',
            lineHeight: 1.6,
            color: 'var(--bg-dark)',
            outline: 'none',
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
            resize: 'none'
          }}
        />
        <div style={{ 
          position: 'absolute', 
          bottom: '24px', 
          right: '24px', 
          fontSize: '0.875rem', 
          color: 'rgba(0,0,0,0.3)',
          fontWeight: 600
        }}>
          {entry.length} characters
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--bg-dark)', marginBottom: '16px' }}>Need a prompt?</h3>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
          {["What made you smile today?", "One thing you learned...", "Letter to your future self"].map((p, i) => (
            <button 
              key={i} 
              onClick={() => setEntry(prev => prev + (prev ? '\n\n' : '') + p + '\n')}
              style={{ 
                whiteSpace: 'nowrap', 
                padding: '12px 20px', 
                borderRadius: '16px', 
                background: 'white', 
                border: '1px solid #F3E5F5', 
                fontSize: '0.875rem', 
                color: 'var(--primary-start)',
                fontWeight: 600
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={!entry.trim() || isLoading}
        onClick={handleSave}
        style={{
          marginTop: '48px',
          width: '100%',
          height: '64px',
          borderRadius: '32px',
          background: entry.trim() ? 'var(--gradient)' : '#CCC',
          color: 'white',
          fontSize: '1.125rem',
          fontWeight: 700,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          boxShadow: entry.trim() ? '0 10px 20px rgba(103, 58, 183, 0.2)' : 'none'
        }}
      >
        {isLoading ? 'Saving...' : <><Save size={20} /> Save Entry</>}
      </motion.button>
    </div>
  );
};

export default Journal;
