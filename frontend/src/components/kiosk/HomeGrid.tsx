import type { ReactNode } from 'react';

export type HomeItem = { label: string; icon: ReactNode; color: string; idx: number };

export default function HomeGrid({
  items,
  onNavigate,
}: {
  items: HomeItem[];
  onNavigate: (idx: number) => void;
}) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 gap-10 md:gap-14 kiosk-hero-mesh rounded-3xl">
      <div className="text-center space-y-5 max-w-3xl mx-auto px-2">
        <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.25em] text-amber-500/80">
          MCGI Kiosk
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 font-extrabold tracking-tight leading-[1.05]">
          Welcome
        </h1>
        <p className="text-gray-400 text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
          Choose a topic below, or stay on this screen—the kiosk will guide you through updates automatically.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 w-full max-w-6xl">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onNavigate(item.idx)}
            className="group relative flex flex-col items-center justify-center gap-4 sm:gap-5 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-navy-900/55 hover:bg-navy-800/75 border border-white/[0.06] hover:border-amber-500/35 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] hover:shadow-[0_0_40px_-8px_rgba(245,158,11,0.35)] touch-manipulation min-h-[140px] sm:min-h-[160px]"
          >
            <div
              className={`text-4xl sm:text-5xl ${item.color} group-hover:scale-110 transition-transform duration-300 drop-shadow-lg`}
            >
              {item.icon}
            </div>
            <span className="text-base sm:text-lg font-bold text-gray-100 group-hover:text-amber-300 transition-colors text-center leading-snug px-1">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <p className="text-[11px] sm:text-xs text-gray-600 text-center max-w-lg leading-relaxed">
        Tap an option for details. Use the header to return home anytime.
      </p>
    </div>
  );
}
