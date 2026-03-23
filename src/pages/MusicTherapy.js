import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Music, Clock, Loader2 } from 'lucide-react';
import api from '../api';

const MusicTherapy = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [listeningTimeSeconds, setListeningTimeSeconds] = useState(0);
  const [moods, setMoods] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loadingMoods, setLoadingMoods] = useState(true);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({ tracks_total: 0, listening_label: '0:00' });

  const moodColors = {
    'calm': '#42A5F5', 'happy': '#FFCA28', 'focus': '#EF5350',
    'energize': '#FF7043', 'sleep': '#7986CB', 'meditative': '#D4E157'
  };
  const moodEmojis = {
    'calm': '😌', 'happy': '😊', 'focus': '🎯',
    'energize': '⚡', 'sleep': '😴', 'meditative': '🧘'
  };

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const response = await api.get('/api/music/moods/');
        const moodData = response.data;
        setMoods(moodData);
        if (moodData.length > 0) {
          const firstMood = moodData[0]?.key || moodData[0];
          setSelectedMood(firstMood);
          fetchTracks(firstMood);
        }
      } catch (error) {
        console.error('Error fetching music moods:', error);
        // Fallback moods
        setMoods([
          { key: 'calm', label: 'Calm' },
          { key: 'happy', label: 'Happy' },
          { key: 'focus', label: 'Focus' },
          { key: 'energize', label: 'Energize' },
          { key: 'sleep', label: 'Sleep' },
          { key: 'meditative', label: 'Meditative' }
        ]);
        setSelectedMood('calm');
      } finally {
        setLoadingMoods(false);
      }
    };
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/api/music/dashboard/');
        setDashboardStats(response.data);
      } catch (err) {
        console.error('Error fetching music dashboard:', err);
      }
    };

    fetchMoods();
    fetchDashboard();
  }, []);

  const fetchTracks = async (mood) => {
    setLoadingTracks(true);
    try {
      const response = await api.get(`/api/music/tracks/?mood=${mood}`);
      setTracks(response.data);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      setTracks([]);
    } finally {
      setLoadingTracks(false);
    }
  };

  useEffect(() => {
    let interval;
    if (currentlyPlaying) {
      interval = setInterval(() => setListeningTimeSeconds(prev => prev + 1), 1000);
    } else {
      if (listeningTimeSeconds > 0 && currentlyPlaying === null) {
        // Track stats when stopped (we need to capture the track ID before it's null, so we'll use a cleanup or a ref)
      }
    }
    return () => {
      clearInterval(interval);
    };
  }, [currentlyPlaying]);

  // Handle reporting stats when track changes or unmounts
  useEffect(() => {
    const reportStats = async (trackId, seconds) => {
      if (seconds < 3) return; // Only track if listened for more than 3 seconds
      try {
        await api.post(`/api/music/tracks/${trackId}/listen/`, { seconds });
      } catch (err) {
        console.error("Error reporting music stats:", err);
      }
    };

    return () => {
      if (currentlyPlaying && listeningTimeSeconds > 0) {
        reportStats(currentlyPlaying.id, listeningTimeSeconds);
      }
    };
  }, [currentlyPlaying, listeningTimeSeconds]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMoodSelect = (mood) => {
    const moodKey = mood?.key || mood;
    setSelectedMood(moodKey);
    setCurrentlyPlaying(null);
    setListeningTimeSeconds(0);
    fetchTracks(moodKey);
  };

  return (
    <div style={{ background: '#FBFAFF', minHeight: '100%', paddingBottom: '40px' }}>
      <div className="android-header" style={{ position: 'relative' }}>
        <h1 className="android-title">Music Therapy</h1>
        <p className="android-subtitle">Mood-enhancing soundscapes</p>

        {/* Listening Timer */}
        <div style={{ position: 'absolute', bottom: '24px', right: '24px', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
          <Clock size={18} />
          {currentlyPlaying ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{formatTimer(listeningTimeSeconds)}</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>• ♪ {currentlyPlaying.title || currentlyPlaying.name}</span>
            </div>
          ) : (
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Select a track</span>
          )}
        </div>
      </div>

      <div style={{ padding: '0 24px' }}>
        <div style={{ paddingTop: '32px' }}>

          {/* Stats Bar */}
          <div className="android-card" style={{ 
            background: 'linear-gradient(135deg, #BA68C8 0%, #9C27B0 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '20px',
            marginBottom: '32px',
            border: 'none'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{dashboardStats.tracks_total || 0}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9, fontWeight: 600, textTransform: 'uppercase' }}>Available Tracks</div>
            </div>
            <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.3)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{dashboardStats.listening_label || '0m'}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9, fontWeight: 600, textTransform: 'uppercase' }}>Total Listening</div>
            </div>
          </div>

          {/* Mood Selector */}
          <div className="android-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-start)', marginBottom: '20px' }}>Choose Your Mood</h3>
            {loadingMoods ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <Loader2 size={32} color="var(--primary-start)" />
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {moods.map((mood) => {
                  const moodKey = mood?.key || mood;
                  const label = mood?.label || mood;
                  const color = moodColors[moodKey] || '#9575CD';
                  const emoji = moodEmojis[moodKey] || '🎵';
                  const isSelected = selectedMood === moodKey;
                  return (
                    <motion.div
                      key={moodKey}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMoodSelect(mood)}
                      style={{
                        height: '100px', borderRadius: '24px',
                        background: isSelected ? 'var(--gradient)' : 'white',
                        color: isSelected ? 'white' : 'var(--primary-start)',
                        boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', border: isSelected ? 'none' : '1px solid rgba(149, 117, 205, 0.1)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      <span style={{ fontSize: '2rem', marginBottom: '4px' }}>{emoji}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>{label}</span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Track List */}
          <div className="android-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-start)', marginBottom: '20px' }}>
              {moodEmojis[selectedMood] || '🎵'} {selectedMood} Tracks
            </h3>
            {loadingTracks ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <Loader2 size={32} color="var(--primary-start)" />
              </div>
            ) : tracks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {tracks.map((track) => {
                  const isPlaying = currentlyPlaying?.id === track.id;
                  return (
                    <motion.div
                      key={track.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={async () => {
                        if (isPlaying) {
                           // If stopping, report stats
                           if (listeningTimeSeconds > 2) {
                              try {
                                await api.post(`/api/music/tracks/${track.id}/listen/`, { seconds: listeningTimeSeconds });
                              } catch(e) {}
                           }
                           setCurrentlyPlaying(null);
                           setListeningTimeSeconds(0);
                        } else {
                           setCurrentlyPlaying(track);
                           setListeningTimeSeconds(0);
                        }
                      }}
                      style={{ height: '100px', borderRadius: '24px', background: isPlaying ? '#F3E5F5' : 'white', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: isPlaying ? 'none' : '1px solid #F3E5F5' }}
                    >
                      <div style={{ width: 48, height: 48, borderRadius: '12px', background: isPlaying ? '#BA68C8' : '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isPlaying ? <Pause size={24} color="white" /> : <Play size={24} color="#AB47BC" fill="#AB47BC" style={{ marginLeft: '4px' }} />}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#7B1FA2', margin: 0 }}>{track.title || track.name}</h4>
                        <p style={{ fontSize: '0.75rem', color: '#AB47BC', margin: 0 }}>{track.description || track.mood}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                No tracks available for this mood yet.
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Persistent Player Bar */}
      <AnimatePresence>
        {currentlyPlaying && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              left: '24px',
              right: '24px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '24px',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              zIndex: 1000,
              border: '1px solid rgba(149, 117, 205, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: 48, height: 48, borderRadius: '16px', 
                background: 'var(--gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Music size={24} color="white" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--primary-start)' }}>
                  {currentlyPlaying.title}
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {formatTimer(listeningTimeSeconds)} • {selectedMood}
                </p>
              </div>
            </div>
            <button 
              onClick={() => {
                setCurrentlyPlaying(null);
                setListeningTimeSeconds(0);
              }}
              style={{
                background: 'var(--surface-alt)',
                border: 'none',
                width: 44, height: 44,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--primary-start)'
              }}
            >
              <Pause size={24} fill="currentColor" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Player Logic */}
      {(() => {
        const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
        const activeTrackUrl = currentlyPlaying?.audio_play_url;
        const fullAudioUrl = activeTrackUrl ? (activeTrackUrl.startsWith('http') ? activeTrackUrl : `${BASE_URL}${activeTrackUrl}`) : null;
        
        if (!fullAudioUrl) return null;
        
        return (
          <audio 
            key={fullAudioUrl}
            src={fullAudioUrl} 
            autoPlay 
            loop 
            onPlay={() => console.log("Audio playing:", fullAudioUrl)}
            onError={(e) => console.error("Audio error:", e)}
            ref={(audio) => {
              if (audio && currentlyPlaying) {
                audio.play().catch(e => console.log('Audio autoplay prevented:', e));
              }
            }}
          />
        );
      })()}
    </div>
  );
};

export default MusicTherapy;
