import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { DashboardPage } from '@/pages/dashboard/dashboard-page'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}