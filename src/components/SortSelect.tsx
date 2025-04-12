type SortOption = {
  label: string;
  value: string;
};

type SortSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options?: SortOption[];
};

const defaultOptions: SortOption[] = [
  { label: "Nama A-Z", value: "name-asc" },
  { label: "Nama Z-A", value: "name-desc" },
  { label: "Harga Terendah", value: "price-asc" },
  { label: "Harga Tertinggi", value: "price-desc" },
  { label: "Terbaru", value: "createdAt-desc" },
  { label: "Terlama", value: "createdAt-asc" },
];

const SortSelect = ({
  value,
  onChange,
  options = defaultOptions,
}: SortSelectProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-3 py-2 bg-white text-sm shadow-sm"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default SortSelect;
