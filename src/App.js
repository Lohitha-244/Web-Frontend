import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import OTP from './pages/OTP';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Care from './pages/Care';
import Mood from './pages/Mood';
import CheckIn from './pages/CheckIn';
import CheckInComplete from './pages/CheckInComplete';
import Progress from './pages/Progress';
import History from './pages/History';
import WeeklyReport from './pages/WeeklyReport';
import MonthlyReport from './pages/MonthlyReport';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Meditation from './pages/Meditation';
import MeditationPlayer from './pages/MeditationPlayer';
import Breathing from './pages/Breathing';
import Journal from './pages/Journal';
import MusicTherapy from './pages/MusicTherapy';
import Insights from './pages/Insights';
import Affirmations from './pages/Affirmations';
import Gratitude from './pages/Gratitude';
import Creative from './pages/Creative';
import BodyScan from './pages/BodyScan';
import Soundscape from './pages/Soundscape';
import MoodAnalytics from './pages/MoodAnalytics';
import { SettingsProvider } from './context/SettingsContext';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppContent = () => {
  const location = useLocation();
  
  // Pages that should NOT have the sidebar
  const fullScreenPages = [
    '/', '/login', '/signup', '/forgot-password', '/otp', '/reset-password'
  ];
  const isFullScreen = fullScreenPages.includes(location.pathname);

  const routes = (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/otp" element={<OTP />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Authenticated Routes wrapped in ProtectedRoute */}
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/care" element={<ProtectedRoute><Care /></ProtectedRoute>} />
      <Route path="/mood" element={<ProtectedRoute><Mood /></ProtectedRoute>} />
      <Route path="/check-in" element={<ProtectedRoute><CheckIn /></ProtectedRoute>} />
      <Route path="/checkin-complete" element={<ProtectedRoute><CheckInComplete /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
      <Route path="/mood-analytics" element={<ProtectedRoute><MoodAnalytics /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/weekly-report" element={<ProtectedRoute><WeeklyReport /></ProtectedRoute>} />
      <Route path="/monthly-report" element={<ProtectedRoute><MonthlyReport /></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      
      {/* Feature Screens */}
      <Route path="/meditation" element={<ProtectedRoute><Meditation /></ProtectedRoute>} />
      <Route path="/meditation-player" element={<ProtectedRoute><MeditationPlayer /></ProtectedRoute>} />
      <Route path="/breathing" element={<ProtectedRoute><Breathing /></ProtectedRoute>} />
      <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
      <Route path="/music-therapy" element={<ProtectedRoute><MusicTherapy /></ProtectedRoute>} />
      <Route path="/affirmations" element={<ProtectedRoute><Affirmations /></ProtectedRoute>} />
      <Route path="/gratitude" element={<ProtectedRoute><Gratitude /></ProtectedRoute>} />
      <Route path="/creative" element={<ProtectedRoute><Creative /></ProtectedRoute>} />
      <Route path="/body-scan" element={<ProtectedRoute><BodyScan /></ProtectedRoute>} />
      <Route path="/soundscape" element={<ProtectedRoute><Soundscape /></ProtectedRoute>} />
    </Routes>
  );

  if (isFullScreen) {
    return routes;
  }

  return <Layout>{routes}</Layout>;
};

function App() {
  return (
    <SettingsProvider>
      <Router>
        <AppContent />
      </Router>
    </SettingsProvider>
  );
}

export default App;
