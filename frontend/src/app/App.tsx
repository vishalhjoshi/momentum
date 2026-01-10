import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Toaster } from '@/components/ui/Toaster'
import { InteractiveMenu } from '@/components/ui/modern-mobile-menu'
import HomePage from '@/app/pages/HomePage'
import DesignSystemPage from '@/app/pages/DesignSystemPage'
import LoginPage from '@/features/auth/pages/LoginPage'
import SignUpPage from '@/features/auth/pages/SignUpPage'
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage'
import JournalPage from '@/app/pages/JournalPage'
import { AnalyticsPage } from '@/app/pages/AnalyticsPage'
import SettingsPage from '@/app/pages/SettingsPage'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'

// Component to conditionally show menu on protected routes
function AppContent() {
  const location = useLocation()
  const { user } = useAuth()
  
  // Routes where menu should be shown
  const protectedRoutes = ['/', '/journal', '/analytics', '/settings']
  const shouldShowMenu = user && protectedRoutes.includes(location.pathname)

  return (
    <>
      <Routes>
        <Route path="/design" element={<DesignSystemPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/journal"
          element={
            <ProtectedRoute>
              <JournalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      {shouldShowMenu && <InteractiveMenu />}
      <Toaster />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
