import type { Ticket } from '@/types';

const now = Date.now();
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export const sampleTickets: Ticket[] = [
  {
    id: 'tkt-001',
    customerName: 'Sarah Chen',
    email: 'sarah.chen@northwind.io',
    subject: 'URGENT: Payment failed — our entire team is locked out',
    message:
      'I just got an email saying our payment failed and now nobody on our team can log in. ' +
      'We have a critical demo in two hours and we NEED access right now. I already updated the ' +
      'card but nothing happened. This is unacceptable — please fix this immediately or call me ' +
      'at (415) 555-0182.',
    category: 'Billing',
    priority: 'Critical',
    status: 'Pending',
    createdAt: now - 12 * MIN,
  },
  {
    id: 'tkt-002',
    customerName: 'Marcus Rodriguez',
    email: 'm.rodriguez@brightpath.co',
    subject: 'Billing discrepancy on my October invoice',
    message:
      'Hello, I was reviewing my latest invoice and the amount charged ($1,450) does not match ' +
      'the plan price we agreed on ($1,200). I upgraded last month and was told the prorated ' +
      'difference would be credited. Can someone look into this and let me know? No rush, but ' +
      'I would appreciate a clear explanation. Thanks.',
    category: 'Billing',
    priority: 'Medium',
    status: 'Pending',
    createdAt: now - 3 * HOUR,
  },
  {
    id: 'tkt-003',
    customerName: 'Priya Sharma',
    email: 'priya@quantumlabs.dev',
    subject: 'Export to PDF crashes every time since v8.2 update',
    message:
      'After updating to version 8.2, the "Export to PDF" feature crashes the application ' +
      'consistently. I have tried it on three different files and the same crash dialog appears. ' +
      'This is a core workflow for us and our team can no longer generate client reports. ' +
      'Reproducible steps: open any project, go to File > Export > PDF, click Export, app ' +
      'freezes for 5 seconds then closes. Logs attached in the ticket.',
    category: 'Product Defect',
    priority: 'High',
    status: 'Pending',
    createdAt: now - 5 * HOUR,
  },
  {
    id: 'tkt-004',
    customerName: 'Tom O\'Brien',
    email: 'tom@hillcrest.com',
    subject: 'How do I add a new team member to my workspace?',
    message:
      'Hi there! I just signed up last week and I\'m loving the product so far. Quick question ' +
      '— how do I invite a new team member to my workspace? I looked around the settings but ' +
      'couldn\'t find the invite option. Thanks for the help!',
    category: 'General Question',
    priority: 'Low',
    status: 'Pending',
    createdAt: now - 8 * HOUR,
  },
  {
    id: 'tkt-005',
    customerName: 'Amelia Johnson',
    email: 'amelia.j@vertexcap.com',
    subject: 'API rate limit too low for our production environment',
    message:
      'We are hitting the API rate limit constantly since scaling up. Our current plan allows ' +
      '500 req/min but we need at least 2000. This is causing intermittent failures in our ' +
      'production pipeline. Is there a way to increase the limit, or do we need an enterprise ' +
      'plan? Please advise — this is affecting our customers.',
    category: 'Technical Issue',
    priority: 'High',
    status: 'Pending',
    createdAt: now - 2 * HOUR,
  },
  {
    id: 'tkt-006',
    customerName: 'David Kim',
    email: 'dkim@sumeria.ai',
    subject: 'Can\'t reset my password — reset link doesn\'t work',
    message:
      'I tried resetting my password three times but the link in the email always says ' +
      '"expired or invalid" even though I click it within a minute. I need to get into my ' +
      'account urgently for a client meeting tomorrow. Please help!',
    category: 'Technical Issue',
    priority: 'High',
    status: 'Pending',
    createdAt: now - 45 * MIN,
  },
  {
    id: 'tkt-007',
    customerName: 'Lisa Wang',
    email: 'lisa.wang@blueocean.org',
    subject: 'Dashboard widgets disappear after page refresh',
    message:
      'I set up my dashboard with 6 custom widgets but every time I refresh the page, only ' +
      '2 of them remain. The configuration seems to not be saving properly. I have tried ' +
      'different browsers (Chrome, Firefox) and the issue persists. It worked fine before ' +
      'the update last week.',
    category: 'Product Defect',
    priority: 'Medium',
    status: 'Pending',
    createdAt: now - 1 * DAY,
  },
  {
    id: 'tkt-008',
    customerName: 'James Foster',
    email: 'james@fosterco.com',
    subject: 'Double charged for my subscription this month',
    message:
      'I checked my credit card statement and I see two charges from your company on the ' +
      'same day — one for $89 and another for $89. I should only be charged once. I would ' +
      'like this investigated and the duplicate charge refunded. Thank you.',
    category: 'Billing',
    priority: 'High',
    status: 'Pending',
    createdAt: now - 6 * HOUR,
  },
  {
    id: 'tkt-009',
    customerName: 'Rachel Green',
    email: 'rachel.g@mediascale.io',
    subject: 'Great product, just wanted to share feedback',
    message:
      'Just wanted to say that the new dark mode feature is fantastic! My team loves it. ' +
      'One small suggestion — it would be great to have a keyboard shortcut to toggle it. ' +
      'Keep up the great work!',
    category: 'General Question',
    priority: 'Low',
    status: 'Pending',
    createdAt: now - 1.5 * DAY,
  },
  {
    id: 'tkt-010',
    customerName: 'Omar Hassan',
    email: 'omar@datalynx.tech',
    subject: 'SSO integration broken after server migration',
    message:
      'Our SSO integration with Okta stopped working after we migrated to new servers ' +
      'yesterday. Users get a "SAML response invalid" error. We followed the migration ' +
      'guide exactly. This is blocking 200+ employees from accessing the platform. We ' +
      'need this resolved ASAP.',
    category: 'Technical Issue',
    priority: 'Critical',
    status: 'Pending',
    createdAt: now - 25 * MIN,
  },
];
