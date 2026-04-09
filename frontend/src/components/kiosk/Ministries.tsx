import { useState } from 'react';
import { FaPrayingHands, FaUserTie, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import type { Ministry } from '../../types';

function AvatarPlaceholder({ name }: { name: string }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/30 to-blue-500/30 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold text-xs flex-shrink-0">
      {initials || <FaUserTie />}
    </div>
  );
}

export default function Ministries({ ministries }: { ministries: Ministry[] }) {
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);

  return (
    <section id="ministries" className="px-4 sm:px-6 fade-in h-full relative">
      <div className="glass-card rounded-2xl p-6 md:p-8 h-full flex flex-col">
        <h2 className="section-title">
          <FaPrayingHands className="text-amber-400" />
          12 Ministries
        </h2>

        {ministries.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No ministries added yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto custom-slide-scroll pb-6">
            {ministries.map((ministry) => (
              <MinistryCard key={ministry.id} ministry={ministry} onClick={() => setSelectedMinistry(ministry)} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedMinistry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMinistry(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card bg-navy-900/90 border border-amber-500/30 rounded-2xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto custom-slide-scroll relative shadow-2xl"
            >
              <button 
                onClick={() => setSelectedMinistry(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-red-500/80 p-2 rounded-full transition-all"
              >
                <FaTimes />
              </button>
              
              <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <FaPrayingHands className="text-amber-400 text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-wide">{selectedMinistry.name}</h3>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-4">Coordinators</h4>
                  {selectedMinistry.coordinators.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedMinistry.coordinators.map((coord, i) => (
                        <div key={i} className="flex items-center gap-3 bg-navy-950/50 p-3 rounded-lg border border-white/5">
                          {coord.picture ? <img src={coord.picture} alt={coord.name} className="w-10 h-10 rounded-full object-cover border border-amber-500/30 flex-shrink-0" /> : <AvatarPlaceholder name={coord.name} />}
                          <p className="text-white font-bold text-sm leading-tight">{coord.name}</p>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-gray-500 text-sm">TBA</p>}
                </div>

                <div>
                  <h4 className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-4">Members Directory</h4>
                  {(selectedMinistry.members && selectedMinistry.members.length > 0) ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedMinistry.members.map((member, i) => (
                         <div key={i} className="flex items-center gap-2 bg-navy-950/30 p-2 rounded-lg border border-white/5">
                           <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                           <p className="text-gray-300 text-sm">{member.name}</p>
                         </div>
                      ))}
                    </div>
                  ) : <p className="text-gray-500 text-sm italic">No configured members inside this ministry yet.</p>}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function MinistryCard({ ministry, onClick }: { ministry: Ministry, onClick: () => void }) {
  return (
    <div onClick={onClick} className="glass-card cursor-pointer rounded-xl p-4 hover:border-amber-500 transition-all duration-200 group active:scale-95 shadow-lg">
      <div className="mb-3 border-b border-white/5 pb-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center mb-2 group-hover:bg-amber-500/30 transition-colors">
          <FaPrayingHands className="text-amber-400 text-sm" />
        </div>
        <h3 className="text-white font-semibold text-sm leading-tight group-hover:text-amber-300 transition-colors">
          {ministry.name}
        </h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Coordinators</p>
          <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">{ministry.coordinators.length}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Members</p>
          <span className="text-[10px] font-bold bg-white/10 text-gray-300 px-2 py-0.5 rounded">{ministry.members?.length || 0}</span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-white/5 text-center">
         <span className="text-xs text-amber-500/80 group-hover:text-amber-400 font-bold tracking-widest uppercase transition-colors">Tap to View</span>
      </div>
    </div>
  );
}
