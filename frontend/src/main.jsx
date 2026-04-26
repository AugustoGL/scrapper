import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ConfigProvider } from "antd";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
  theme={{
    token: {
      borderRadiusLG: 12,
      colorPrimary: "orange",
    },
  }}
>
    <App />
    </ConfigProvider>
  </StrictMode>,
)
