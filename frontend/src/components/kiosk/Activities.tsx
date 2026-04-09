import { FaRunning, FaUtensils, FaCalendarCheck } from 'react-icons/fa';
import type { Activity } from '../../types';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Feeding Schedule': <FaUtensils className="text-amber-400" />,
  'Youth Cleaning':   <FaRunning className="text-blue-400" />,
  'Meeting Schedule': <FaCalendarCheck className="text-green-400" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  'Feeding Schedule': 'border-amber-500/30 bg-amber-500/5',
  'Youth Cleaning':   'border-blue-500/30 bg-blue-500/5',
  'Meeting Schedule': 'border-green-500/30 bg-green-500/5',
};

export default function Activities({ activities }: { activities: Activity[] }) {
  return (
    <section id="activities" className="px-4 sm:px-6 fade-in">
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <h2 className="section-title">
          <FaRunning className="text-amber-400" />
          Activities
        </h2>

        {activities.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No activities added yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ActivityCard({ activity }: { activity: Activity }) {
  const icon = CATEGORY_ICONS[activity.category] ?? <FaCalendarCheck className="text-gray-400" />;
  const colorClass = CATEGORY_COLORS[activity.category] ?? 'border-gray-500/20 bg-gray-500/5';

  return (
    <div className={`glass-card rounded-xl p-5 border ${colorClass}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-white font-semibold text-sm">{activity.category}</h3>
      </div>

      {/* Schedule line */}
      {activity.schedule && (
        <div className="mb-3">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">Schedule</p>
          <p className="text-amber-300 font-bold text-sm">{activity.schedule}</p>
        </div>
      )}

      {/* Meetings */}
      {activity.meetings && activity.meetings.length > 0 && (
        <div className="space-y-3 mt-2">
          {activity.meetings.map((meeting, i) => (
            <div key={i} className="glass-card rounded-lg p-3">
              <p className="text-[10px] text-gray-500 mb-0.5">{meeting.date}</p>
              <p className="text-white font-semibold text-sm">{meeting.name}</p>
              <span className="inline-block mt-1 text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                {meeting.time}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
