import AdminSearchBar from './AdminSearchBar';
import AdminPagination from './AdminPagination';
import type { KioskData } from '../../../types';

type Props = {
  data: KioskData;
  setData: React.Dispatch<React.SetStateAction<KioskData | null>>;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageInput: string;
  setPageInput: (v: string) => void;
};

export default function EventsTab({
  data,
  setData,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  pageInput,
  setPageInput,
}: Props) {
  const filtered = (data.events || []).filter((ev) =>
    (ev.label || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginated = filtered.slice((currentPage - 1) * 5, currentPage * 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h3 className="text-white font-semibold text-lg tracking-tight">Upcoming events</h3>
        <button
          type="button"
          onClick={() =>
            setData({
              ...data,
              events: [
                { id: Date.now().toString(), date: '', label: '', items: [] },
                ...(data.events || []),
              ],
            })
          }
          className="text-sm font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25 px-4 py-2 rounded-xl hover:bg-amber-500/25 transition"
        >
          Add event
        </button>
      </div>
      <AdminSearchBar value={searchTerm} onChange={setSearchTerm} />
      {paginated.map((ev) => {
        const globalIdx = data.events.findIndex((e) => e.id === ev.id);
        if (globalIdx === -1) return null;
        return (
          <div
            key={ev.id}
            className="rounded-2xl border border-navy-800/60 bg-navy-900/40 p-6 space-y-4 shadow-lg shadow-black/20"
          >
            <div className="flex flex-wrap justify-between items-center gap-3 border-b border-navy-800/50 pb-4">
              <h4 className="text-amber-400 font-bold text-xs uppercase tracking-widest">
                {ev.label || 'Untitled event'}
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-xs text-amber-200/90 flex items-center gap-2 cursor-pointer font-semibold bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                  <input
                    type="checkbox"
                    checked={ev.showCountdown || false}
                    onChange={(e) => {
                      const arr = [...data.events];
                      arr[globalIdx] = { ...ev, showCountdown: e.target.checked };
                      setData({ ...data, events: arr });
                    }}
                    className="accent-amber-500 rounded"
                  />
                  Show countdown
                </label>
                <button
                  type="button"
                  onClick={() => setData({ ...data, events: data.events.filter((e) => e.id !== ev.id) })}
                  className="text-xs font-semibold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="admin-label">Event title</label>
                <input
                  type="text"
                  placeholder="e.g. EVENTS (Tap multimedia)"
                  value={ev.label}
                  onChange={(e) => {
                    const arr = [...data.events];
                    arr[globalIdx] = { ...ev, label: e.target.value };
                    setData({ ...data, events: arr });
                  }}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Start date</label>
                <input
                  type="date"
                  value={ev.date}
                  onChange={(e) => {
                    const arr = [...data.events];
                    arr[globalIdx] = { ...ev, date: e.target.value };
                    setData({ ...data, events: arr });
                  }}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">End date (optional range)</label>
                <input
                  type="date"
                  value={ev.endDate || ''}
                  onChange={(e) => {
                    const arr = [...data.events];
                    arr[globalIdx] = { ...ev, endDate: e.target.value };
                    setData({ ...data, events: arr });
                  }}
                  className="admin-input"
                />
              </div>
              <div className="md:col-span-2">
                <label className="admin-label">Description</label>
                <textarea
                  placeholder="Write event details here…"
                  value={ev.description || ''}
                  onChange={(e) => {
                    const arr = [...data.events];
                    arr[globalIdx] = { ...ev, description: e.target.value };
                    setData({ ...data, events: arr });
                  }}
                  className="admin-input min-h-[6rem] resize-y custom-slide-scroll"
                />
              </div>
            </div>
          </div>
        );
      })}
      <AdminPagination
        arrayLength={filtered.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageInput={pageInput}
        setPageInput={setPageInput}
      />
    </div>
  );
}
