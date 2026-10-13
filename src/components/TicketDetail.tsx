import type { Ticket } from '@/types';
import { STATUS_STYLES, CATEGORY_STYLES, formatDateTime } from '@/lib/ui';
import { PriorityDropdown } from '@/components/PriorityDropdown';
import { AIAnalysisPanel } from '@/components/AIAnalysisPanel';
import { analyzeMessage } from '@/ai/analyzer';
import { Mail, CheckCircle2, RotateCcw, User, Clock } from 'lucide-react';
import { useMemo } from 'react';

interface Props {
  ticket: Ticket;
  onPriorityChange: (priority: Ticket['priority']) => void;
  onStatusToggle: () => void;
  onReplyChange: (reply: string) => void;
}

export function TicketDetail({ ticket, onPriorityChange, onStatusToggle, onReplyChange }: Props) {
  const analysis = useMemo(
    () => ticket.aiAnalysis ?? analyzeMessage(ticket.message, ticket.subject, ticket.customerName),
    [ticket],
  );
  const editedReply = ticket.editedReply ?? analysis.suggestedReply;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h2 className="text-lg font-bold text-gray-900">{ticket.subject}</h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <PriorityDropdown priority={ticket.priority} onChange={onPriorityChange} />
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[ticket.status]}`}>
            {ticket.status}
          </span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${CATEGORY_STYLES[ticket.category]}`}>
            {ticket.category}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-5 p-6 lg:grid-cols-5">
          {/* Left: ticket info */}
          <div className="lg:col-span-3">
            {/* Customer info */}
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {ticket.customerName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{ticket.customerName}</p>
                  <p className="flex items-center gap-1 text-xs text-gray-400">
                    <Mail className="h-3 w-3" /> {ticket.email}
                  </p>
                </div>
                <span className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3 w-3" /> {formatDateTime(ticket.createdAt)}
                </span>
              </div>
            </div>

            {/* Message */}
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                <User className="h-3 w-3" /> Customer Message
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{ticket.message}</p>
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex items-center gap-2.5">
              {ticket.status === 'Pending' ? (
                <button
                  onClick={onStatusToggle}
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <CheckCircle2 className="h-4 w-4" /> Mark as Resolved
                </button>
              ) : (
                <button
                  onClick={onStatusToggle}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <RotateCcw className="h-4 w-4" /> Reopen Ticket
                </button>
              )}
            </div>
          </div>

          {/* Right: AI panel */}
          <div className="lg:col-span-2">
            <AIAnalysisPanel analysis={analysis} editedReply={editedReply} onReplyChange={onReplyChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
