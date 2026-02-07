import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

import { getDodoSubscriptionByEmail } from '../../../lib/dodo';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FREE_STUDENT_LIMIT = 30;

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: 'Missing bearer token.' }, { status: 401 });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });
  }

  const subscription = await getDodoSubscriptionByEmail(data.user.email ?? data.user.id);
  const studentLimit = subscription.isPaid ? null : FREE_STUDENT_LIMIT;

  return NextResponse.json({
    plan: subscription.planName,
    isPaid: subscription.isPaid,
    studentLimit,
    configured: subscription.configured
  });
}
