import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components';
import WeatherDashboard from './pages/Weather_Dashboard';
import UserRegisterLogin from './pages/User_Register_Login';
import KnowledgeBase from './pages/Knowledge_Base';
import AITelemetry from './pages/AI_Telemetry';
import PlantManagement from './pages/Plant_Management';
import ImageUpload from './pages/Image_Upload';
import IoTSimulator from './pages/IoT_Simulator';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<WeatherDashboard />} />
          <Route path="/auth" element={<UserRegisterLogin />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/ai-chat" element={<AITelemetry />} />
          <Route path="/plants" element={<PlantManagement />} />
          <Route path="/image-analysis" element={<ImageUpload />} />
          <Route path="/iot-simulator" element={<IoTSimulator />} />
        </Routes>
      </Layout>
    </Router>
  );
}
