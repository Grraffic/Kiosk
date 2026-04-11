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

export default function UpdatesTab({
  data,
  setData,
  searchTerm,
  setSearchTerm,
  currentPage,
  setCurrentPage,
  pageInput,
  setPageInput,
}: Props) {
  const filtered = (data.updates || []).filter((u) =>
    (u.text || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginated = filtered.slice((currentPage - 1) * 5, currentPage * 5);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h3 className="text-white font-semibold text-lg tracking-tight">Marquee updates</h3>
        <button
          type="button"
          onClick={() =>
            setData({
              ...data,
              updates: [{ id: Date.now().toString(), text: 'New update' }, ...(data.updates || [])],
            })
          }
          className="text-sm font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25 px-4 py-2 rounded-xl hover:bg-amber-500/25 transition"
        >
          Add update
        </button>
      </div>
      <AdminSearchBar value={searchTerm} onChange={setSearchTerm} />
      {paginated.map((update) => {
        const globalIdx = data.updates.findIndex((u) => u.id === update.id);
        if (globalIdx === -1) return null;
        return (
          <div key={update.id} className="flex gap-2">
            <input
              type="text"
              value={update.text || ''}
              onChange={(e) => {
                const arr = [...data.updates];
                arr[globalIdx] = { ...update, text: e.target.value };
                setData({ ...data, updates: arr });
              }}
              className="admin-input flex-1"
            />
            <button
              type="button"
              onClick={() => setData({ ...data, updates: data.updates.filter((u) => u.id !== update.id) })}
              className="shrink-0 px-4 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 transition font-medium text-sm"
            >
              Remove
            </button>
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
