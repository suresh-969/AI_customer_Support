import { useState } from 'react';
import { analyzeMessage } from '@/ai/analyzer';
import type { AIAnalysis } from '@/types';
import { AIAnalysisPanel } from '@/components/AIAnalysisPanel';
import { Sparkles, Loader2, Send } from 'lucide-react';

export function AnalyzeRequest() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [editedReply, setEditedReply] = useState('');

  const handleAnalyze = () => {
    if (!message.trim()) return;
    setLoading(true);
    setAnalysis(null);
    // Simulate processing delay for realistic UX
    setTimeout(() => {
      const result = analyzeMessage(message, subject || '(No subject)', name || 'Customer');
      setAnalysis(result);
      setEditedReply(result.suggestedReply);
      setLoading(false);
    }, 900);
  };

  const canAnalyze = message.trim().length > 0 && !loading;

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-4xl p-6">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Analyze a New Request</h2>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Paste a customer message below and let the AI classify it, assess urgency, and draft a reply.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Customer Name (optional)">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Jane Doe"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </Field>
            <Field label="Email (optional)">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., jane@company.com"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </Field>
          </div>
          <div className="mt-3">
            <Field label="Subject (optional)">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Cannot log in after payment update"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </Field>
          </div>
          <div className="mt-3">
            <Field label="Customer Message">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Paste the full customer message here..."
                className="w-full resize-y rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </Field>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-[11px] text-gray-400">
              Analysis runs locally in your browser — no data is sent anywhere.
            </p>
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
                canAnalyze
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'cursor-not-allowed bg-gray-200 text-gray-400'
              }`}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {loading ? 'Analyzing...' : 'Analyze with AI'}
            </button>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/40 p-5">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <p className="text-sm font-medium text-blue-700">AI is analyzing the request...</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-blue-100/40" />
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {analysis && !loading && (
          <div className="mt-5">
            <AIAnalysisPanel analysis={analysis} editedReply={editedReply} onReplyChange={setEditedReply} />
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</label>
      {children}
    </div>
  );
}
