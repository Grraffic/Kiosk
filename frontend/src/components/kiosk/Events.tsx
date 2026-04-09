import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import type { EventItem } from '../../types';
import { useCountdown } from '../../hooks/useCountdown';

export default function Events({ events }: { events: EventItem[] }) {
  const today = new Date().toISOString().split('T')[0];

  const upcoming = events.filter((e) => (e.endDate || e.date) >= today);
  const past = events.filter((e) => (e.endDate || e.date) < today);

  return (
    <section id="events" className="px-4 sm:px-6 fade-in">
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <h2 className="section-title">
          <FaCalendarAlt className="text-amber-400" />
          Events
        </h2>

        <div className="space-y-6">
          {upcoming.map((evt) => (
            <EventCard key={evt.id} event={evt} isPast={false} />
          ))}
          {past.length > 0 && (
            <div className="border-t border-white/10 pt-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Past Events</p>
              {past.map((evt) => (
                <EventCard key={evt.id} event={evt} isPast={true} />
              ))}
            </div>
          )}
          {events.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-8">No events added yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function EventCard({ event, isPast }: { event: EventItem; isPast: boolean }) {
  const countdown = useCountdown(event.date);

  const formatDateRange = (start: string, end?: string) => {
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    try {
      const d1 = new Date(start).toLocaleDateString('en-US', opts);
      if (!end) return d1;
      const d2 = new Date(end).toLocaleDateString('en-US', opts);
      return `${d1} - ${d2}`;
    } catch {
      return start;
    }
  };

  return (
    <div
      className={`rounded-xl p-6 border transition-all duration-300 ${
        isPast
          ? 'opacity-60 glass-card border-white/5 grayscale-[50%]'
          : 'glass-card-gold border-amber-500/20 shadow-lg shadow-amber-900/10'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Core Info */}
        <div className="flex-1 space-y-4">
           {/* Header Tag */}
           <div className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg tracking-widest uppercase ${
              isPast ? 'bg-white/10 text-gray-300' : 'bg-amber-500/20 text-amber-400'
           }`}>
             <FaCalendarAlt />
             {event.label || 'Untitled Event'}
           </div>
           
           {/* Date Range Tracker */}
           <div className="text-gray-200 font-bold text-lg flex items-center gap-3">
              <FaClock className={isPast ? 'text-gray-500' : 'text-amber-500'} />
              {formatDateRange(event.date, event.endDate)}
           </div>

           {/* Block Description Blob */}
           {event.description && (
             <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap bg-black/20 p-4 rounded-lg border border-white/5">
               {event.description}
             </p>
           )}
        </div>

        {/* Dynamic Countdown */}
        {event.showCountdown && !isPast && !countdown.isExpired && (
          <CountdownDisplay countdown={countdown} />
        )}
      </div>
    </div>
  );
}

function CountdownDisplay({ countdown }: { countdown: ReturnType<typeof useCountdown> }) {
  const units = [
    { label: 'Days',    value: countdown.days },
    { label: 'Hours',   value: countdown.hours },
    { label: 'Mins',    value: countdown.minutes },
    { label: 'Secs',    value: countdown.seconds },
  ];

  return (
    <div className="flex-shrink-0">
      <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center mb-2">Countdown</p>
      <div className="flex gap-2">
        {units.map((u) => (
          <div key={u.label} className="countdown-box">
            <span className="text-2xl font-black text-amber-400 tabular-nums animate-countdown">
              {String(u.value).padStart(2, '0')}
            </span>
            <span className="text-[9px] text-gray-500 uppercase tracking-wider mt-0.5">{u.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
