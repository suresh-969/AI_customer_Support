export type Category =
  | 'Billing'
  | 'Technical Issue'
  | 'Product Defect'
  | 'General Question';

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export type Status = 'Pending' | 'Resolved';

export interface Ticket {
  id: string;
  customerName: string;
  email: string;
  subject: string;
  message: string;
  category: Category;
  priority: Priority;
  status: Status;
  createdAt: number;
  suggestedReply?: string;
  editedReply?: string;
  aiAnalysis?: AIAnalysis;
}

export type Urgency = 'Immediate' | 'High' | 'Normal' | 'Low';
export type Sentiment = 'Angry' | 'Frustrated' | 'Neutral' | 'Positive' | 'Anxious';

export interface AIAnalysis {
  category: Category;
  priority: Priority;
  urgency: Urgency;
  sentiment: Sentiment;
  reasoning: string;
  recommendedTeam: string;
  suggestedReply: string;
  needsHumanReview: boolean;
  humanReviewReason?: string;
}
