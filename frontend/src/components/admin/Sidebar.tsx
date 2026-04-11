import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaLayerGroup,
  FaCalendarAlt,
  FaRunning,
  FaPrayingHands,
  FaImage,
  FaBullhorn,
} from 'react-icons/fa';

const NAV_ITEMS = [
  { id: 'locale', label: 'Locale info', icon: FaMapMarkerAlt },
  { id: 'officers', label: 'Officers', icon: FaUsers },
  { id: 'groups', label: 'Groupings', icon: FaLayerGroup },
  { id: 'events', label: 'Events', icon: FaCalendarAlt },
  { id: 'activities', label: 'Activities', icon: FaRunning },
  { id: 'ministries', label: '12 ministries', icon: FaPrayingHands },
  { id: 'updates', label: 'Important updates', icon: FaBullhorn },
  { id: 'mfa-poster', label: 'MFA poster', icon: FaImage },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (id: string) => void;
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <aside className="flex w-64 bg-navy-900/95 border-r border-navy-800/70 h-screen flex-col fixed left-0 top-0 z-40 backdrop-blur-md">
      <div className="p-6 border-b border-navy-800/70">
        <h2 className="text-lg font-bold text-white flex items-baseline gap-2">
          <span className="text-amber-400">MCGI</span>
          <span className="text-gray-200">Admin</span>
        </h2>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">Kiosk content and display settings</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5" aria-label="Admin sections">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                isActive
                  ? 'bg-amber-500 text-navy-900 font-bold shadow-md shadow-amber-500/10'
                  : 'text-gray-400 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              <Icon className={`text-lg shrink-0 ${isActive ? 'text-navy-900' : 'text-gray-500'}`} />
              <span className="text-sm leading-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-navy-800/70">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium text-sm border border-transparent hover:border-red-500/20"
        >
          <FaSignOutAlt />
          Log out
        </button>
      </div>
    </aside>
  );
}
