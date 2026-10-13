import type { Ticket, Category, Priority } from '@/types';
import { PRIORITY_STYLES, STATUS_STYLES, CATEGORY_STYLES, timeAgo } from '@/lib/ui';
import { ChevronRight } from 'lucide-react';

interface Props {
  tickets: Ticket[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function TicketList({ tickets, selectedId, onSelect }: Props) {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <ChevronRight className="h-6 w-6 text-gray-300" />
        </div>
        <p className="mt-3 text-sm font-medium text-gray-500">No tickets match your filters</p>
        <p className="mt-1 text-xs text-gray-400">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {tickets.map((ticket) => {
        const active = ticket.id === selectedId;
        return (
          <button
            key={ticket.id}
            onClick={() => onSelect(ticket.id)}
            className={`flex w-full flex-col gap-1.5 px-4 py-3.5 text-left transition ${
              active ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">{ticket.subject}</p>
                <p className="mt-0.5 truncate text-xs text-gray-500">{ticket.customerName}</p>
              </div>
              <span className="shrink-0 text-[10px] text-gray-400">{timeAgo(ticket.createdAt)}</span>
            </div>
            <p className="line-clamp-2 text-xs text-gray-400">{ticket.message}</p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${PRIORITY_STYLES[ticket.priority]}`}
              >
                {ticket.priority}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${CATEGORY_STYLES[ticket.category]}`}
              >
                {ticket.category}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLES[ticket.status]}`}
              >
                {ticket.status}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
