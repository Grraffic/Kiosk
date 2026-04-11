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
};

export default function MinistriesTab({
  data,
  setData,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  pageInput,
  setPageInput,
}: Props) {
  const filtered = (data.ministries || []).filter((m) =>
    (m.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginated = filtered.slice((currentPage - 1) * 5, currentPage * 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h3 className="text-white font-semibold text-lg tracking-tight">12 ministries</h3>
        <button
          type="button"
          onClick={() =>
            setData({
              ...data,
              ministries: [
                { id: Date.now().toString(), name: 'New ministry', coordinators: [] },
                ...(data.ministries || []),
              ],
            })
          }
          className="text-sm font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25 px-4 py-2 rounded-xl hover:bg-amber-500/25 transition"
        >
          Add ministry
        </button>
      </div>
      <AdminSearchBar value={searchTerm} onChange={setSearchTerm} />
      {paginated.map((ministry) => {
        const globalIdx = data.ministries.findIndex((m) => m.id === ministry.id);
        if (globalIdx === -1) return null;
        return (
          <div key={ministry.id} className="bg-navy-900/50 border border-navy-800/60 rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <h4 className="text-amber-400 font-bold text-sm">{ministry.name || 'New ministry'}</h4>
              <button
                type="button"
                onClick={() =>
                  setData({ ...data, ministries: data.ministries.filter((m) => m.id !== ministry.id) })
                }
                className="text-xs font-semibold text-red-400 hover:text-red-300"
              >
                Remove ministry
              </button>
            </div>
            <div>
              <label className="admin-label">Ministry name</label>
              <input
                type="text"
                value={ministry.name}
                onChange={(e) => {
                  const arr = [...data.ministries];
                  arr[globalIdx] = { ...ministry, name: e.target.value };
                  setData({ ...data, ministries: arr });
                }}
                className="admin-input"
              />
            </div>
            <div className="bg-navy-950/60 p-4 rounded-xl border border-navy-800/40 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Coordinators</span>
                <button
                  type="button"
                  onClick={() => {
                    const arr = [...data.ministries];
                    arr[globalIdx] = {
                      ...ministry,
                      coordinators: [...(ministry.coordinators || []), { name: '' }],
                    };
                    setData({ ...data, ministries: arr });
                  }}
                  className="text-xs font-semibold bg-amber-500/15 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/20 hover:bg-amber-500/25 transition"
                >
                  Add coordinator
                </button>
              </div>
              {(ministry.coordinators || []).map((coord, coordIdx) => (
                <div key={coordIdx} className="flex flex-wrap gap-2 items-center">
                  {coord.picture ? (
                    <img src={coord.picture} alt="" className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-navy-800 ring-1 ring-white/5" />
                  )}
                  <ImageUpload
                    buttonLabel="Photo"
                    onUploadSuccess={(url) => {
                      const arr = [...data.ministries];
                      const cArr = [...(ministry.coordinators || [])];
                      cArr[coordIdx] = { ...coord, picture: url };
                      arr[globalIdx] = { ...ministry, coordinators: cArr };
                      setData({ ...data, ministries: arr });
                    }}
                    className="text-[10px] px-2 py-1.5 shrink-0"
                  />
                  <input
                    type="text"
                    placeholder="Coordinator name"
                    value={coord.name}
                    onChange={(e) => {
                      const arr = [...data.ministries];
                      const cArr = [...(ministry.coordinators || [])];
                      cArr[coordIdx] = { ...coord, name: e.target.value };
                      arr[globalIdx] = { ...ministry, coordinators: cArr };
                      setData({ ...data, ministries: arr });
                    }}
                    className="admin-input flex-1 min-w-[8rem]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const arr = [...data.ministries];
                      arr[globalIdx] = {
                        ...ministry,
                        coordinators: ministry.coordinators?.filter((_, i) => i !== coordIdx),
                      };
                      setData({ ...data, ministries: arr });
                    }}
                    className="shrink-0 px-3 py-2 rounded-xl bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25 text-sm font-medium"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="bg-navy-950/60 p-4 rounded-xl border border-navy-800/40 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Members</span>
                <button
                  type="button"
                  onClick={() => {
                    const arr = [...data.ministries];
                    arr[globalIdx] = {
                      ...ministry,
                      members: [...(ministry.members || []), { name: '' }],
                    };
                    setData({ ...data, ministries: arr });
                  }}
                  className="text-xs font-semibold bg-amber-500/15 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/20 hover:bg-amber-500/25 transition"
                >
                  Add member
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(ministry.members || []).map((member, memIdx) => (
                  <div key={memIdx} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Member name"
                      value={member.name}
                      onChange={(e) => {
                        const arr = [...data.ministries];
                        const mArr = [...(ministry.members || [])];
                        mArr[memIdx] = { ...member, name: e.target.value };
                        arr[globalIdx] = { ...ministry, members: mArr };
                        setData({ ...data, ministries: arr });
                      }}
                      className="admin-input flex-1 min-w-0"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const arr = [...data.ministries];
                        arr[globalIdx] = {
                          ...ministry,
                          members: ministry.members?.filter((_, i) => i !== memIdx),
                        };
                        setData({ ...data, ministries: arr });
                      }}
                      className="shrink-0 px-3 rounded-xl bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25 text-sm font-medium"
                    >
                      ×
                    </button>
                  </div>
                ))}
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
