import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { translations } from '../translations';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    auto_speak_ai: false,
    voice_input_enabled: true,
    high_contrast: false,
    dyslexia_friendly_font: false,
    icon_only_navigation: false,
    font_size: 'M',
    app_language: 'en',
    dark_mode: false,
  });
  const [loading, setLoading] = useState(true);

  // Translation function
  const t = (key) => {
    return translations['en']?.[key] || key;
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setLoading(false);
          return;
        }
        const response = await api.get('/api/settings/');
        if (response.data) {
          setSettings(response.data);
          applySettings(response.data);
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const applySettings = (data) => {
    // Apply Dark Mode
    if (data.dark_mode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Apply High Contrast
    if (data.high_contrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    // Apply Dyslexia Font
    if (data.dyslexia_friendly_font) {
      document.body.classList.add('dyslexia-font');
    } else {
      document.body.classList.remove('dyslexia-font');
    }

    // Apply Font Size
    document.documentElement.setAttribute('data-font-size', data.font_size);
  };

  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);

    try {
      await api.put('/api/settings/', { [key]: value });
    } catch (err) {
      console.error(`Error updating settings ${key}:`, err);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, loading, t }}>
      {children}
    </SettingsContext.Provider>
  );
};
