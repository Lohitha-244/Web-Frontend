import React, { useState } from 'react';
import { Accessibility, Volume2, Mic, Eye, Type, LayoutGrid, Moon, Loader2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Settings = () => {
  const { settings, updateSetting, loading, t } = useSettings();


  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={48} color="var(--primary-start)" className="animate-spin" />
      </div>
    );
  }

  const ToggleItem = ({ icon: Icon, title, subtitle, checked, onChange }) => (
    <div style={{
      background: 'var(--dynamic-white)',
      padding: '1rem 1.25rem',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-sm)',
      marginBottom: '0.75rem',
      border: '1px solid rgba(209,196,233,0.2)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '12px',
          background: 'var(--surface-alt)', color: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={18} />
        </div>
        <div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-dark)' }}>{title}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtitle}</div>
        </div>
      </div>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="slider round"></span>
      </label>
    </div>
  );

  const SectionHeader = ({ icon: Icon, title }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', marginBottom: '1rem', marginTop: '0.5rem' }}>
      <Icon size={20} />
      <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{title}</h2>
    </div>
  );

  return (
    <div className="settings-page">
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--bg-dark)' }}>{t('settings')}</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{t('customizeExperience')}</p>
      </div>

      {/* Two-column grid on desktop */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', alignItems: 'start' }}>

        {/* Left Column */}
        <div>
          {/* Accessibility */}
          <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'var(--dynamic-white)' }}>
            <SectionHeader icon={Accessibility} title={t('accessibility')} />
            <ToggleItem icon={Volume2} title={t('autoSpeak')} subtitle={t('autoSpeakSub')} checked={settings.auto_speak_ai} onChange={(v) => updateSetting("auto_speak_ai", v)} />
            <ToggleItem icon={Mic} title={t('voiceInput')} subtitle={t('voiceInputSub')} checked={settings.voice_input_enabled} onChange={(v) => updateSetting("voice_input_enabled", v)} />
            <ToggleItem icon={Eye} title={t('highContrast')} subtitle={t('highContrastSub')} checked={settings.high_contrast} onChange={(v) => updateSetting("high_contrast", v)} />
            <ToggleItem icon={Type} title={t('dyslexiaFont')} subtitle={t('dyslexiaFontSub')} checked={settings.dyslexia_friendly_font} onChange={(v) => updateSetting("dyslexia_friendly_font", v)} />
            <ToggleItem icon={LayoutGrid} title={t('iconOnly')} subtitle={t('iconOnlySub')} checked={settings.icon_only_navigation} onChange={(v) => updateSetting("icon_only_navigation", v)} />

            {/* Font Size */}
            <div style={{ background: 'var(--surface-alt)', padding: '1rem', borderRadius: '14px', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '1rem' }}>
                <Type size={16} />
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t('fontSize')}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSetting("font_size", size)}
                    style={{
                      flex: 1, height: '44px', borderRadius: '12px',
                      background: settings.font_size === size ? 'var(--gradient)' : 'var(--dynamic-white)',
                      color: settings.font_size === size ? 'white' : 'var(--primary)',
                      border: 'none', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: settings.font_size === size ? 'var(--shadow-md)' : 'none'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Appearance */}
          <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem', background: 'var(--dynamic-white)' }}>
            <SectionHeader icon={Moon} title={t('appearance')} />
            <ToggleItem icon={Moon} title={t('darkMode')} subtitle={t('darkModeSub')} checked={settings.dark_mode} onChange={(v) => updateSetting("dark_mode", v)} />
          </div>



          {/* Notice */}
          <div style={{
            background: 'var(--surface-alt)',
            padding: '1.25rem',
            borderRadius: '16px',
            fontSize: '0.8rem',
            color: 'var(--primary)',
            lineHeight: 1.6,
            fontWeight: 500,
            border: '1px solid rgba(103,58,183,0.1)'
          }}>
            <strong>Accessibility First:</strong> {t('accessibilityNotice')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;


