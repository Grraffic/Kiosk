import { FaUsers, FaUserTie } from 'react-icons/fa';
import { type Officer } from '../../types';

function AvatarPlaceholder({ name, size = 'md' }: { name: string; size?: 'md' | 'lg' }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizeClass = size === 'lg' ? 'w-20 h-20 text-2xl' : 'w-16 h-16 text-xl';

  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br from-amber-500/30 to-blue-600/30 border-2 border-amber-500/40 flex items-center justify-center font-bold text-amber-300 mx-auto`}
    >
      {initials || <FaUserTie />}
    </div>
  );
}

export default function LocaleOfficers({ officers }: { officers: Officer[] }) {
  return (
    <section id="officers" className="px-4 sm:px-6 fade-in">
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <h2 className="section-title">
          <FaUsers className="text-amber-400" />
          Locale Officers
        </h2>

        {officers.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            No officers added yet. Manage via Admin panel.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {officers.map((officer) => (
              <OfficerCard key={officer.id} officer={officer} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function OfficerCard({ officer }: { officer: Officer }) {
  return (
    <div className="flex flex-col items-center gap-3 glass-card rounded-xl p-4 text-center hover:border-amber-500/30 transition-all duration-200 group">
      {officer.picture ? (
        <img
          src={officer.picture}
          alt={officer.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-amber-500/40 group-hover:border-amber-400 transition-all"
        />
      ) : (
        <AvatarPlaceholder name={officer.name} />
      )}
      <div>
        <p className="text-white font-semibold text-sm leading-tight">{officer.name}</p>
        <span className="inline-block mt-1 text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
          {officer.position}
        </span>
      </div>
    </div>
  );
}
