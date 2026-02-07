export type DodoSubscriptionResult = {
  isPaid: boolean;
  planName: string;
  configured: boolean;
};

const DEFAULT_DODO_API_URL = 'https://api.dodopayments.com/v1';
const ACTIVE_STATUSES = new Set(['active', 'trialing', 'past_due']);

const normalizeStatus = (status: unknown) => {
  if (typeof status !== 'string') {
    return '';
  }
  return status.toLowerCase();
};

const getSubscriptionsList = (payload: any) => {
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  if (Array.isArray(payload?.subscriptions)) {
    return payload.subscriptions;
  }
  if (Array.isArray(payload?.items)) {
    return payload.items;
  }
  return [];
};

const getPlanName = (subscription: any) => {
  return (
    subscription?.plan?.name ??
    subscription?.product?.name ??
    subscription?.price?.name ??
    subscription?.name ??
    'Paid'
  );
};

export async function getDodoSubscriptionByEmail(email: string | null): Promise<DodoSubscriptionResult> {
  const apiKey = process.env.DODO_API_KEY;
  const apiUrl = process.env.DODO_API_URL ?? DEFAULT_DODO_API_URL;

  if (!apiKey || !email) {
    return {
      isPaid: false,
      planName: 'Free',
      configured: Boolean(apiKey)
    };
  }

  const url = new URL(`${apiUrl.replace(/\/$/, '')}/subscriptions`);
  url.searchParams.set('customer_email', email);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return {
        isPaid: false,
        planName: 'Free',
        configured: true
      };
    }

    const payload = await response.json();
    const subscriptions = getSubscriptionsList(payload);
    const activeSubscription = subscriptions.find((subscription: any) =>
      ACTIVE_STATUSES.has(normalizeStatus(subscription?.status))
    );

    if (!activeSubscription) {
      return {
        isPaid: false,
        planName: 'Free',
        configured: true
      };
    }

    return {
      isPaid: true,
      planName: getPlanName(activeSubscription),
      configured: true
    };
  } catch (error) {
    return {
      isPaid: false,
      planName: 'Free',
      configured: true
    };
  }
}
