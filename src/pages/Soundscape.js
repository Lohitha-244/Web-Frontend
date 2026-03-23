import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, CloudRain, Waves, Bird, Moon, Wind, Droplets, Volume2 } from 'lucide-react';
import api from '../api';

const Soundscape = () => {
  const navigate = useNavigate();
  const [activeSoundId, setActiveSoundId] = useState(null);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [sounds, setSounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSounds = async () => {
      try {
        const response = await api.get('/api/sounds/nature/');
        setSounds(response.data);
      } catch (error) {
        console.error("Error fetching sounds:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSounds();
  }, []);

  const [startTime, setStartTime] = useState(null);

  const toggleSound = async (soundId) => {
    try {
      if (activeSoundId === soundId) {
        // Stop current sound
        if (activeSessionId) {
          const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
          await api.post('/api/sounds/play/stop/', { play_id: activeSessionId, duration_sec: duration });
        }
        setActiveSoundId(null);
        setActiveSessionId(null);
        setStartTime(null);
      } else {
        // Stop previous if exists
        if (activeSessionId) {
          const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
          await api.post('/api/sounds/play/stop/', { play_id: activeSessionId, duration_sec: duration });
        }
        // Start new sound
        const response = await api.post('/api/sounds/play/start/', { track_id: soundId });
        setActiveSoundId(soundId);
        setActiveSessionId(response.data.play_id);
        setStartTime(Date.now());
      }
    } catch (error) {
      console.error("Error toggling sound:", error);
      setActiveSoundId(activeSoundId === soundId ? null : soundId);
    }
  };

  return (
    <div style={{ background: '#FBFAFF', minHeight: '100%', paddingBottom: '40px' }}>
      <div className="android-header">
        <h1 className="android-title">Nature Sounds</h1>
        <p className="android-subtitle">Authentic nature ambiance</p>
      </div>

      <div style={{ padding: '0 24px' }}>
        <div style={{ paddingTop: '32px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#7B1FA2', padding: '40px' }}>Loading sounds...</div>
          ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {sounds.map((sound) => {
                const isActive = activeSoundId === sound.id;
                return (
                  <motion.div
                    key={sound.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleSound(sound.id)}
                    style={{ 
                      background: isActive ? 'var(--gradient)' : 'white',
                      borderRadius: '32px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                      cursor: 'pointer',
                      border: isActive ? 'none' : '1px solid rgba(149, 117, 205, 0.1)'
                    }}
                  >
                    <div style={{ 
                      width: '64px', 
                      height: '64px', 
                      borderRadius: '50%', 
                      background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--surface-alt)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '2rem',
                      marginBottom: '16px',
                      boxShadow: isActive ? 'none' : 'inset 0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                      {sound.emoji}
                    </div>
                    <div style={{ 
                      fontSize: '1rem', 
                      fontWeight: 800, 
                      color: isActive ? 'white' : 'var(--bg-dark)',
                      textAlign: 'center',
                      marginBottom: '4px'
                    }}>
                      {sound.title}
                    </div>
                    {isActive && (
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                        Playing...
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Info Card */}
            <div className="android-card" style={{ 
              marginTop: '40px',
              background: 'rgba(149, 117, 205, 0.1)', 
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              marginBottom: '32px',
              border: 'none'
            }}>
              <div style={{ fontSize: '1.5rem' }}>🧘</div>
              <p style={{ fontSize: '1rem', color: 'var(--primary-start)', lineHeight: 1.6, fontWeight: 700, margin: 0 }}>
                True Ambience: You are now listening to real nature recordings. Only one sound can play at a time for maximum peace.
              </p>
            </div>
            
            {/* Audio Player */}
            {(() => {
              const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
              const activeSoundUrl = sounds.find(s => s.id === activeSoundId)?.audio_url;
              const fullAudioUrl = activeSoundUrl ? (activeSoundUrl.startsWith('http') ? activeSoundUrl : `${BASE_URL}${activeSoundUrl}`) : null;
              
              if (!fullAudioUrl) return null;
              
              return (
                <audio 
                  key={fullAudioUrl}
                  src={fullAudioUrl} 
                  autoPlay 
                  loop 
                  ref={(audio) => {
                    if (audio) {
                      audio.play().catch(e => console.log('Audio autoplay prevented:', e));
                    }
                  }}
                />
              );
            })()}
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Soundscape;
