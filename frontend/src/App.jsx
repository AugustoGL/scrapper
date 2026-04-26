import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/Layout.jsx';
import IAConfiguration from './pages/IAConfiguration.jsx';
import TablesConfigurations from './pages/TablesConfigurations.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function DashboardWrapper() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/configuracion" replace />} />
        <Route path="/configuracion" element={<IAConfiguration />} />
        <Route path="/tablas" element={<TablesConfigurations />} />
      </Routes>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*"        element={<DashboardWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}
