import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/Layout.jsx';
import IAConfiguration from './pages/IAConfiguration.jsx';
import TablesConfigurations from './pages/TablesConfigurations.jsx';

function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/configuracion" replace />} />
          <Route path="/configuracion" element={<IAConfiguration />} />
          <Route path="/tablas" element={<TablesConfigurations />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;