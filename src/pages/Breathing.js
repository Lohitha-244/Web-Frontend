import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pause, Play } from 'lucide-react';

const Breathing = () => {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState('Ready?');
  const [seconds, setSeconds] = useState(4);

  const startBreathing = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stopBreathing = useCallback(() => {
    setIsRunning(false);
    setPhase('Ready?');
    setSeconds(4);
  }, []);

  useEffect(() => {
    let timer;
    if (isRunning) {
      const runCycle = async () => {
        // Breathe In
        setPhase('Breathe In');
        for (let i = 4; i > 0; i--) {
          setSeconds(i);
          await new Promise(r => timer = setTimeout(r, 1000));
        }
        // Hold
        setPhase('Hold');
        for (let i = 4; i > 0; i--) {
          setSeconds(i);
          await new Promise(r => timer = setTimeout(r, 1000));
        }
        // Breathe Out
        setPhase('Breathe Out');
        for (let i = 4; i > 0; i--) {
          setSeconds(i);
          await new Promise(r => timer = setTimeout(r, 1000));
        }
        // Hold
        setPhase('Hold');
        for (let i = 4; i > 0; i--) {
          setSeconds(i);
          await new Promise(r => timer = setTimeout(r, 1000));
        }
        if (isRunning) runCycle();
      };
      runCycle();
    }
    return () => clearTimeout(timer);
  }, [isRunning]);

  return (
    <div style={{ background: '#FBFAFF', minHeight: '100%', paddingBottom: '40px' }}>
      <div className="android-header">
        <h1 className="android-title">Breathing Exercise</h1>
        <p className="android-subtitle">Calm your nervous system • 4-4-4-4 Box Breathing</p>
      </div>

      <div style={{ padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          animate={{
            scale: phase === 'Breathe In' ? 1.4 : phase === 'Breathe Out' ? 0.8 : 1.1,
          }}
          transition={{ duration: 4, ease: "linear" }}
          style={{
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'var(--surface-alt)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            border: '8px solid rgba(149, 117, 205, 0.1)',
            marginTop: '32px'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={seconds}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--primary-start)' }}
            >
              {seconds}
            </motion.div>
          </AnimatePresence>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-start)', opacity: 0.7, marginTop: '-10px' }}>seconds</span>
        </motion.div>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--bg-dark)', marginBottom: '0.5rem' }}>{phase}</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', fontWeight: 500 }}>Follow the rhythm</p>
        </div>

        <div style={{ marginTop: '3rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
          {!isRunning ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={startBreathing}
              style={{
                width: '180px',
                height: '64px',
                borderRadius: '32px',
                background: 'var(--gradient)',
                color: 'white',
                fontSize: '1.25rem',
                fontWeight: 800,
                border: 'none',
                boxShadow: 'var(--shadow-md)',
                cursor: 'pointer'
              }}
            >
              Ready
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={stopBreathing}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'var(--surface-alt)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-start)',
                border: 'none',
                boxShadow: 'var(--shadow-md)',
                cursor: 'pointer'
              }}
            >
              <Pause size={40} />
            </motion.button>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(-1)}
          style={{
            width: '100%',
            maxWidth: '320px',
            height: '64px',
            borderRadius: '32px',
            background: 'white',
            color: 'var(--primary-start)',
            fontSize: '1.125rem',
            fontWeight: 800,
            border: '1px solid rgba(149, 117, 205, 0.2)',
            boxShadow: 'var(--shadow-sm)',
            marginTop: '48px',
            cursor: 'pointer'
          }}
        >
          Complete Session
        </motion.button>
      </div>
    </div>
  );
};

export default Breathing;
