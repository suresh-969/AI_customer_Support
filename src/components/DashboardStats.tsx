import type { Ticket } from '@/types';
import { AlertTriangle, Clock, CheckCircle2, Inbox } from 'lucide-react';

interface Props {
  tickets: Ticket[];
}

export function DashboardStats({ tickets }: Props) {
  const total = tickets.length;
  const urgent = tickets.filter((t) => t.priority === 'Critical' && t.status !== 'Resolved').length;
  const pending = tickets.filter((t) => t.status === 'Pending').length;
  const resolved = tickets.filter((t) => t.status === 'Resolved').length;

  const cards = [
    { label: 'Total Tickets', value: total, icon: Inbox, color: 'bg-blue-50 text-blue-600', ring: 'ring-blue-100' },
    { label: 'Urgent Tickets', value: urgent, icon: AlertTriangle, color: 'bg-red-50 text-red-600', ring: 'ring-red-100' },
    { label: 'Pending', value: pending, icon: Clock, color: 'bg-amber-50 text-amber-600', ring: 'ring-amber-100' },
    { label: 'Resolved', value: resolved, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600', ring: 'ring-emerald-100' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, color, ring }) => (
        <div
          key={label}
          className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ring-1 ${ring} transition hover:shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
            </div>
            <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
