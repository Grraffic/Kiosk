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

export default function ActivitiesTab({
  data,
  setData,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  pageInput,
  setPageInput,
}: Props) {
  const filtered = (data.activities || []).filter((a) =>
    (a.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginated = filtered.slice((currentPage - 1) * 5, currentPage * 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h3 className="text-white font-semibold text-lg tracking-tight">Activities</h3>
        <button
          type="button"
          onClick={() =>
            setData({
              ...data,
              activities: [
                { id: Date.now().toString(), category: 'New category', schedule: '', meetings: [] },
                ...(data.activities || []),
              ],
            })
          }
          className="text-sm font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25 px-4 py-2 rounded-xl hover:bg-amber-500/25 transition"
        >
          Add category
        </button>
      </div>
      <AdminSearchBar value={searchTerm} onChange={setSearchTerm} />
      {paginated.map((activity) => {
        const globalIdx = data.activities.findIndex((a) => a.id === activity.id);
        if (globalIdx === -1) return null;
        return (
          <div key={activity.id} className="bg-navy-900/50 border border-navy-800/60 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <h4 className="text-amber-400 font-bold text-sm">{activity.category || 'New category'}</h4>
              <button
                type="button"
                onClick={() =>
                  setData({ ...data, activities: data.activities.filter((a) => a.id !== activity.id) })
                }
                className="text-xs font-semibold text-red-400 hover:text-red-300"
              >
                Remove category
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Category title</label>
                <input
                  type="text"
                  value={activity.category}
                  onChange={(e) => {
                    const arr = [...data.activities];
                    arr[globalIdx] = { ...activity, category: e.target.value };
                    setData({ ...data, activities: arr });
                  }}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Schedule (optional)</label>
                <input
                  type="text"
                  value={activity.schedule || ''}
                  onChange={(e) => {
                    const arr = [...data.activities];
                    arr[globalIdx] = { ...activity, schedule: e.target.value };
                    setData({ ...data, activities: arr });
                  }}
                  className="admin-input"
                />
              </div>
            </div>
            <div className="bg-navy-950/60 p-4 rounded-xl border border-navy-800/40 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                  Tracked meetings / dates
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const arr = [...data.activities];
                    arr[globalIdx] = {
                      ...activity,
                      meetings: [...(activity.meetings || []), { name: '', date: '', time: '' }],
                    };
                    setData({ ...data, activities: arr });
                  }}
                  className="text-xs font-semibold bg-amber-500/15 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/20 hover:bg-amber-500/25 transition"
                >
                  Add meeting
                </button>
              </div>
              {(activity.meetings || []).map((meeting, meetIdx) => (
                <div key={meetIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Meeting name"
                    value={meeting.name}
                    onChange={(e) => {
                      const arr = [...data.activities];
                      const mArr = [...(activity.meetings || [])];
                      mArr[meetIdx] = { ...meeting, name: e.target.value };
                      arr[globalIdx] = { ...activity, meetings: mArr };
                      setData({ ...data, activities: arr });
                    }}
                    className="admin-input"
                  />
                  <input
                    type="date"
                    value={meeting.date}
                    onChange={(e) => {
                      const arr = [...data.activities];
                      const mArr = [...(activity.meetings || [])];
                      mArr[meetIdx] = { ...meeting, date: e.target.value };
                      arr[globalIdx] = { ...activity, meetings: mArr };
                      setData({ ...data, activities: arr });
                    }}
                    className="admin-input"
                  />
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={meeting.time}
                      onChange={(e) => {
                        const arr = [...data.activities];
                        const mArr = [...(activity.meetings || [])];
                        mArr[meetIdx] = { ...meeting, time: e.target.value };
                        arr[globalIdx] = { ...activity, meetings: mArr };
                        setData({ ...data, activities: arr });
                      }}
                      className="admin-input flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const arr = [...data.activities];
                        arr[globalIdx] = {
                          ...activity,
                          meetings: activity.meetings?.filter((_, i) => i !== meetIdx),
                        };
                        setData({ ...data, activities: arr });
                      }}
                      className="shrink-0 px-3 rounded-xl bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25 text-sm font-medium"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
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
