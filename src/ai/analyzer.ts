import type { AIAnalysis, Category, Priority, Urgency, Sentiment } from '@/types';

interface Rule {
  keywords: string[];
  category: Category;
  weight: number;
}

const CATEGORY_RULES: Rule[] = [
  {
    category: 'Billing',
    keywords: ['payment', 'invoice', 'charge', 'charged', 'billing', 'refund', 'subscription', 'plan', 'priced', 'price', 'credit card', 'charged twice', 'double charged', 'prorated', 'payment failed'],
    weight: 2,
  },
  {
    category: 'Product Defect',
    keywords: ['crash', 'crashes', 'bug', 'broken', 'disappear', 'disappears', 'defect', 'error', 'freeze', 'freezes', 'not working', 'stopped working', 'not saving', 'glitch', 'regression'],
    weight: 2,
  },
  {
    category: 'Technical Issue',
    keywords: ['api', 'rate limit', 'sso', 'okta', 'saml', 'integration', 'server', 'migration', 'reset', 'password', 'login', 'log in', 'access', 'cannot access', "can't access", 'locked out', 'authentication', 'timeout', 'connection'],
    weight: 2,
  },
  {
    category: 'General Question',
    keywords: ['how do i', 'how to', 'question', 'help', 'where', 'tutorial', 'guide', 'feedback', 'suggestion', 'shortcut', 'invite', 'add a', 'add team', 'workspace'],
    weight: 1,
  },
];

const URGENCY_KEYWORDS: { keywords: string[]; urgency: Urgency }[] = [
  { keywords: ['urgent', 'asap', 'immediately', 'critical', 'emergency', 'right now', 'need this now', 'locked out', 'cannot access', "can't access", 'nobody', 'entire team', 'production', 'blocking'], urgency: 'Immediate' },
  { keywords: ['tomorrow', 'as soon as possible', 'quickly', 'please help', 'need to', 'important', 'client meeting', 'demo'], urgency: 'High' },
  { keywords: ['no rush', 'when you can', 'quick question', 'appreciate'], urgency: 'Low' },
];

const SENTIMENT_KEYWORDS: { keywords: string[]; sentiment: Sentiment }[] = [
  { keywords: ['unacceptable', 'ridiculous', 'angry', 'furious', 'terrible', 'horrible', 'worst', 'furious'], sentiment: 'Angry' },
  { keywords: ['frustrated', 'annoying', 'disappointed', 'not happy', 'issue', 'problem', 'broken', 'crash', 'blocking', 'can no longer'], sentiment: 'Frustrated' },
  { keywords: ['worried', 'anxious', 'concerned', 'need this', 'urgent', 'please help', 'scared'], sentiment: 'Anxious' },
  { keywords: ['love', 'loving', 'great', 'fantastic', 'amazing', 'wonderful', 'excellent', 'thank you', 'thanks'], sentiment: 'Positive' },
];

const TEAM_MAP: Record<Category, string> = {
  Billing: 'Billing & Accounts Team',
  'Technical Issue': 'Technical Support Team',
  'Product Defect': 'Engineering / QA Team',
  'General Question': 'Customer Success Team',
};

function matchCategory(message: string, subject: string): { category: Category; scores: Record<Category, number> } {
  const text = `${subject} ${message}`.toLowerCase();
  const scores: Record<Category, number> = {
    Billing: 0,
    'Technical Issue': 0,
    'Product Defect': 0,
    'General Question': 0,
  };

  for (const rule of CATEGORY_RULES) {
    for (const kw of rule.keywords) {
      if (text.includes(kw)) {
        scores[rule.category] += rule.weight;
      }
    }
  }

  let best: Category = 'General Question';
  let bestScore = 0;
  (Object.keys(scores) as Category[]).forEach((cat) => {
    if (scores[cat] > bestScore) {
      bestScore = scores[cat];
      best = cat;
    }
  });

  if (bestScore === 0) best = 'General Question';
  return { category: best, scores };
}

function matchUrgency(message: string, subject: string): Urgency {
  const text = `${subject} ${message}`.toLowerCase();
  for (const { keywords, urgency } of URGENCY_KEYWORDS) {
    for (const kw of keywords) {
      if (text.includes(kw)) return urgency;
    }
  }
  return 'Normal';
}

function matchSentiment(message: string): Sentiment {
  const text = message.toLowerCase();
  for (const { keywords, sentiment } of SENTIMENT_KEYWORDS) {
    for (const kw of keywords) {
      if (text.includes(kw)) return sentiment;
    }
  }
  return 'Neutral';
}

function urgencyToPriority(urgency: Urgency, category: Category): Priority {
  if (urgency === 'Immediate') return 'Critical';
  if (urgency === 'High') return 'High';
  if (urgency === 'Low') return 'Low';
  if (category === 'Product Defect' || category === 'Billing') return 'Medium';
  return 'Medium';
}

function generateReply(
  customerName: string,
  category: Category,
  priority: Priority,
  sentiment: Sentiment,
  needsHumanReview: boolean,
): string {
  const name = customerName.split(' ')[0] || 'there';
  const greeting = `Hi ${name},\n\n`;

  if (needsHumanReview) {
    return (
      greeting +
      `Thank you for reaching out. I can see this is an urgent matter, and I want to make sure ` +
      `it gets the right attention immediately. I've escalated this to our ${TEAM_MAP[category]} ` +
      `and a specialist will review your case and follow up with you directly as a priority.\n\n` +
      `Please note: I'm not able to process account changes, payments, or refunds automatically — ` +
      `a human agent will verify and handle this for you. We appreciate your patience while we ` +
      `review this carefully.\n\n` +
      `Best regards,\nSupport Team`
    );
  }

  if (category === 'General Question') {
    return (
      greeting +
      `Thanks for reaching out! Here's a quick answer to get you going:\n\n` +
      `To add a new team member, go to **Settings > Team & Members > Invite Member**, ` +
      `enter their email address, and select their role. They'll receive an invitation ` +
      `email to join your workspace.\n\n` +
      `If you have any other questions, feel free to ask. We're here to help!\n\n` +
      `Best regards,\nSupport Team`
    );
  }

  const empathy =
    sentiment === 'Angry' || sentiment === 'Frustrated'
      ? `I understand this is frustrating, and I'm sorry for the inconvenience this has caused. `
      : sentiment === 'Anxious'
        ? `I understand this is important to you, and we'll do our best to help quickly. `
        : '';

  return (
    greeting +
    `Thank you for contacting us about this ${category.toLowerCase()} issue. ${empathy}` +
    `I've reviewed your request and routed it to our ${TEAM_MAP[category]}. ` +
    `Here's what we can do next:\n\n` +
    `• Our team will investigate the details you provided\n` +
    `• You'll receive an update within one business day\n` +
    `• If we need additional information, we'll reach out via this thread\n\n` +
    `Please note: any account, billing, or access changes will be verified and processed by ` +
    `a human agent — no automated changes will be made without confirmation.\n\n` +
    `Best regards,\nSupport Team`
  );
}

function buildReasoning(
  category: Category,
  scores: Record<Category, number>,
  urgency: Urgency,
  sentiment: Sentiment,
  message: string,
  subject: string,
): string {
  const text = `${subject} ${message}`.toLowerCase();
  const matchedKeywords: string[] = [];

  for (const rule of CATEGORY_RULES) {
    if (rule.category !== category) continue;
    for (const kw of rule.keywords) {
      if (text.includes(kw) && !matchedKeywords.includes(kw)) {
        matchedKeywords.push(kw);
      }
    }
  }

  const keywordStr = matchedKeywords.slice(0, 5).map((k) => `"${k}"`).join(', ');

  let reason = `Classified as ${category} based on keyword signals: ${keywordStr || 'general phrasing'}. ` +
    `Category confidence score: ${scores[category]}. ` +
    `Urgency assessed as ${urgency.toLowerCase()} based on language cues. ` +
    `Customer sentiment appears ${sentiment.toLowerCase()}.`;

  return reason;
}

export function analyzeMessage(
  message: string,
  subject: string,
  customerName: string,
): AIAnalysis {
  const { category, scores } = matchCategory(message, subject);
  const urgency = matchUrgency(message, subject);
  const sentiment = matchSentiment(message);
  const priority = urgencyToPriority(urgency, category);

  const needsHumanReview =
    priority === 'Critical' ||
    (category === 'Billing' && (urgency === 'Immediate' || urgency === 'High')) ||
    /refund|charge|payment|account change|delete.*account|cancel/i.test(message);

  const humanReviewReason = needsHumanReview
    ? priority === 'Critical'
      ? 'Critical priority detected — requires immediate human review and verification.'
      : category === 'Billing'
        ? 'Billing/payment matters require human verification before any action is taken.'
        : 'Potential account-changing action detected — must be verified by a human agent.'
    : undefined;

  const suggestedReply = generateReply(customerName, category, priority, sentiment, needsHumanReview);
  const reasoning = buildReasoning(category, scores, urgency, sentiment, message, subject);

  return {
    category,
    priority,
    urgency,
    sentiment,
    reasoning,
    recommendedTeam: TEAM_MAP[category],
    suggestedReply,
    needsHumanReview,
    humanReviewReason,
  };
}
