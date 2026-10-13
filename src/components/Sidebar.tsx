import { LayoutDashboard, Inbox, Sparkles, LifeBuoy } from 'lucide-react';

export type View = 'dashboard' | 'inbox' | 'analyze' | 'about';

interface Props {
  view: View;
  onChange: (v: View) => void;
  pendingCount: number;
  criticalCount: number;
}

const items: { id: View; label: string; icon: typeof Inbox }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inbox', label: 'Ticket Inbox', icon: Inbox },
  { id: 'analyze', label: 'Analyze Request', icon: Sparkles },
  { id: 'about', label: 'About / Help', icon: LifeBuoy },
];

export function Sidebar({ view, onChange, pendingCount, criticalCount }: Props) {
  return (
    <aside className="flex h-full w-60 flex-col border-r border-gray-200 bg-white">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <LifeBuoy className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 leading-tight">TriageAI</p>
          <p className="text-[10px] text-gray-400 leading-tight">Support Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2">
        {items.map(({ id, label, icon: Icon }) => {
          const active = view === id;
          const badge =
            id === 'inbox' && pendingCount > 0
              ? pendingCount
              : id === 'dashboard' && criticalCount > 0
                ? criticalCount
                : null;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </span>
              {badge !== null && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    id === 'dashboard' && criticalCount > 0
                      ? 'bg-red-100 text-red-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-4">
        <div className="rounded-lg bg-gray-50 px-3 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Prototype
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
            AI analysis is simulated locally. No data leaves your browser.
          </p>
        </div>
      </div>
    </aside>
  );
}
