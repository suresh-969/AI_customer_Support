import { LifeBuoy, Brain, AlertTriangle, Shield, Zap, Database } from 'lucide-react';

export function About() {
  return (
    <div className="mx-auto w-full max-w-3xl overflow-y-auto p-6">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
          <LifeBuoy className="h-4 w-4" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">About This Prototype</h2>
      </div>

      <div className="mt-5 space-y-4">
        <Card icon={Brain} title="What TriageAI Does">
          TriageAI helps support engineers handle the large volume of incoming email and chat
          requests by automatically classifying each ticket, assessing its urgency and customer
          sentiment, routing it to the right team, and drafting a suggested reply — so engineers
          can focus on solving problems instead of triaging.
        </Card>

        <Card icon={Zap} title="How AI Is Used">
          Each request is analyzed for category (Billing, Technical, Product Defect, or General
          Question), priority level, urgency, and customer sentiment. The AI generates a
          context-aware suggested reply that the engineer can edit, copy, and send. The analysis
          also recommends which support team should handle the ticket.
        </Card>

        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-bold text-amber-800">AI Limitations</p>
            <p className="mt-1 text-sm leading-relaxed text-amber-700">
              This is a prototype with a local rule-based AI simulation — no machine learning model
              is involved. The analysis is based on keyword matching and heuristics. It will never
              process refunds, payments, or account changes automatically. Critical issues and
              billing matters always require human review and verification.
            </p>
          </div>
        </div>

        <Card icon={Database} title="How to Productionize">
          <ul className="mt-1 space-y-1.5 text-sm text-gray-600">
            <li>• Replace the rule-based engine with an LLM API (e.g., OpenAI GPT-4) for richer classification and reply generation</li>
            <li>• Connect real email/chat ingestion via webhooks (Gmail API, Intercom, Zendesk)</li>
            <li>• Persist tickets in a database with full audit trails and agent assignment</li>
            <li>• Add authentication and role-based access for support engineers and managers</li>
            <li>• Implement feedback loops: track which suggested replies were used to improve accuracy</li>
            <li>• Add SLA timers, escalation rules, and integration with ticketing systems (Jira, Linear)</li>
          </ul>
        </Card>

        <Card icon={Shield} title="Data & Privacy">
          In this prototype, all ticket data is stored locally in your browser. No information
          is sent to any server. In a production deployment, customer data would be encrypted,
          access-controlled, and processed in compliance with data protection regulations.
        </Card>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, children }: { icon: typeof Brain; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="flex items-center gap-2 text-sm font-bold text-gray-900">
        <Icon className="h-4 w-4 text-blue-600" /> {title}
      </p>
      <div className="mt-1.5 text-sm leading-relaxed text-gray-600">{children}</div>
    </div>
  );
}
