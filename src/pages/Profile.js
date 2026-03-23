import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit2, Settings as SettingsIcon, Shield, MessageCircle, LogOut, Award, Zap, Heart, Calendar, ChevronRight, User, Loader2 } from 'lucide-react';
import api from '../api';

import { useSettings } from '../context/SettingsContext';

const Profile = () => {
  const navigate = useNavigate();
  const { settings, t } = useSettings();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/profile/summary/');
        setUserData(response.data);
        setEditForm({
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await api.put('/api/profile/summary/', editForm);
      setUserData(prev => ({
        ...prev,
        first_name: response.data.first_name,
        last_name: response.data.last_name
      }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      first_name: userData?.first_name || '',
      last_name: userData?.last_name || ''
    });
    setIsEditing(false);
  };

  const options = [
    { title: t('settings'), subtitle: t('settingsSub'), icon: <SettingsIcon size={22} />, color: 'var(--primary)', bg: 'var(--surface-alt)', path: '/settings' },
    { title: t('privacy'), subtitle: t('privacySub'), icon: <Shield size={22} />, color: '#2196F3', bg: 'rgba(33, 150, 243, 0.1)', path: '/settings' },
    { title: t('feedback'), subtitle: t('feedbackSub'), icon: <MessageCircle size={22} />, color: '#8E24AA', bg: 'rgba(142, 36, 170, 0.1)', path: '/settings' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={48} color="var(--primary-start)" />
      </div>
    );
  }

  const displayName = userData
    ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.username
    : 'User';

  const firstLetter = displayName?.[0]?.toUpperCase() || 'U';

  return (
    <div className="profile-page" style={{ padding: '0' }}>
      {/* Desktop Page Title */}
      <div className="page-desktop-header">
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--bg-dark)' }}>{t('profile')}</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{t('manageAccount')}</p>
      </div>

      {/* Profile Layout */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>

        {/* Left Column — Profile Card */}
        <div style={{ flex: '1 1 280px' }}>
          <div className="card" style={{
            background: 'linear-gradient(135deg, #7B1FA2, #AB47BC)',
            color: 'white',
            borderRadius: '28px',
            padding: '2rem',
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            {/* Avatar */}
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)',
              border: '3px solid rgba(255,255,255,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{firstLetter}</span>
            </div>

            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <input
                  type="text"
                  placeholder={t('firstName') || "First Name"}
                  value={editForm.first_name}
                  onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                  style={{
                    padding: '10px 16px', borderRadius: '12px', border: 'none',
                    background: 'rgba(255,255,255,0.2)', color: 'white', outline: 'none'
                  }}
                />
                <input
                  type="text"
                  placeholder={t('lastName') || "Last Name"}
                  value={editForm.last_name}
                  onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                  style={{
                    padding: '10px 16px', borderRadius: '12px', border: 'none',
                    background: 'rgba(255,255,255,0.2)', color: 'white', outline: 'none'
                  }}
                />
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{
                      padding: '8px 20px', borderRadius: '20px', border: 'none',
                      background: 'white', color: 'var(--primary-start)', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    {isSaving ? t('saving') || 'Saving...' : t('save') || 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    style={{
                      padding: '8px 20px', borderRadius: '20px', border: '1px solid white',
                      background: 'transparent', color: 'white', fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    {t('cancel') || 'Cancel'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem' }}>{displayName}</h2>
                <p style={{ opacity: 0.8, fontSize: '0.875rem', margin: '0 0 0.5rem' }}>
                  @{userData?.username || ''}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: 'rgba(255,255,255,0.2)', color: 'white',
                      border: 'none', padding: '6px 14px', borderRadius: '14px',
                      fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    <Edit2 size={14} /> {t('editProfile') || 'Edit Profile'}
                  </button>
                </div>
              </>
            )}

            <p style={{ opacity: 0.75, fontSize: '0.875rem', margin: '0 0 1.5rem' }}>
              {userData?.email || ''}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Award size={14} color="#FFD600" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                  {t('level')} {userData?.level ?? 1}
                </span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={14} color="#FF6D00" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                  {userData?.streak_days ?? 0}d {t('streak')}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { icon: <Calendar size={22} color="#7B1FA2" />, value: userData?.days_active ?? 0, label: t('daysActive'), color: '#7B1FA2', bg: '#F3E5F5' },
              { icon: <Heart size={22} color="#F06292" />, value: `${userData?.wellness_score ?? 0}%`, label: t('wellness'), color: '#E91E63', bg: '#FCE4EC' },
            ].map((stat, i) => (
              <div key={i} className="card" style={{ flex: 1, textAlign: 'center', padding: '1.25rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>{stat.icon}</div>
                <div style={{ fontSize: '1.375rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '0.75rem', color: '#9E9E9E' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column — Options + Logout */}
        <div style={{ flex: '2 1 400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ color: 'var(--bg-dark)', fontWeight: 700, fontSize: '1.125rem' }}>{t('accountOptions')}</h3>
          {options.map((option, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2, boxShadow: '0 10px 24px rgba(103,58,183,0.12)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(option.path)}
              className="card"
              style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', cursor: 'pointer', borderRadius: '20px' }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: '16px',
                background: option.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: option.color, flexShrink: 0
              }}>
                {option.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)' }}>{option.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{option.subtitle}</div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </motion.div>
          ))}

          {/* Logout */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              navigate('/');
            }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              width: '100%', height: '56px',
              borderRadius: '20px',
              background: '#FFF3F3',
              border: '1px solid rgba(211,47,47,0.15)',
              color: '#D32F2F',
              fontSize: '1rem', fontWeight: 700,
              cursor: 'pointer',
              marginTop: '0.5rem'
            }}
          >
            <LogOut size={20} />
            {t('logout')}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
