import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import KioskPage from './pages/kiosk/KioskPage';
import AdminLogin from './pages/admin/AdminLogin';
import ProtectedRoute from './components/admin/ProtectedRoute';
import './index.css';

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

function DashboardFallback() {
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center gap-4 text-amber-400">
      <div
        className="h-10 w-10 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin"
        aria-hidden
      />
      <p className="text-sm text-gray-400">Loading dashboard…</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<KioskPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Suspense fallback={<DashboardFallback />}>
                  <AdminDashboard />
                </Suspense>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
