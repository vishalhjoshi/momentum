import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  // Check if token exists even if user object isn't set yet
  const token = localStorage.getItem('token')
  if (!token && !user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

