import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout'
import Dashboard             from './pages/Dashboard'
import AttackIdentification  from './pages/AttackIdentification'
import ComputationalAnalysis from './pages/ComputationalAnalysis'
import DefenseStrategy       from './pages/DefenseStrategy'
import SecureArchitecture    from './pages/SecureArchitecture'
import Report                from './pages/Report'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/attacks"      element={<Layout><AttackIdentification /></Layout>} />
        <Route path="/analysis"     element={<Layout><ComputationalAnalysis /></Layout>} />
        <Route path="/defense"      element={<Layout><DefenseStrategy /></Layout>} />
        <Route path="/architecture" element={<Layout><SecureArchitecture /></Layout>} />
        <Route path="/report"       element={<Layout><Report /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}
