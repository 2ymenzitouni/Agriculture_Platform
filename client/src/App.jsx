import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components';
import WeatherDashboard from './pages/Weather_Dashboard';
import UserRegisterLogin from './pages/User_Register_Login';
import KnowledgeBase from './pages/Knowledge_Base';
import AITelemetry from './pages/AI_Telemetry';
import PlantManagement from './pages/Plant_Management';
import ImageUpload from './pages/Image_Upload';
import IoTSimulator from './pages/IoT_Simulator';

function RequireAuth({ children }) {
  return localStorage.getItem('access_token')
    ? children
    : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<RequireAuth><WeatherDashboard /></RequireAuth>} />
          <Route
            path="/auth"
            element={
              localStorage.getItem('access_token')
                ? <Navigate to="/" replace />
                : <UserRegisterLogin />
            }
          />
          <Route path="/knowledge-base" element={<RequireAuth><KnowledgeBase /></RequireAuth>} />
          <Route path="/ai-chat" element={<RequireAuth><AITelemetry /></RequireAuth>} />
          <Route path="/plants" element={<RequireAuth><PlantManagement /></RequireAuth>} />
          <Route path="/image-analysis" element={<RequireAuth><ImageUpload /></RequireAuth>} />
          <Route path="/iot-simulator" element={<RequireAuth><IoTSimulator /></RequireAuth>} />
        </Routes>
      </Layout>
    </Router>
  );
}
