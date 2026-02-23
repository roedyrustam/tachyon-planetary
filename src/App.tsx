import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Destinations from './pages/Destinations';
import Videos from './pages/Videos';
import Schedule from './pages/Schedule';
import GoLive from './pages/GoLive';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="videos" element={<Videos />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="golive" element={<GoLive />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
