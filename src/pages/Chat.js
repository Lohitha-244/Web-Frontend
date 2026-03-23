import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Mic, Menu, MessageSquare, Plus, Volume2, Loader2 } from 'lucide-react';
import api from '../api';

import { useSettings } from '../context/SettingsContext';

const Chat = () => {
  const navigate = useNavigate();
  const { settings, t } = useSettings();
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef(null);

  const [messages, setMessages] = useState([
    { text: t('chatGreeting'), isUser: false, time: "10:00" }
  ]);

  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const autoSpeak = settings?.auto_speak_ai || false;
  const voiceEnabled = settings?.voice_input_enabled || true;

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (currentSessionId === null) {
      setMessages([{ text: t('chatGreeting'), isUser: false, time: "Now" }]);
      return;
    }
    const fetchHistory = async () => {
      try {
        const response = await api.get(`/api/chat/history/?session_id=${currentSessionId}`);
        if (response.data && response.data.messages) {
          const loadedMessages = response.data.messages.map(msg => ({
            text: msg.content,
            isUser: msg.role === 'user',
            time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setMessages(loadedMessages.length ? loadedMessages : [{ text: t('chatGreeting'), isUser: false, time: "Now" }]);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    fetchHistory();
  }, [currentSessionId]);

  const fetchSessions = async () => {
    try {
      const response = await api.get('/api/chat/sessions/');
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
    }
  };

  const handleSend = async () => {
    if (!messageText.trim()) return;
    
    const userMsg = { text: messageText, isUser: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setMessageText('');
    setIsTyping(true);

    try {
      const response = await api.post('/api/chat/send/', { 
        message: messageText,
        session_id: currentSessionId 
      });

      setIsTyping(false);
      const aiReplyText = response.data.reply;
      const aiReply = { 
        text: aiReplyText, 
        isUser: false, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages(prev => [...prev, aiReply]);
      
      if (autoSpeak && window.speechSynthesis) {
        window.speechSynthesis.cancel(); // Stop any current speech
        const utterance = new SpeechSynthesisUtterance(aiReplyText);
        window.speechSynthesis.speak(utterance);
      }

      if (response.data.session_id && !currentSessionId) {
        setCurrentSessionId(response.data.session_id);
        fetchSessions();
      }
    } catch (error) {
      console.error('Error sending chat message:', error);
      setIsTyping(false);
      const errorReply = { text: t('chatError'), isUser: false, time: "System" };
      setMessages(prev => [...prev, errorReply]);
    }
  };

  const ChatBubble = ({ msg }) => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: msg.isUser ? 'flex-end' : 'flex-start',
      marginBottom: '16px',
      width: '100%'
    }}>
      <div style={{ 
        maxWidth: '85%', 
        background: msg.isUser ? 'var(--gradient)' : 'white',
        color: msg.isUser ? 'white' : 'var(--bg-dark)',
        padding: '16px',
        borderRadius: '24px',
        borderTopRightRadius: msg.isUser ? '4px' : '24px',
        borderTopLeftRadius: msg.isUser ? '24px' : '4px',
        boxShadow: 'var(--shadow-sm)',
        fontSize: '1rem',
        lineHeight: 1.5,
        border: msg.isUser ? 'none' : '1px solid rgba(149, 117, 205, 0.1)'
      }}>
        {msg.text}
      </div>
      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '4px', padding: '0 8px' }}>
        {msg.time}
      </div>
    </div>
  );

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', 
      height: '100%', 
      background: '#FBFAFF', 
      position: 'relative', 
      overflow: 'hidden'
    }}>
      
      {/* Sidebar Drawer */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 100 }}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                bottom: 0, 
                width: '280px', 
                background: 'white', 
                zIndex: 101,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '4px 0 12px rgba(0,0,0,0.1)'
              }}
            >
              <div className="android-header" style={{ padding: '24px', borderRadius: 0, marginBottom: 0 }}>
                <h3 className="android-title" style={{ fontSize: '1.25rem' }}>{t('chatHistory')}</h3>
              </div>
              <div style={{ padding: '16px' }}>
                <button onClick={() => { setMessages([{ text: t('newSessionStarted'), isUser: false, time: "Now" }]); setCurrentSessionId(null); setShowHistory(false); }} style={{ width: '100%', height: '48px', background: 'var(--gradient)', color: 'white', border: 'none', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600, marginBottom: '16px', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}>
                  <Plus size={20} /> {t('newChat')}
                </button>
                {sessions.map((session) => (
                  <div key={session.id} style={{ padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: currentSessionId === session.id ? '#F3E5F5' : 'transparent' }} onClick={() => { setCurrentSessionId(session.id); setShowHistory(false); }}>
                    <MessageSquare size={18} color="#757575" />
                    <div style={{ fontSize: '0.9375rem', color: '#4A148C', fontWeight: 500, flex: 1 }}>{session.title || t('conversation')}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="android-header" style={{ paddingBottom: '20px', marginBottom: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="android-title" style={{ fontSize: '1.25rem' }}>{t('chatTitle')}</h1>
            <p className="android-subtitle" style={{ fontSize: '0.875rem' }}>{t('chatSubtitle')}</p>
          </div>
          <button 
            onClick={() => setShowHistory(true)}
            style={{ padding: '8px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, cursor: 'pointer' }}
          >
            <Menu size={18} /> {t('history')}
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        style={{ 
          flex: 1, 
          padding: '12px', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column' 
        }}
      >
        {messages.map((msg, i) => <ChatBubble key={i} msg={msg} />)}
        {isTyping && (
          <div style={{ fontSize: '0.8125rem', color: '#757575', marginLeft: '12px' }}>
            {t('thinking')}
          </div>
        )}
      </div>

      {/* Quick Reply Chips */}
      <div style={{ display: 'flex', gap: '12px', padding: '4px 20px', overflowX: 'auto', background: 'white', borderTop: '1px solid #F3E5F5' }}>
        {["😊 Happy", "😢 Sad", "😰 Anxious", "😌 Calm"].map((label, i) => (
          <button
            key={i}
            onClick={() => setMessageText(label)}
            style={{ 
              whiteSpace: 'nowrap', 
              padding: '8px 16px', 
              borderRadius: '20px', 
              background: 'white', 
              border: '1px solid #E0E0E0', 
              fontSize: '0.875rem', 
              color: '#4A148C',
              fontWeight: 600,
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: '12px', background: '#FBFAFF' }}>
        <div style={{ 
          background: '#F3E5F5', 
          borderRadius: '32px', 
          padding: '8px', 
          display: 'flex', 
          alignItems: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          {voiceEnabled && (
            <button 
              onClick={() => {
                if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
                  alert("Speech recognition is not supported in this browser.");
                  return;
                }
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                recognition.lang = 'en-US';
                recognition.interimResults = false;
                recognition.maxAlternatives = 1;
                recognition.start();
                recognition.onresult = (event) => {
                  const transcript = event.results[0][0].transcript;
                  setMessageText(prev => prev ? prev + ' ' + transcript : transcript);
                };
              }}
              style={{ 
                width: 44, height: 44, 
                borderRadius: '50%', 
                background: 'var(--gradient)', 
                color: 'white', border: 'none', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                marginRight: '8px'
              }}
            >
              <Mic size={20} />
            </button>
          )}
          <input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chatPlaceholder')}
            style={{ 
              flex: 1, 
              background: 'transparent', 
              border: 'none', 
              padding: '0 16px', 
              fontSize: '1rem', 
              outline: 'none',
              color: '#424242'
            }}
          />
          <button 
            onClick={handleSend}
            disabled={!messageText.trim() || isTyping}
            style={{ 
              width: 44, 
              height: 44, 
              borderRadius: '50%', 
              background: (messageText.trim() && !isTyping) ? 'var(--gradient)' : '#E0E0E0', 
              color: 'white', 
              border: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: (messageText.trim() && !isTyping) ? 'var(--shadow-sm)' : 'none',
              cursor: (messageText.trim() && !isTyping) ? 'pointer' : 'default'
            }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
