import type { Priority, Status } from '@/types';

export const PRIORITY_STYLES: Record<Priority, string> = {
  Critical: 'bg-red-100 text-red-700 border border-red-200',
  High: 'bg-orange-100 text-orange-700 border border-orange-200',
  Medium: 'bg-blue-100 text-blue-700 border border-blue-200',
  Low: 'bg-gray-100 text-gray-600 border border-gray-200',
};

export const PRIORITY_DOT: Record<Priority, string> = {
  Critical: 'bg-red-500',
  High: 'bg-orange-500',
  Medium: 'bg-blue-500',
  Low: 'bg-gray-400',
};

export const STATUS_STYLES: Record<Status, string> = {
  Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  Resolved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

export const CATEGORY_STYLES: Record<string, string> = {
  Billing: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
  'Technical Issue': 'bg-cyan-50 text-cyan-600 border border-cyan-100',
  'Product Defect': 'bg-rose-50 text-rose-600 border border-rose-100',
  'General Question': 'bg-slate-100 text-slate-600 border border-slate-200',
};

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60_000);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  if (day < 7) return `${day}d ago`;
  return new Date(ts).toLocaleDateString();
}

export function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
