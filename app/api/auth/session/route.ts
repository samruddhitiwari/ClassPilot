import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

  return NextResponse.json({
    user: {
      id: data.user.id,
      email: data.user.email
    },
    token: {
      accessToken: token,
      tokenType: 'bearer'
    }
  });
}
