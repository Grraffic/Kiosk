import { useState, useEffect, useRef, useMemo } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import KioskHeader, { NAV_ITEMS } from '../../components/kiosk/KioskHeader';
import HomeGrid from '../../components/kiosk/HomeGrid';
import LocaleInfo from '../../components/kiosk/LocaleInfo';
import LocaleOfficers from '../../components/kiosk/LocaleOfficers';
import Groupings from '../../components/kiosk/Groupings';
import Events from '../../components/kiosk/Events';
import Activities from '../../components/kiosk/Activities';
import Ministries from '../../components/kiosk/Ministries';
import MFAPoster from '../../components/kiosk/MFAPoster';
import ImportantUpdates from '../../components/kiosk/ImportantUpdates';
import { getKioskData } from '../../services/api';
import type { KioskData } from '../../types';

function SkeletonLoader() {
  return (
    <div className="bg-navy-950 h-screen w-screen overflow-hidden flex flex-col relative">
      <header className="fixed top-0 w-full z-50 bg-navy-900/90 backdrop-blur-md border-b border-white/5 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-navy-800 animate-pulse"></div>
          <div className="w-32 h-6 bg-navy-800 rounded animate-pulse"></div>
        </div>
      </header>
      <div className="relative z-10 w-full pt-16 flex-shrink-0">
        <div className="h-10 bg-navy-900 border-b border-amber-500/20 w-full animate-pulse" />
      </div>
      <main className="flex-1 w-full relative flex items-center justify-center p-8">
        <div className="w-full max-w-4xl bg-navy-900/50 rounded-2xl p-8 border border-white/5 shadow-2xl flex flex-col gap-6">
          <div className="w-1/3 h-10 bg-navy-800 rounded animate-pulse mx-auto mb-4" />
          <div className="flex gap-6">
            <div className="flex-1 space-y-4">
               <div className="w-full h-12 bg-navy-800 rounded animate-pulse" />
               <div className="w-full h-12 bg-navy-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function KioskPage() {
  const [data, setData] = useState<KioskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const inactivityTimerRef = useRef<number | null>(null);

  const fetchContent = async () => {
    try {
      const res = await getKioskData();
      setData(res);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load kiosk data', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Initial HTTP Fetch
    fetchContent();

    // 2. Setup Socket.io connection using API base URL
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socket = io(socketUrl);

    socket.on('connect', () => console.log('Connected to WebSocket server for auto-updates'));
    
    socket.on('kiosk_data_updated', (updatedData: KioskData) => {
      console.log('Received real-time update from Admin Dashboard!', updatedData);
      setData(updatedData); // Instant reflection
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (activeIndex !== 0) {
      inactivityTimerRef.current = window.setTimeout(() => {
        setActiveIndex(0);
      }, 30000); // 30 seconds inactivity
    }
  };

  useEffect(() => {
    resetInactivityTimer();
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [activeIndex]);

  const slides = useMemo(() => {
    if (!data) return [];
    
    const gridItems = NAV_ITEMS.slice(1).map((nav, i) => ({
      ...nav,
      idx: i + 1
    }));

    return [
      { id: 'home', component: <HomeGrid items={gridItems} onNavigate={setActiveIndex} /> },
      { id: 'locale-info', component: <LocaleInfo data={data.localeInfo} /> },
      { id: 'officers', component: <LocaleOfficers officers={data.officers} /> },
      { id: 'groupings', component: <Groupings groups={data.groups} /> },
      { id: 'events', component: <Events events={data.events} /> },
      { id: 'activities', component: <Activities activities={data.activities} /> },
      { id: 'ministries', component: <Ministries ministries={data.ministries} /> },
      { id: 'mfa-poster', component: <MFAPoster posterUrl={data.mfaPosterUrl} driveLink={data.mfaDriveLink} /> },
    ];
  }, [data]);

  if (loading) return <SkeletonLoader />;
  if (!data) return <div className="min-h-screen flex items-center justify-center text-red-400">Error loading kiosk. Ensure backend is running.</div>;

  const currentSlide = slides[activeIndex] || slides[0];

  return (
    <div 
      className="bg-navy-950 h-screen w-screen overflow-hidden flex flex-col relative select-none"
      onClick={resetInactivityTimer}
      onTouchStart={resetInactivityTimer}
    >
      <KioskHeader 
        localeName={data.localeInfo.locale} 
        showHome={activeIndex !== 0}
        onHome={() => setActiveIndex(0)}
      />

      <div className="relative z-10 w-full pt-16 flex-shrink-0">
        <ImportantUpdates updates={data.updates} />
      </div>

      <main className="flex-1 w-full relative overflow-y-auto overflow-x-hidden custom-slide-scroll px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto h-full flex flex-col justify-center relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, x: 20, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full h-full flex flex-col justify-center"
            >
              {currentSlide.component}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
