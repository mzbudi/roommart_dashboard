type FilterOption = {
  label: string;
  value: string;
};

type FilterSelectProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
};

const FilterSelect = ({
  label,
  value,
  onChange,
  options,
}: FilterSelectProps) => {
  return (
    <div className="flex flex-col text-sm">
      {label && <span className="mb-1 font-medium text-gray-600">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-3 py-2 bg-white shadow-sm h-full"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSelect;
