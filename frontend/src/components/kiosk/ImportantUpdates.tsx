import type { Update } from '../../types';

export default function ImportantUpdates({ updates }: { updates: Update[] }) {
  if (updates.length === 0) return null;

  return (
    <div className="bg-amber-500 text-navy-900 border-y-2 border-amber-400 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 z-10 w-32 bg-gradient-to-r from-amber-500 to-transparent flex items-center pl-4 font-bold tracking-widest text-sm shadow-[10px_0_15px_-3px_rgba(245,158,11,1)]">
        UPDATES
      </div>
      
      <div className="overflow-hidden py-2.5">
        <div className="flex flex-nowrap w-max animate-marquee gap-12 font-medium pl-32 hover:[animation-play-state:paused]">
          {updates.map((update, i) => (
            <span key={i} className="flex items-center gap-3 flex-shrink-0 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-navy-900 flex-shrink-0" />
              <span className={update.highlight ? 'font-black bg-navy-900 text-amber-500 px-2 py-0.5 rounded shadow-sm pulse-gold' : ''}>
                {update.text}
              </span>
            </span>
          ))}
          {/* Duplicate for seamless marquee loop */}
          {updates.map((update, i) => (
            <span key={`dup-${i}`} className="flex items-center gap-3 flex-shrink-0 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-navy-900 flex-shrink-0" />
              <span className={update.highlight ? 'font-black bg-navy-900 text-amber-500 px-2 py-0.5 rounded shadow-sm pulse-gold' : ''}>
                {update.text}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
