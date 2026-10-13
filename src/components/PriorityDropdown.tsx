import type { Priority } from '@/types';
import { PRIORITY_STYLES, PRIORITY_DOT } from '@/lib/ui';
import { ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const ALL_PRIORITIES: Priority[] = ['Critical', 'High', 'Medium', 'Low'];

interface Props {
  priority: Priority;
  onChange: (p: Priority) => void;
}

export function PriorityDropdown({ priority, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition hover:opacity-80 ${PRIORITY_STYLES[priority]}`}
      >
        <span className={`h-2 w-2 rounded-full ${PRIORITY_DOT[priority]}`} />
        {priority}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>
      {open && (
        <div className="absolute z-30 mt-1 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {ALL_PRIORITIES.map((p) => (
            <button
              key={p}
              onClick={() => {
                onChange(p);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
            >
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${PRIORITY_DOT[p]}`} />
                {p}
              </span>
              {p === priority && <Check className="h-3 w-3 text-blue-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
