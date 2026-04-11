type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function AdminSearchBar({
  value,
  onChange,
  placeholder = 'Search items…',
}: Props) {
  return (
    <div className="flex justify-end mb-4">
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="admin-input max-w-xs w-full placeholder:text-gray-500"
      />
    </div>
  );
}
