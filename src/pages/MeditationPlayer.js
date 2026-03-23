import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Volume2, VolumeX, Music, Home, Pause, Play, ChevronUp, ChevronDown, ArrowUp, ArrowDown } from 'lucide-react';
import api from '../api';

const MeditationPlayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('sessionId') || 'morning';
  const programId = queryParams.get('programId') || '0';

  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const [totalSeconds, setTotalSeconds] = useState(sessionId === 'stress' ? 420 : (sessionId === 'deep' ? 540 : (sessionId === 'sleep' ? 480 : 300)));
  const [remainingTime, setRemainingTime] = useState(totalSeconds);
  const [isBreathingIn, setIsBreathingIn] = useState(true);
  const [breathCount, setBreathCount] = useState(0);

  const categoryQuotes = {
    morning: [
      "Welcome to your morning calm. Inhale deeply.",
      "Let yourself be present in this moment.",
      "Release any tension in your body and mind.",
      "Feel the fresh energy of the morning.",
      "You are ready for a wonderful day ahead.",
      "Almost finished. Stay focused on your breath.",
      "Gently return your awareness."
    ],
    stress: [
      "Welcome to your stress relief session. Breathe out the tension.",
      "Let go of the thoughts that weigh you down.",
      "In this moment, you are safe and centered.",
      "With every breath, find more space and ease.",
      "You are in control of your calm.",
      "Almost finished. Feel the pressure lifting away.",
      "Gently carry this peace with you."
    ],
    deep: [
      "Welcome to deep relaxation. Sink into stillness.",
      "Let every muscle in your body soften.",
      "Observe your breath like waves on a shore.",
      "Journey deep into your inner calm.",
      "There is nowhere else you need to be.",
      "Almost finished. Feel the total mind reset.",
      "Gently and slowly awaken your senses."
    ],
    sleep: [
      "Welcome to sleep preparation. Wind down gently.",
      "Release the day and all its activities.",
      "Your body is becoming heavier and more relaxed.",
      "Prepare your mind for a restful journey.",
      "Peace and sleep are coming to you now.",
      "Almost finished. Drift closer to peaceful rest.",
      "Gently allow yourself to fade into sleep."
    ]
  };

  const activeQuotes = categoryQuotes[sessionId] || categoryQuotes.morning;
  const currentQuote = activeQuotes[Math.floor((totalSeconds - remainingTime) / 60) % activeQuotes.length] || activeQuotes[0];

  const [activeSessionId, setActiveSessionId] = useState(null);
  const [program, setProgram] = useState(null);

  // Text-to-Speech for quotes
  useEffect(() => {
    if (currentQuote && isPlaying && !isMuted) {
      // Cancel previous speech if any
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQuote);
      utterance.rate = 0.85; // Calmer pace
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else if (!isPlaying || isMuted) {
      window.speechSynthesis.cancel();
    }
  }, [currentQuote, isPlaying, isMuted]);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        if (programId && programId !== '0') {
          const response = await api.get(`/api/meditations/${programId}/`);
          setProgram(response.data);
          if (response.data.duration_seconds) {
            setTotalSeconds(response.data.duration_seconds);
            setRemainingTime(response.data.duration_seconds);
          }
        }
      } catch (error) {
        console.error("Failed to fetch meditation program", error);
      }
    };
    fetchProgram();
  }, [programId]);

  useEffect(() => {
    // Start session on load if playing
    const startSession = async () => {
      try {
        const response = await api.post('/api/meditations/start/', { program_id: programId });
        setActiveSessionId(response.data.session_id);
      } catch (error) {
        console.error("Failed to start meditation session in backend", error);
      }
    };
    if (isPlaying && programId && programId !== '0' && !activeSessionId) {
      startSession();
    }
  }, [isPlaying, programId, activeSessionId]);

  useEffect(() => {
    let timer;
    if (isPlaying && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime(prev => prev - 1);
        if ((totalSeconds - remainingTime + 1) % 5 === 0) {
          setIsBreathingIn(prev => !prev);
        }
      }, 1000);
    } else if (remainingTime <= 0) {
      // Complete!
      const finishSession = async () => {
        if (activeSessionId) {
          try {
             await api.post('/api/meditations/stop/', { session_id: activeSessionId });
          } catch(err) {
             console.error("Failed to stop", err);
          }
        }
        alert("Meditation complete!");
        navigate(-1);
      };
      finishSession();
    }
    return () => clearInterval(timer);
  }, [isPlaying, remainingTime, totalSeconds, activeSessionId, navigate]);

  useEffect(() => {
    if (isBreathingIn && isPlaying) {
      setBreathCount(c => c + 1);
    }
  }, [isBreathingIn]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGradient = () => {
    switch (sessionId) {
      case 'stress': return 'linear-gradient(180deg, #26C6DA 0%, #00ACC1 100%)';
      case 'deep': return 'linear-gradient(180deg, #9C27B0 0%, #7B1FA2 100%)';
      case 'sleep': return 'linear-gradient(180deg, #1A237E 0%, #0D47A1 100%)';
      default: return 'linear-gradient(180deg, #FFA726 0%, #FFB300 100%)';
    }
  };

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
      background: getGradient(),
      color: 'white',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px'
    }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button 
          onClick={() => setIsMuted(!isMuted)}
          style={{ 
            width: 44, height: 44, borderRadius: '50%', 
            background: 'rgba(255,255,255,0.2)', border: 'none', 
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            width: 44, height: 44, borderRadius: '50%', 
            background: 'rgba(255,255,255,0.2)', border: 'none', 
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}
        >
          <X size={20} />
        </button>
      </div>

      <div style={{ maxWidth: '500px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Track Info */}
        <div style={{ 
          width: '100%', 
          background: 'rgba(255,255,255,0.15)', 
          borderRadius: '20px', 
          padding: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          marginBottom: '64px'
        }}>
          <Music size={24} style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '1.0625rem', fontWeight: 800, margin: 0 }}>{program?.title || 'Guided Session'}</h4>
            <p style={{ fontSize: '0.875rem', opacity: 0.7, margin: 0 }}>Guide: {program?.category || 'Calm & Gentle'}</p>
          </div>
        </div>

        {/* Central Breathing Circle */}
        <div style={{ position: 'relative', width: '230px', height: '230px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px' }}>
           {/* Outer Dashed Circle */}
           <div style={{ 
             position: 'absolute', 
             width: '230px', 
             height: '230px', 
             borderRadius: '50%', 
             border: '4px dashed rgba(255,255,255,0.3)' 
           }} />
           
           {/* Inner Circle with Progress */}
           <div style={{ 
             width: '190px', 
             height: '190px', 
             borderRadius: '50%', 
             background: 'rgba(255,255,255,0.2)', 
             display: 'flex', 
             flexDirection: 'column', 
             alignItems: 'center', 
             justifyContent: 'center',
             position: 'relative'
           }}>
             {/* Progress Arc Simulation */}
             <svg style={{ position: 'absolute', width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle
                  cx="95" cy="95" r="91"
                  fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="8"
                  strokeDasharray="571"
                  strokeDashoffset={571 * (remainingTime % 5 / 5)}
                  strokeLinecap="round"
                />
             </svg>

             <span style={{ fontSize: '4rem', fontWeight: 300 }}>{(remainingTime % 5) + 1}</span>
             <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.8 }}>
               {isBreathingIn ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
               <span style={{ fontSize: '1.125rem', fontWeight: 500 }}>{isBreathingIn ? 'Breathe In...' : 'Breathe Out...'}</span>
             </div>
           </div>
        </div>

        {/* Breaths Completed Pill */}
        <div style={{ 
          background: 'rgba(255,255,255,0.2)', 
          padding: '12px 24px', 
          borderRadius: '32px', 
          fontSize: '0.9375rem', 
          fontWeight: 500,
          marginBottom: '32px'
        }}>
          {breathCount} breaths completed
        </div>

        {/* Quote */}
        <div style={{ height: '100px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, opacity: 0.6, letterSpacing: '2px', marginBottom: '8px' }}>WELCOME</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentQuote}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ fontSize: '1.625rem', fontWeight: 500, lineHeight: 1.3, padding: '0 16px' }}
            >
              {currentQuote}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Bottom Timer & Controls */}
        <div style={{ marginTop: 'auto', textAlign: 'center', paddingBottom: '40px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '4rem', fontWeight: 800, margin: 0 }}>{formatTime(remainingTime)}</h2>
            <p style={{ opacity: 0.6, fontSize: '1rem', marginTop: '-8px' }}>remaining</p>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ 
              width: 96, height: 96, borderRadius: '50%', 
              background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              color: '#E67E22', boxShadow: '0 16px 32px rgba(0,0,0,0.2)',
              border: 'none', cursor: 'pointer'
            }}
          >
            {isPlaying ? <Pause size={48} /> : <Play size={48} style={{ marginLeft: '6px' }} />}
          </motion.button>
        </div>
        
        {/* Audio Player */}
        {(() => {
          const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
          const activeProgramUrl = program?.audio_play_url;
          const fullAudioUrl = activeProgramUrl ? (activeProgramUrl.startsWith('http') ? activeProgramUrl : `${BASE_URL}${activeProgramUrl}`) : null;
          
          if (!fullAudioUrl) return null;
          
          return (
            <audio 
              key={fullAudioUrl}
              src={fullAudioUrl} 
              autoPlay={isPlaying} 
              muted={isMuted}
              ref={(audio) => {
                if (audio) {
                  if (isPlaying) {
                    audio.play().catch(e => console.log('Audio autoplay prevented:', e));
                  } else {
                    audio.pause();
                  }
                }
              }}
            />
          );
        })()}
      </div>
    </div>
  );
};

export default MeditationPlayer;
