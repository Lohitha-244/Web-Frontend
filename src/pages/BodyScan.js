import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RefreshCw, ChevronRight } from 'lucide-react';
import api from '../api';

const BodyScan = () => {
  const navigate = useNavigate();
  
  // State matching BodyScanScreen.kt
  const phases = ["Tense", "Hold", "Release", "Rest"];
  
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'exercise', 'completion'

  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeLeftInPhase, setTimeLeftInPhase] = useState(5);
  const [totalTimeSeconds, setTotalTimeSeconds] = useState(0);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stepsRes, dashRes] = await Promise.all([
          api.get('/api/body-scan/steps/'),
          api.get('/api/body-scan/dashboard/')
        ]);
        
        if (stepsRes.data) setSteps(stepsRes.data);
        if (dashRes.data) setDashboardData(dashRes.data);
      } catch (error) {
        console.error("Error fetching body scan data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const startSession = async () => {
    try {
      const response = await api.post('/api/body-scan/sessions/start/');
      setSessionId(response.data.id);
      setCurrentStepIndex(0);
      setCurrentPhaseIndex(0);
      setTotalTimeSeconds(0);
      
      const firstStep = steps[0];
      if (firstStep) {
        setTimeLeftInPhase(firstStep.tense_seconds || 5);
      }
      
      setView('exercise');
      setIsPlaying(true);
      speak("Starting body scan. Find a comfortable position.");
    } catch (error) {
      console.error("Error starting body scan session:", error);
    }
  };

  const currentStep = steps[currentStepIndex];
  const currentPhase = phases[currentPhaseIndex];
  const progress = steps.length > 0 ? (currentStepIndex / steps.length) * 100 : 0;

  const logAction = async (phase, seconds) => {
    if (!sessionId || !currentStep) return;
    try {
      await api.post(`/api/body-scan/sessions/${sessionId}/action/`, {
        step_id: currentStep.id,
        phase: phase.toUpperCase(),
        seconds: seconds
      });
    } catch (err) {
      console.error("Error logging body scan action:", err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseDuration = (step, phase) => {
    if (!step) return 5;
    switch(phase) {
      case 'Tense': return step.tense_seconds || 5;
      case 'Hold': return step.hold_seconds || 3;
      case 'Release': return step.release_seconds || 5;
      case 'Rest': return step.rest_seconds || 5;
      default: return 5;
    }
  };

  // Voice effect
  useEffect(() => {
    if (view === 'exercise' && isPlaying && currentStep) {
      if (timeLeftInPhase === getPhaseDuration(currentStep, currentPhase)) {
        if (currentPhaseIndex === 0) {
          speak(`${currentStep.title}. ${currentStep.instructions.split('.')[0]}`);
        } else if (currentPhase === 'Hold') {
          speak("Hold it.");
        } else if (currentPhase === 'Release') {
          speak("Now release and breathe all out.");
        } else if (currentPhase === 'Rest') {
          speak("Rest and relax.");
        }
      }
    }
  }, [currentPhaseIndex, currentStepIndex, isPlaying, view, timeLeftInPhase]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (isPlaying && view === 'exercise') {
      timer = setInterval(() => {
        setTotalTimeSeconds(prev => prev + 1);
        setTimeLeftInPhase(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, view]);

  // Transition effect
  useEffect(() => {
    const runTransition = async () => {
      if (isPlaying && view === 'exercise' && timeLeftInPhase === 0 && currentStep) {
        // 1. Log previous action
        const durationSent = getPhaseDuration(currentStep, currentPhase);
        await logAction(currentPhase, durationSent);

        // 2. Decide next state
        if (currentPhaseIndex < phases.length - 1) {
          const nextIdx = currentPhaseIndex + 1;
          const nextPhase = phases[nextIdx];
          const nextDur = getPhaseDuration(currentStep, nextPhase);
          
          setCurrentPhaseIndex(nextIdx);
          setTimeLeftInPhase(nextDur);
        } else {
          // Next Step
          if (currentStepIndex < steps.length - 1) {
            const nextStepIdx = currentStepIndex + 1;
            const nextStep = steps[nextStepIdx];
            const nextDur = getPhaseDuration(nextStep, 'Tense');
            
            setCurrentStepIndex(nextStepIdx);
            setCurrentPhaseIndex(0);
            setTimeLeftInPhase(nextDur);
          } else {
            // Finished
            setIsPlaying(false);
            speak("Session complete. You may open your eyes now.");
            setView('completion');
          }
        }
      }
    };
    runTransition();
  }, [timeLeftInPhase, isPlaying, view, currentPhaseIndex, currentStepIndex, steps.length, currentStep, currentPhase]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (view === 'dashboard') {
    return (
      <div style={{ background: '#FBFAFF', minHeight: '100%', paddingBottom: '40px' }}>
        <div className="android-header">
          <h1 className="android-title">Body Connection</h1>
          <p className="android-subtitle">Deep Physical Relaxation</p>
        </div>

        <div style={{ padding: '24px' }}>
          <div className="android-card" style={{ marginBottom: '24px', textAlign: 'center', padding: '32px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🧘</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-start)', marginBottom: '8px' }}>
              Progressive Relaxation
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.5, marginBottom: '24px' }}>
              A guided technique to release physical tension by tensing and relaxing specific muscle groups.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '32px' }}>
              <div style={{ background: '#F3E5F5', padding: '12px 16px', borderRadius: '16px', flex: 1 }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary-start)' }}>{steps.length}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Steps</div>
              </div>
              <div style={{ background: '#F3E5F5', padding: '12px 16px', borderRadius: '16px', flex: 1 }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--primary-start)' }}>~5m</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duration</div>
              </div>
            </div>
            <button 
              onClick={startSession}
              style={{ 
                width: '100%', height: '56px', background: 'var(--gradient)', color: 'white', 
                border: 'none', borderRadius: '28px', fontSize: '1.125rem', fontWeight: 800,
                boxShadow: 'var(--shadow-md)', cursor: 'pointer'
              }}
            >
              Start New Session
            </button>
          </div>

          {dashboardData?.last_session && (
            <div className="android-card">
              <h3 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--bg-dark)', marginBottom: '16px' }}>Last Session</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Date</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{new Date(dashboardData.last_session.started_at).toLocaleDateString()}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Steps</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{dashboardData.last_session.steps_completed}/{dashboardData.last_session.steps_total}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Time</div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{formatTime(dashboardData.last_session.total_seconds)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'completion') {
    return (
      <div style={{ background: '#FBFAFF', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{ fontSize: '5rem', marginBottom: '24px' }}>✨</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-start)', marginBottom: '16px' }}>Session Complete!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '40px', maxWidth: '300px' }}>
            You've successfully completed the full body relaxation scan. How do you feel?
          </p>
          <div style={{ background: 'white', padding: '24px', borderRadius: '24px', boxShadow: 'var(--shadow-md)', marginBottom: '40px', width: '100%' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Time</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--bg-dark)' }}>{formatTime(totalTimeSeconds)}</div>
          </div>
          <button 
            onClick={() => navigate('/history')}
            style={{ 
              width: '240px', height: '56px', background: 'var(--gradient)', color: 'white', 
              border: 'none', borderRadius: '28px', fontSize: '1.125rem', fontWeight: 800,
              boxShadow: 'var(--shadow-md)', cursor: 'pointer'
            }}
          >
            Continue
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ background: '#FBFAFF', minHeight: '100%', paddingBottom: '40px' }}>
      <div className="android-header">
        <IconButton onClick={() => setView('dashboard')} style={{ position: 'absolute', left: '12px', top: '12px', color: 'white' }}>
          <ArrowLeft size={24} />
        </IconButton>
        <h1 className="android-title">Body Connection</h1>
        <p className="android-subtitle">Progressive Muscle Relaxation</p>
        
        {/* Progress Tracker */}
        <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'white', marginBottom: '8px', opacity: 0.9 }}>
            <span>{currentStepIndex + 1} of {steps.length} completed</span>
            <span>{formatTime(totalTimeSeconds)}</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
             <motion.div 
               animate={{ width: `${progress}%` }}
               style={{ height: '100%', background: 'white', borderRadius: '4px' }} 
             />
          </div>
        </div>
      </div>

      <div style={{ padding: '32px 24px' }}>
        {/* Instruction Card: Orange Gradient */}
        <div className="android-card" style={{ 
          background: 'linear-gradient(135deg, #FF7043 0%, #F4511E 100%)',
          padding: '40px 24px',
          textAlign: 'center',
          color: 'white',
          marginBottom: '24px',
          border: 'none'
        }}>
          <div style={{ fontSize: '4.5rem', marginBottom: '16px' }}>{currentStep?.emoji}</div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 800, margin: '0 0 24px 0' }}>{currentStep?.title}</h2>
          
          <div style={{ 
            background: 'white', 
            borderRadius: '24px', 
            padding: '24px 48px',
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: 'var(--shadow-md)'
          }}>
            <p style={{ fontSize: '1.125rem', color: '#F4511E', margin: '0 0 12px 0', fontWeight: 600 }}>
              {currentStep?.instructions?.split(".")[0]}
            </p>
            <div style={{ fontSize: '5rem', fontWeight: 800, color: '#F4511E', lineHeight: 1, margin: '12px 0' }}>{timeLeftInPhase}</div>
            <div style={{ 
              background: '#F4511E',
              color: 'white',
              padding: '6px 20px',
              borderRadius: '16px',
              fontSize: '1.25rem', 
              fontWeight: 900, 
              textTransform: 'uppercase',
              boxShadow: '0 4px 12px rgba(244, 81, 30, 0.3)',
              marginTop: '12px'
            }}>
              {currentPhase}
            </div>
          </div>
        </div>

        {/* Instructions Text Card */}
        <div className="android-card" style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-start)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>INSTRUCTIONS</h4>
          <p style={{ fontSize: '1.0625rem', color: 'var(--bg-dark)', lineHeight: 1.6, margin: '0 0 20px 0', fontWeight: 500 }}>
            {currentStep?.instructions}
          </p>
          <div style={{ 
            display: 'inline-block',
            background: 'var(--surface-alt)', 
            borderRadius: '12px', 
            padding: '8px 16px',
            fontSize: '0.875rem',
            color: 'var(--primary-start)',
            fontWeight: 800
          }}>
            Position: {currentStep?.position_tip || 'Sitting or lying down'}
          </div>
        </div>

        {/* State Chips */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          {phases.map((phase, idx) => (
             <div key={idx} style={{ 
               flex: 1, height: '44px', borderRadius: '16px', 
               background: idx === currentPhaseIndex ? 'var(--gradient)' : 'white',
               color: idx === currentPhaseIndex ? 'white' : 'var(--text-muted)',
               display: 'flex', alignItems: 'center', justifyContent: 'center',
               fontSize: '0.875rem', fontWeight: 700,
               boxShadow: idx === currentPhaseIndex ? 'var(--shadow-md)' : 'var(--shadow-sm)',
               border: idx === currentPhaseIndex ? 'none' : '1px solid rgba(149, 117, 205, 0.1)',
               transition: 'all 0.3s ease'
             }}>
               {phase}
             </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '16px', height: '72px', marginBottom: '24px' }}>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ 
              flex: 1, 
              background: 'var(--gradient)',
              color: 'white',
              border: 'none',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '1.125rem',
              fontWeight: 800,
              boxShadow: 'var(--shadow-md)',
              cursor: 'pointer'
            }}
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} fill="white" />}
            {isPlaying ? "Pause" : "Resume"}
          </motion.button>

          <button 
            onClick={() => {
              if (currentStepIndex < steps.length - 1) {
                const nextStep = steps[currentStepIndex + 1];
                setCurrentStepIndex(idx => idx + 1);
                setCurrentPhaseIndex(0);
                setTimeLeftInPhase(getPhaseDuration(nextStep, 'Tense'));
                logAction('SKIP', 0);
              } else {
                setView('completion');
              }
            }}
            style={{ 
              flex: 0.6, 
              background: 'white', 
              color: 'var(--primary-start)', 
              border: '1px solid rgba(149, 117, 205, 0.2)', 
              borderRadius: '24px',
              fontSize: '1.125rem',
              fontWeight: 700,
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer'
            }}
          >
            Skip
          </button>

          <button 
             onClick={() => {
               setCurrentStepIndex(0);
               setCurrentPhaseIndex(0);
               setTimeLeftInPhase(getPhaseDuration(steps[0], 'Tense'));
               setTotalTimeSeconds(0);
               setIsPlaying(false);
             }}
            style={{ 
              width: 72, 
              background: 'white', 
              color: 'var(--text-muted)', 
              border: '1px solid rgba(149, 117, 205, 0.1)', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={28} />
          </button>
        </div>
      </div>
    </div>
  );
};

const IconButton = ({ children, onClick, style }) => (
  <button 
    onClick={onClick}
    style={{ 
      background: 'transparent', 
      border: 'none', 
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style 
    }}
  >
    {children}
  </button>
);

export default BodyScan;
