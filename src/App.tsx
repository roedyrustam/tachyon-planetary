import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Destinations from './pages/Destinations.tsx';
import Videos from './pages/Videos.tsx';
import Schedule from './pages/Schedule.tsx';
import GoLive from './pages/GoLive.tsx';
import Analytics from './pages/Analytics.tsx';
import Settings from './pages/Settings.tsx';
import Overlays from './pages/Overlays.tsx';

import { useAuth } from './context/AuthContext';
import Login from './pages/Login';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-[#0a0c10] flex-center text-muted">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="videos" element={<Videos />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="golive" element={<GoLive />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="overlays" element={<Overlays />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
