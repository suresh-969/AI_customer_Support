import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Ticket, Priority } from '@/types';
import { loadTickets, saveTickets } from '@/lib/storage';
import { Sidebar, type View } from '@/components/Sidebar';
import { DashboardStats } from '@/components/DashboardStats';
import { FilterBar, type FilterState } from '@/components/FilterBar';
import { TicketList } from '@/components/TicketList';
import { TicketDetail } from '@/components/TicketDetail';
import { AnalyzeRequest } from '@/components/AnalyzeRequest';
import { About } from '@/components/About';
import { Inbox, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

const STORAGE_VIEW_KEY = 'triage-view-v1';

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [view, setView] = useState<View>(() => {
    return (localStorage.getItem(STORAGE_VIEW_KEY) as View) || 'dashboard';
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showList, setShowList] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All',
    priority: 'All',
    status: 'All',
  });

  // Load tickets from localStorage on mount
  useEffect(() => {
    setTickets(loadTickets());
  }, []);

  // Persist tickets whenever they change
  useEffect(() => {
    if (tickets.length > 0) saveTickets(tickets);
  }, [tickets]);

  // Persist view
  useEffect(() => {
    localStorage.setItem(STORAGE_VIEW_KEY, view);
  }, [view]);

  // Auto-select first ticket when entering inbox
  useEffect(() => {
    if (view === 'inbox' && !selectedId && tickets.length > 0) {
      setSelectedId(tickets[0].id);
    }
  }, [view, selectedId, tickets]);

  const filteredTickets = useMemo(() => {
    return tickets
      .filter((t) => {
        if (filters.category !== 'All' && t.category !== filters.category) return false;
        if (filters.priority !== 'All' && t.priority !== filters.priority) return false;
        if (filters.status !== 'All' && t.status !== filters.status) return false;
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const haystack = `${t.customerName} ${t.subject} ${t.message} ${t.email}`.toLowerCase();
          if (!haystack.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        // Sort by priority then date
        const priOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        if (priOrder[a.priority] !== priOrder[b.priority]) return priOrder[a.priority] - priOrder[b.priority];
        return b.createdAt - a.createdAt;
      });
  }, [tickets, filters]);

  const selectedTicket = useMemo(
    () => tickets.find((t) => t.id === selectedId) ?? null,
    [tickets, selectedId],
  );

  const updateTicket = useCallback((id: string, updates: Partial<Ticket>) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const handlePriorityChange = useCallback(
    (priority: Priority) => {
      if (selectedId) updateTicket(selectedId, { priority });
    },
    [selectedId, updateTicket],
  );

  const handleStatusToggle = useCallback(() => {
    if (!selectedTicket) return;
    updateTicket(selectedTicket.id, {
      status: selectedTicket.status === 'Pending' ? 'Resolved' : 'Pending',
    });
  }, [selectedTicket, updateTicket]);

  const handleReplyChange = useCallback(
    (reply: string) => {
      if (selectedId) updateTicket(selectedId, { editedReply: reply });
    },
    [selectedId, updateTicket],
  );

  const pendingCount = tickets.filter((t) => t.status === 'Pending').length;
  const criticalCount = tickets.filter((t) => t.priority === 'Critical' && t.status === 'Pending').length;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans text-gray-900">
      {/* Sidebar — hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar view={view} onChange={setView} pendingCount={pendingCount} criticalCount={criticalCount} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar (mobile nav) */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <select
              value={view}
              onChange={(e) => setView(e.target.value as View)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700"
            >
              <option value="dashboard">Dashboard</option>
              <option value="inbox">Ticket Inbox</option>
              <option value="analyze">Analyze Request</option>
              <option value="about">About</option>
            </select>
          </div>
          {criticalCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-600">
              <AlertTriangle className="h-3 w-3" /> {criticalCount} urgent
            </span>
          )}
        </div>

        {/* Content area */}
        <div className="flex flex-1 overflow-hidden">
          {view === 'dashboard' && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-5">
                <h1 className="text-xl font-bold text-gray-900">Support Triage Overview</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Monitor ticket volume, urgent issues, and resolution progress at a glance.
                </p>
              </div>
              <DashboardStats tickets={tickets} />

              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-gray-900">Recent Critical &amp; High Priority Tickets</h2>
                  <button
                    onClick={() => setView('inbox')}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    View all →
                  </button>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <TicketList
                    tickets={tickets
                      .filter((t) => (t.priority === 'Critical' || t.priority === 'High') && t.status === 'Pending')
                      .slice(0, 5)}
                    selectedId={selectedId}
                    onSelect={(id) => {
                      setSelectedId(id);
                      setView('inbox');
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {view === 'inbox' && (
            <>
              {/* Ticket list panel */}
              <div
                className={`flex flex-col border-r border-gray-200 bg-white ${
                  showList ? 'w-full md:w-[380px]' : 'hidden'
                }`}
              >
                <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
                  <Inbox className="h-4 w-4 text-gray-400" />
                  <h2 className="text-sm font-bold text-gray-900">Ticket Inbox</h2>
                  <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                    {filteredTickets.length}
                  </span>
                </div>
                <FilterBar filters={filters} onChange={setFilters} resultCount={filteredTickets.length} />
                <div className="flex-1 overflow-y-auto">
                  <TicketList tickets={filteredTickets} selectedId={selectedId} onSelect={setSelectedId} />
                </div>
              </div>

              {/* Detail panel */}
              <div className={`flex-1 overflow-hidden ${showList ? 'hidden md:block' : 'block'}`}>
                {selectedTicket ? (
                  <div className="relative h-full">
                    {/* Mobile back button */}
                    <button
                      onClick={() => setShowList(true)}
                      className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 shadow-sm md:hidden"
                    >
                      <ChevronLeft className="h-4 w-4" /> Back
                    </button>
                    {/* Toggle list on desktop */}
                    <button
                      onClick={() => setShowList(!showList)}
                      className="absolute left-0 top-1/2 z-10 hidden h-10 w-5 items-center justify-center rounded-r-md border border-l-0 border-gray-200 bg-white text-gray-400 shadow-sm transition hover:text-gray-600 md:flex"
                    >
                      {showList ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                    <TicketDetail
                      ticket={selectedTicket}
                      onPriorityChange={handlePriorityChange}
                      onStatusToggle={handleStatusToggle}
                      onReplyChange={handleReplyChange}
                    />
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                      <Inbox className="h-7 w-7 text-gray-300" />
                    </div>
                    <p className="mt-3 text-sm font-medium text-gray-500">Select a ticket to view details</p>
                    <p className="mt-1 text-xs text-gray-400">Choose a ticket from the list to see the full conversation and AI analysis.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {view === 'analyze' && <AnalyzeRequest />}
          {view === 'about' && <About />}
        </div>
      </div>
    </div>
  );
}

export default App;
