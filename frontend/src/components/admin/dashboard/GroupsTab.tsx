import ImageUpload from '../ImageUpload';
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
  sheetSyncing: boolean;
  sheetSyncMsg: string;
  onSheetSync: () => void;
};

export default function GroupsTab({
  data,
  setData,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  pageInput,
  setPageInput,
  sheetSyncing,
  sheetSyncMsg,
  onSheetSync,
}: Props) {
  const filtered = (data.groups || []).filter((g) =>
    (g.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginated = filtered.slice((currentPage - 1) * 5, currentPage * 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h3 className="text-white font-semibold text-lg tracking-tight">Groupings</h3>
        <div className="flex flex-wrap items-center gap-2">
          {sheetSyncMsg && (
            <span
              className={`text-xs px-3 py-1.5 rounded-lg border ${
                sheetSyncMsg.startsWith('✅')
                  ? 'text-green-400 bg-green-500/10 border-green-500/25'
                  : 'text-red-400 bg-red-500/10 border-red-500/25'
              }`}
            >
              {sheetSyncMsg}
            </span>
          )}
          <button
            type="button"
            onClick={onSheetSync}
            disabled={sheetSyncing}
            className="flex items-center gap-2 text-sm font-semibold bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-xl hover:bg-emerald-600/25 transition disabled:opacity-50"
          >
            {sheetSyncing ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Syncing…
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                Sync from Google Sheet
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() =>
              setData({
                ...data,
                groups: [
                  {
                    id: Date.now().toString(),
                    name: 'New group',
                    members: [],
                    toka: '',
                    combinedToka: '',
                  },
                  ...(data.groups || []),
                ],
              })
            }
            className="text-sm font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25 px-4 py-2 rounded-xl hover:bg-amber-500/25 transition"
          >
            Add group
          </button>
        </div>
      </div>
      <AdminSearchBar value={searchTerm} onChange={setSearchTerm} />
      {paginated.map((group) => {
        const globalIdx = data.groups.findIndex((g) => g.id === group.id);
        if (globalIdx === -1) return null;
        return (
          <div key={group.id} className="bg-navy-900/50 border border-navy-800/60 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {group.picture ? (
                  <img src={group.picture} alt="" className="w-11 h-11 rounded-lg object-cover ring-1 ring-white/10 shrink-0" />
                ) : (
                  <div className="w-11 h-11 rounded-lg bg-navy-800 shrink-0 ring-1 ring-white/5" />
                )}
                <ImageUpload
                  buttonLabel="Image"
                  className="text-[10px] px-2 py-1.5 shrink-0"
                  onUploadSuccess={(url) => {
                    const arr = [...data.groups];
                    arr[globalIdx] = { ...group, picture: url };
                    setData({ ...data, groups: arr });
                  }}
                />
                <h4 className="text-amber-400 font-bold text-sm truncate">Group: {group.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => setData({ ...data, groups: data.groups.filter((g) => g.id !== group.id) })}
                className="text-xs font-semibold text-red-400 hover:text-red-300 transition"
              >
                Remove group
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="admin-label text-amber-400/90">Group servant</label>
                <input
                  type="text"
                  readOnly
                  title="Synced from Google Sheet"
                  value={
                    (group.members || [])
                      .filter((m) => m.position && m.position.toUpperCase() === 'GROUP SERVANT')
                      .map((m) => m.name)
                      .join(', ') || 'N/A'
                  }
                  className="admin-input cursor-not-allowed opacity-90 border-amber-500/25 bg-navy-950/80 text-amber-200/80"
                />
              </div>
              <div>
                <label className="admin-label">Group name</label>
                <input
                  type="text"
                  value={group.name}
                  onChange={(e) => {
                    const arr = [...data.groups];
                    arr[globalIdx] = { ...group, name: e.target.value };
                    setData({ ...data, groups: arr });
                  }}
                  className="admin-input"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Individual toka</label>
                <input
                  type="text"
                  value={group.toka || ''}
                  onChange={(e) => {
                    const arr = [...data.groups];
                    arr[globalIdx] = { ...group, toka: e.target.value };
                    setData({ ...data, groups: arr });
                  }}
                  className="admin-input"
                />
              </div>
              <div>
                <label className="admin-label">Combined / tandem toka</label>
                <input
                  type="text"
                  value={group.combinedToka || ''}
                  onChange={(e) => {
                    const arr = [...data.groups];
                    arr[globalIdx] = { ...group, combinedToka: e.target.value };
                    setData({ ...data, groups: arr });
                  }}
                  className="admin-input"
                />
              </div>
            </div>
            <div className="bg-navy-950/60 p-4 rounded-xl border border-navy-800/40 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Members</span>
                <button
                  type="button"
                  onClick={() => {
                    const arr = [...data.groups];
                    arr[globalIdx] = { ...group, members: [...(group.members || []), { name: '' }] };
                    setData({ ...data, groups: arr });
                  }}
                  className="text-xs font-semibold bg-amber-500/15 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/20 hover:bg-amber-500/25 transition"
                >
                  Add member
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(group.members || []).map((member, memIdx) => {
                  if (member.position && member.position.toUpperCase() === 'GROUP SERVANT') return null;
                  return (
                    <div key={memIdx} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Member name"
                        value={member.name}
                        onChange={(e) => {
                          const arr = [...data.groups];
                          const mArr = [...(group.members || [])];
                          mArr[memIdx] = { ...member, name: e.target.value };
                          arr[globalIdx] = { ...group, members: mArr };
                          setData({ ...data, groups: arr });
                        }}
                        className="admin-input flex-1 min-w-0"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const arr = [...data.groups];
                          arr[globalIdx] = { ...group, members: group.members?.filter((_, i) => i !== memIdx) };
                          setData({ ...data, groups: arr });
                        }}
                        className="shrink-0 px-3 rounded-xl bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25 text-sm font-medium"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
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
