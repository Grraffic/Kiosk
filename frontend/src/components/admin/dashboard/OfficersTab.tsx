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

export default function OfficersTab({
  data,
  setData,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  pageInput,
  setPageInput,
}: Props) {
  const filtered = (data.officers || []).filter(
    (o) =>
      (o.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.position || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginated = filtered.slice((currentPage - 1) * 5, currentPage * 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h3 className="text-white font-semibold text-lg tracking-tight">Locale officers</h3>
        <button
          type="button"
          onClick={() =>
            setData({
              ...data,
              officers: [{ id: Date.now().toString(), name: '', position: '' }, ...(data.officers || [])],
            })
          }
          className="text-sm font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25 px-4 py-2 rounded-xl hover:bg-amber-500/25 transition"
        >
          Add officer
        </button>
      </div>
      <AdminSearchBar value={searchTerm} onChange={setSearchTerm} />
      {paginated.map((officer) => {
        const globalIdx = data.officers.findIndex((o) => o.id === officer.id);
        if (globalIdx === -1) return null;
        return (
          <div
            key={officer.id}
            className="grid grid-cols-12 gap-4 items-end bg-navy-900/50 border border-navy-800/60 rounded-2xl p-5"
          >
            <div className="col-span-12 md:col-span-3">
              <label className="admin-label">Avatar</label>
              <div className="flex flex-col gap-2">
                {officer.picture ? (
                  <img src={officer.picture} alt="" className="w-12 h-12 rounded-lg object-cover ring-1 ring-white/10" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-navy-800 ring-1 ring-white/5" />
                )}
                <ImageUpload
                  buttonLabel="Upload"
                  onUploadSuccess={(url) => {
                    const arr = [...data.officers];
                    arr[globalIdx] = { ...officer, picture: url };
                    setData({ ...data, officers: arr });
                  }}
                  className="text-xs w-full"
                />
              </div>
            </div>
            <div className="col-span-12 md:col-span-4">
              <label className="admin-label">Name</label>
              <input
                type="text"
                value={officer.name}
                onChange={(e) => {
                  const arr = [...data.officers];
                  arr[globalIdx] = { ...officer, name: e.target.value };
                  setData({ ...data, officers: arr });
                }}
                className="admin-input"
              />
            </div>
            <div className="col-span-12 md:col-span-3">
              <label className="admin-label">Position</label>
              <input
                type="text"
                value={officer.position}
                onChange={(e) => {
                  const arr = [...data.officers];
                  arr[globalIdx] = { ...officer, position: e.target.value };
                  setData({ ...data, officers: arr });
                }}
                className="admin-input"
              />
            </div>
            <div className="col-span-12 md:col-span-2">
              <button
                type="button"
                onClick={() => setData({ ...data, officers: data.officers.filter((o) => o.id !== officer.id) })}
                className="w-full py-2.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25 transition text-sm font-semibold"
              >
                Remove
              </button>
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
