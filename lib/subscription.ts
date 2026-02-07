import type { DodoSubscriptionResult } from './dodo';

export const FREE_STUDENT_LIMIT = 30;

export type SubscriptionSummary = {
  plan: string;
  isPaid: boolean;
  studentLimit: number | null;
  configured: boolean;
};

export const getStudentLimit = (subscription: Pick<DodoSubscriptionResult, 'isPaid'>): number | null =>
  subscription.isPaid ? null : FREE_STUDENT_LIMIT;

export const buildSubscriptionSummary = (
  subscription: DodoSubscriptionResult
): SubscriptionSummary => ({
  plan: subscription.planName,
  isPaid: subscription.isPaid,
  studentLimit: getStudentLimit(subscription),
  configured: subscription.configured
});
