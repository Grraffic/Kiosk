import { useState, useEffect } from 'react';
import { FaHome, FaInfoCircle, FaUserTie, FaUsers, FaCalendarAlt, FaRunning, FaPrayingHands, FaQrcode } from 'react-icons/fa';

export const NAV_ITEMS = [
  { label: 'Home',         icon: <FaHome className="inline-block mr-1.5" />, color: 'text-gray-300' },
  { label: 'Locale Info',  icon: <FaInfoCircle className="inline-block mr-1.5" />, color: 'text-blue-400' },
  { label: 'Officers',     icon: <FaUserTie className="inline-block mr-1.5" />, color: 'text-amber-400' },
  { label: 'Groupings',    icon: <FaUsers className="inline-block mr-1.5" />, color: 'text-emerald-400' },
  { label: 'Events',       icon: <FaCalendarAlt className="inline-block mr-1.5" />, color: 'text-rose-400' },
  { label: 'Activities',   icon: <FaRunning className="inline-block mr-1.5" />, color: 'text-cyan-400' },
  { label: 'Ministries',   icon: <FaPrayingHands className="inline-block mr-1.5" />, color: 'text-purple-400' },
  { label: 'MFA Poster',   icon: <FaQrcode className="inline-block mr-1.5" />, color: 'text-pink-400' },
];

export default function KioskHeader({ 
  localeName,
  onHome,
  showHome
}: { 
  localeName?: string;
  onHome?: () => void;
  showHome?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-navy-900/95 backdrop-blur-md shadow-lg shadow-black/40' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between pointer-events-auto">
        <div 
          className={`flex items-center gap-3 ${onHome ? 'cursor-pointer select-none hover:opacity-80 transition-opacity' : ''}`}
          onClick={onHome}
        >

          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-none">MCGI</p>
            <h1 className="text-white font-bold text-sm leading-tight">
              {localeName || 'Payatas B'}
            </h1>
          </div>
        </div>

        {showHome && onHome && (
          <button 
            onClick={onHome}
            className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-amber-400 border border-amber-500/30 px-4 py-2 rounded-xl transition-all shadow hover:shadow-amber-500/20"
          >
            <FaHome />
            <span className="font-bold text-sm hidden sm:inline">Back to Home</span>
          </button>
        )}
      </div>
    </header>
  );
}
