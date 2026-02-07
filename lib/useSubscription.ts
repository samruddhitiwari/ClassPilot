'use client';

import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';

type SubscriptionData = {
  plan: string;
  isPaid: boolean;
  studentLimit: number | null;
  configured: boolean;
};

type UseSubscriptionResult = {
  subscription: SubscriptionData | null;
  loading: boolean;
  error: string | null;
};

export function useSubscription(session: Session | null): UseSubscriptionResult {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSubscription = async () => {
      if (!session?.access_token) {
        if (isMounted) {
          setSubscription(null);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch('/api/subscription', {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });

        if (!response.ok) {
          throw new Error('Unable to load subscription.');
        }

        const data = (await response.json()) as SubscriptionData;

        if (isMounted) {
          setSubscription(data);
          setError(null);
          setLoading(false);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError('Unable to load subscription status.');
          setLoading(false);
        }
      }
    };

    setLoading(true);
    loadSubscription();

    return () => {
      isMounted = false;
    };
  }, [session?.access_token]);

  return { subscription, loading, error };
}
