import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Palette, RefreshCcw, Heart, Smile, Image as ImageIcon, Brush, Highlighter, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import api from '../api';

const Creative = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#9C27B0');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState('brush'); // 'brush' or 'eraser'
  const [strokesCount, setStrokesCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const prompts = [
    "Draw a smiling sun ☀️",
    "Sketch your favorite flower 🌸",
    "Draw a cozy coffee mug ☕",
    "Doodle a happy cloud ☁️",
    "Express what you're grateful for 🌟"
  ];
  const [currentPrompt] = useState(prompts[Math.floor(Math.random() * prompts.length)]);

  useEffect(() => {
    const timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    return () => clearInterval(timer);
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    setStrokesCount(prev => prev + 1);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokesCount(0);
    setElapsedTime(0);
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (strokesCount === 0) return;
    setIsSaving(true);
    try {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png'); // Base64 encoding
      // Send to backend
      await api.post('/api/creative/entries/', {
        image: dataUrl,
        prompt_text: currentPrompt,
        strokes: strokesCount,
        duration_seconds: elapsedTime,
        brush_size: brushSize,
        color_hex: selectedColor
      });
      alert('Drawing saved successfully to your gallery!');
      navigate('/history');
    } catch(err) {
      console.error("Error saving creative drawing:", err);
      alert('Failed to save drawing. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const colors = [
    '#9C27B0', '#E91E63', '#2196F3', '#4CAF50', '#FFB300', '#F44336', '#00BCD4', '#5C6BC0'
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ background: '#FBFAFF', display: 'flex', flexDirection: 'column' }}>
      {/* Desktop Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--bg-dark)' }}>Creative Expression</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Art therapy & mindful drawing</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'white', padding: '10px 16px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(209,196,233,0.5)' }}>
            <span style={{ fontSize: '1.25rem' }}>🌟</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#AB47BC' }}>{currentPrompt}</span>
          </div>
          <button onClick={() => navigate('/progress')} style={{ width: 44, height: 44, borderRadius: '14px', background: 'linear-gradient(135deg, #EC407A, #AB47BC)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ImageIcon size={20} />
          </button>
        </div>
      </div>

      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Canvas Area */}
        <div style={{ 
          background: 'white', 
          borderRadius: '32px', 
          boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
          overflow: 'hidden',
          marginBottom: '24px',
          border: '1px solid #F3E5F5',
          flex: 1,
          position: 'relative'
        }}>
          <canvas
            ref={canvasRef}
            width={window.innerWidth - 48}
            height={400}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            style={{ cursor: 'crosshair', display: 'block' }}
          />
          {strokesCount === 0 && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#D1C4E9', textAlign: 'center', pointerEvents: 'none' }}>
              <Brush size={48} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <div style={{ fontSize: '1rem', fontWeight: 500 }}>Start drawing here...</div>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1, background: '#AB47BC', height: '64px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <div style={{ fontSize: '0.6875rem', opacity: 0.8 }}>Strokes</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{strokesCount}</div>
          </div>
          <div style={{ flex: 1, background: '#AB47BC', height: '64px', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <div style={{ fontSize: '0.6875rem', opacity: 0.8 }}>Creating</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{formatTime(elapsedTime)}</div>
          </div>
        </div>

        {/* Color Palette & Tools */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7B1FA2', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>
            <Palette size={16} />
            Colors
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            {colors.map((color, i) => (
              <button
                key={i}
                onClick={() => { setSelectedColor(color); setTool('brush'); }}
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: color, 
                  border: selectedColor === color && tool === 'brush' ? '2px solid white' : 'none',
                  boxShadow: selectedColor === color && tool === 'brush' ? '0 0 0 2px #AB47BC' : 'none',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setTool('brush')}
              style={{ 
                flex: 1, 
                height: '48px', 
                borderRadius: '16px', 
                background: tool === 'brush' ? '#AB47BC' : '#F5F5F5',
                border: 'none',
                color: tool === 'brush' ? 'white' : '#757575',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 600
              }}
            >
              <Brush size={18} /> Draw
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setTool('eraser')}
              style={{ 
                flex: 1, 
                height: '48px', 
                borderRadius: '16px', 
                background: tool === 'eraser' ? '#607D8B' : '#F5F5F5',
                border: 'none',
                color: tool === 'eraser' ? 'white' : '#757575',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 600
              }}
            >
              <Trash2 size={18} /> Erase
            </motion.button>
          </div>
        </div>

        {/* Control Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          <button 
            onClick={clearCanvas}
            style={{ 
              flex: 1, 
              height: '72px', 
              borderRadius: '20px', 
              background: '#FF5252', 
              color: 'white', 
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <RefreshCcw size={20} />
            <span style={{ fontSize: '0.75rem' }}>Clear</span>
          </button>
          <button 
            disabled={strokesCount === 0 || isSaving}
            onClick={handleSave}
            style={{ 
              flex: 1, 
              height: '72px', 
              borderRadius: '20px', 
              background: (strokesCount === 0 || isSaving) ? '#BDBDBD' : '#42A5F5', 
              color: 'white', 
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              cursor: (strokesCount === 0 || isSaving) ? 'default' : 'pointer'
            }}
          >
            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Heart size={20} />}
            <span style={{ fontSize: '0.75rem' }}>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
          <button 
            onClick={() => navigate(-1)}
            style={{ 
              flex: 1, 
              height: '72px', 
              borderRadius: '20px', 
              background: '#AB47BC', 
              color: 'white', 
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <CheckCircle size={20} />
            <span style={{ fontSize: '0.75rem' }}>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Creative;
