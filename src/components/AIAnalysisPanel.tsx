import type { AIAnalysis } from '@/types';
import { AlertTriangle, Brain, Clock, Heart, Tag, Users, FileText, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const URGENCY_STYLES: Record<string, string> = {
  Immediate: 'bg-red-100 text-red-700',
  High: 'bg-orange-100 text-orange-700',
  Normal: 'bg-blue-100 text-blue-700',
  Low: 'bg-gray-100 text-gray-600',
};

const SENTIMENT_STYLES: Record<string, string> = {
  Angry: 'bg-red-100 text-red-700',
  Frustrated: 'bg-orange-100 text-orange-700',
  Anxious: 'bg-amber-100 text-amber-700',
  Neutral: 'bg-gray-100 text-gray-600',
  Positive: 'bg-emerald-100 text-emerald-700',
};

interface Props {
  analysis: AIAnalysis;
  editedReply: string;
  onReplyChange: (text: string) => void;
}

export function AIAnalysisPanel({ analysis, editedReply, onReplyChange }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedReply).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50/40 to-white p-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Brain className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">AI Analysis</h3>
          <p className="text-[10px] text-gray-400">Prototype simulation — local rule-based inference</p>
        </div>
      </div>

      {/* Human review warning */}
      {analysis.needsHumanReview && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
          <div>
            <p className="text-xs font-bold text-red-700">Human Review Required</p>
            <p className="mt-0.5 text-xs text-red-600">{analysis.humanReviewReason}</p>
            <p className="mt-1 text-[11px] font-medium text-red-500">
              No refund, payment, or account change will be processed automatically.
            </p>
          </div>
        </div>
      )}

      {/* Analysis grid */}
      <div className="grid grid-cols-2 gap-3">
        <AnalysisCard icon={Tag} label="Category" value={analysis.category} />
        <AnalysisCard icon={Clock} label="Urgency" value={analysis.urgency} badgeClass={URGENCY_STYLES[analysis.urgency]} />
        <AnalysisCard icon={Heart} label="Sentiment" value={analysis.sentiment} badgeClass={SENTIMENT_STYLES[analysis.sentiment]} />
        <AnalysisCard icon={Users} label="Recommended Team" value={analysis.recommendedTeam} />
      </div>

      {/* Reasoning */}
      <div className="rounded-lg bg-white p-3.5 border border-gray-100">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          <FileText className="h-3 w-3" /> Classification Reasoning
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-gray-600">{analysis.reasoning}</p>
      </div>

      {/* Suggested reply */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Suggested Reply
          </p>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-blue-600 transition hover:bg-blue-50"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <textarea
          value={editedReply}
          onChange={(e) => onReplyChange(e.target.value)}
          rows={9}
          className="w-full resize-y rounded-lg border border-gray-200 bg-white p-3 text-xs leading-relaxed text-gray-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
        />
      </div>
    </div>
  );
}

function AnalysisCard({
  icon: Icon,
  label,
  value,
  badgeClass,
}: {
  icon: typeof Tag;
  label: string;
  value: string;
  badgeClass?: string;
}) {
  return (
    <div className="rounded-lg bg-white border border-gray-100 p-3">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
        <Icon className="h-3 w-3" /> {label}
      </p>
      <span
        className={`mt-1.5 inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${
          badgeClass || 'bg-gray-100 text-gray-700'
        }`}
      >
        {value}
      </span>
    </div>
  );
}
