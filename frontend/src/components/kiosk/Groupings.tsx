import { useState } from 'react';
import { FaLayerGroup, FaUserCircle, FaUsers, FaHandshake } from 'react-icons/fa';
import { type Group } from '../../types';

export default function Groupings({ groups }: { groups: Group[] }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="groupings" className="px-4 sm:px-6 fade-in">
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <h2 className="section-title">
          <FaLayerGroup className="text-amber-400" />
          Groupings
        </h2>

        {groups.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No groups added yet.</p>
        ) : (
          <>
            {/* Tab buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              {groups.map((g, i) => (
                <button
                  key={g.id}
                  onClick={() => setActiveTab(i)}
                  className={`tab-btn ${activeTab === i ? 'active' : ''}`}
                >
                  {g.name}
                </button>
              ))}
            </div>

            {/* Active group content */}
            {groups[activeTab] && <GroupPanel group={groups[activeTab]} />}
          </>
        )}
      </div>
    </section>
  );
}

function GroupPanel({ group }: { group: Group }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in">
      {/* GS Info */}
      <div className="glass-card rounded-xl p-5 flex flex-col items-center gap-3 text-center">
        {group.picture ? (
          <img
            src={group.picture}
            alt={group.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-amber-500/50"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/30 to-blue-600/30 border-2 border-amber-500/40 flex items-center justify-center">
            <FaUserCircle className="text-amber-300 text-4xl" />
          </div>
        )}
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Group Shepherd</p>
          <p className="text-white font-bold text-lg">{group.name}</p>
        </div>
      </div>

      {/* Members */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <FaUsers className="text-amber-400" />
          <h3 className="text-amber-400 font-semibold text-sm">Members</h3>
        </div>
        {group.members.length === 0 ? (
          <p className="text-gray-500 text-xs">No members listed.</p>
        ) : (
          <ul className="space-y-1.5">
            {group.members.map((m, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                  {i + 1}
                </span>
                {m.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Toka */}
      <div className="space-y-4">
        {group.toka && (
          <div className="glass-card-gold rounded-xl p-4">
            <p className="text-[10px] text-amber-400/70 uppercase tracking-widest mb-1">Group Toka</p>
            <p className="text-amber-300 font-semibold text-sm">{group.toka}</p>
          </div>
        )}
        {group.combinedToka && (
          <div className="glass-card rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-1">
              <FaHandshake className="text-blue-400 text-sm" />
              <p className="text-[10px] text-blue-400 uppercase tracking-widest">Combined / Tandem Toka</p>
            </div>
            <p className="text-blue-300 font-semibold text-sm">{group.combinedToka}</p>
          </div>
        )}
        {!group.toka && !group.combinedToka && (
          <div className="glass-card rounded-xl p-4">
            <p className="text-gray-500 text-xs">No toka assigned yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
