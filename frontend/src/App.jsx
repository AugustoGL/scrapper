import { useState } from 'react'
import DashboardLayout from './components/layout.jsx/Layout.jsx'
import IAConfiguration from './pages/IAConfiguration.jsx'

function App() {

  return (
    <DashboardLayout>
      <IAConfiguration />
    </DashboardLayout>
  )
}
export default App