import React from 'react';

interface HomeItem {
  label: string;
  idx: number;
  icon: React.ReactNode;
  color: string;
}

export default function HomeGrid({ items, onNavigate }: { items: HomeItem[], onNavigate: (idx: number) => void }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 gap-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 font-extrabold tracking-tight">
          Welcome to MCGI Kiosk
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          Please select an option below to view more details, or let the kiosk automatically guide you through our updates.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.idx)}
            className="group relative flex flex-col items-center justify-center gap-6 p-8 rounded-3xl bg-navy-900/50 hover:bg-navy-800/80 border border-white/5 hover:border-amber-500/50 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)] touch-manipulation"
          >
            <div className={`text-5xl ${item.color} group-hover:scale-110 transition-transform duration-300`}>
              {item.icon}
            </div>
            <span className="text-xl font-bold text-gray-200 group-hover:text-amber-400 transition-colors">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
