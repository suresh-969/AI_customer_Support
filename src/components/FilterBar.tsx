import { Search, X } from 'lucide-react';
import type { Category, Priority } from '@/types';

export interface FilterState {
  search: string;
  category: Category | 'All';
  priority: Priority | 'All';
  status: 'All' | 'Pending' | 'Resolved';
}

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  resultCount: number;
}

const categories: (Category | 'All')[] = ['All', 'Billing', 'Technical Issue', 'Product Defect', 'General Question'];
const priorities: (Priority | 'All')[] = ['All', 'Critical', 'High', 'Medium', 'Low'];
const statuses: ('All' | 'Pending' | 'Resolved')[] = ['All', 'Pending', 'Resolved'];

export function FilterBar({ filters, onChange, resultCount }: Props) {
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, subject, or message..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-8 text-sm text-gray-700 placeholder-gray-400 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <FilterSelect
          label="Category"
          value={filters.category}
          options={categories}
          onChange={(v) => onChange({ ...filters, category: v as Category | 'All' })}
        />
        <FilterSelect
          label="Priority"
          value={filters.priority}
          options={priorities}
          onChange={(v) => onChange({ ...filters, priority: v as Priority | 'All' })}
        />
        <FilterSelect
          label="Status"
          value={filters.status}
          options={statuses}
          onChange={(v) => onChange({ ...filters, status: v as 'All' | 'Pending' | 'Resolved' })}
        />
        <span className="ml-auto text-xs text-gray-400">{resultCount} result{resultCount !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative inline-flex items-center">
      <label className="mr-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-200 bg-white py-1.5 pl-2.5 pr-7 text-xs font-medium text-gray-700 outline-none transition hover:border-gray-300 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
