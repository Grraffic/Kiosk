type Props = {
  arrayLength: number;
  pageSize?: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageInput: string;
  setPageInput: (v: string) => void;
};

export default function AdminPagination({
  arrayLength,
  pageSize = 5,
  currentPage,
  setCurrentPage,
  pageInput,
  setPageInput,
}: Props) {
  const totalPages = Math.ceil(arrayLength / pageSize) || 1;

  return (
    <div className="flex flex-wrap justify-between items-center gap-3 mt-6 border-t border-navy-800/50 pt-4">
      <div className="text-gray-400 text-sm">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-2 bg-navy-800 text-white rounded-xl text-sm hover:bg-navy-700 transition disabled:opacity-40 disabled:pointer-events-none"
        >
          Prev
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const p = parseInt(pageInput, 10);
              if (!Number.isNaN(p) && p >= 1 && p <= totalPages) setCurrentPage(p);
              else setPageInput(currentPage.toString());
            }
          }}
          onBlur={() => {
            const p = parseInt(pageInput, 10);
            if (!Number.isNaN(p) && p >= 1 && p <= totalPages) setCurrentPage(p);
            else setPageInput(currentPage.toString());
          }}
          className="w-12 text-center admin-input py-1.5"
          aria-label="Page number"
        />
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 bg-navy-800 text-white rounded-xl text-sm hover:bg-navy-700 transition disabled:opacity-40 disabled:pointer-events-none"
        >
          Next
        </button>
      </div>
    </div>
  );
}
