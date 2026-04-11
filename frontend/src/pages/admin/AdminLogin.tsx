import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaLock, FaUser } from 'react-icons/fa';
import axios from 'axios';

function isTimeout(err: unknown): boolean {
  return axios.isAxiosError(err) && err.code === 'ECONNABORTED';
}

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/admin/dashboard');
    } catch (err) {
      if (isTimeout(err)) {
        setError('Request timed out. Check that the API is running and VITE_API_URL is correct.');
      } else {
        setError('Invalid username or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col lg:flex-row">
      <div className="relative lg:w-[42%] min-h-[220px] lg:min-h-screen flex flex-col justify-center px-8 py-12 lg:py-16 border-b lg:border-b-0 lg:border-r border-navy-800/60 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-navy-900/40 to-navy-950 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(100%,480px)] aspect-square bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-md mx-auto lg:mx-0 lg:ml-auto lg:mr-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-navy-900 shadow-lg shadow-amber-500/30 mb-6">
            <FaLock className="text-2xl" aria-hidden />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">System admin</h1>
          <p className="text-amber-400/90 font-medium mt-2">MCGI Kiosk management</p>
          <p className="text-gray-500 text-sm mt-6 leading-relaxed">
            Sign in to edit locale information, events, groupings, and everything shown on the public kiosk.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10 lg:py-16">
        <div className="w-full max-w-md">
          <div className="glass-card rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/40">
            <h2 className="text-lg font-semibold text-white mb-1">Sign in</h2>
            <p className="text-sm text-gray-500 mb-8">Use your administrator credentials</p>

            {error && (
              <div
                role="alert"
                className="bg-red-500/10 border border-red-500/35 text-red-200 px-4 py-3 rounded-xl text-sm mb-6"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="admin-user" className="admin-label">
                  Username
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-transparent bg-navy-950 px-3 py-2.5 text-sm transition-colors focus-within:border-amber-500/60 focus-within:ring-2 focus-within:ring-amber-500/20">
                  <FaUser className="h-4 w-4 shrink-0 text-gray-500" aria-hidden />
                  <input
                    id="admin-user"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="min-w-0 flex-1 appearance-none border-0 bg-transparent text-white shadow-none ring-0 outline-none placeholder:text-gray-500 focus:border-0 focus:ring-0 focus:outline-none"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-pass" className="admin-label">
                  Password
                </label>
                <div className="flex items-center gap-3 rounded-xl border border-transparent bg-navy-950 px-3 py-2.5 text-sm transition-colors focus-within:border-amber-500/60 focus-within:ring-2 focus-within:ring-amber-500/20">
                  <FaLock className="h-4 w-4 shrink-0 text-gray-500" aria-hidden />
                  <input
                    id="admin-pass"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="min-w-0 flex-1 appearance-none border-0 bg-transparent text-white shadow-none ring-0 outline-none placeholder:text-gray-500 focus:border-0 focus:ring-0 focus:outline-none"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-navy-900 font-bold py-3.5 rounded-xl transition-all duration-200 mt-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950"
              >
                {loading ? 'Signing in…' : 'Access dashboard'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
