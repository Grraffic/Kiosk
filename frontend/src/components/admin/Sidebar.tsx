import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaSignOutAlt, FaMapMarkerAlt, FaUsers, FaLayerGroup, FaCalendarAlt, FaRunning, FaPrayingHands, FaImage, FaBullhorn } from 'react-icons/fa';

const NAV_ITEMS = [
  { id: 'locale', label: 'Locale Info', icon: FaMapMarkerAlt },
  { id: 'officers', label: 'Officers', icon: FaUsers },
  { id: 'groups', label: 'Groupings', icon: FaLayerGroup },
  { id: 'events', label: 'Events', icon: FaCalendarAlt },
  { id: 'activities', label: 'Activities', icon: FaRunning },
  { id: 'ministries', label: '12 Ministries', icon: FaPrayingHands },
  { id: 'updates', label: 'Important Updates', icon: FaBullhorn },
  { id: 'poster', label: 'MFA Poster', icon: FaImage },
];

export default function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (id: string) => void }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="w-64 bg-navy-900 border-r border-white/10 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-amber-500">MCGI</span> Admin
        </h2>
        <p className="text-xs text-gray-400 mt-1">Kiosk Management System</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-amber-500 text-navy-900 font-bold shadow-[0_4px_12px_rgba(245,158,11,0.2)]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={isActive ? 'text-navy-900' : 'text-gray-500'} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium text-sm"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
}
