import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

import { getDodoSubscriptionByEmail } from '../../../lib/dodo';
import { getStudentLimit } from '../../../lib/subscription';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

type AddStudentRequest = {
  classId: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
};

const countStudentsForOwner = async (ownerId: string) => {
  const { data: classes, error: classesError } = await supabase
    .from('classes')
    .select('id')
    .eq('owner_id', ownerId);

  if (classesError) {
    return { count: null, error: classesError };
  }

  const classIds = (classes ?? []).map((entry) => entry.id);

  if (classIds.length === 0) {
    return { count: 0, error: null };
  }

  const { count, error: studentsError } = await supabase
    .from('students')
    .select('id', { count: 'exact', head: true })
    .in('class_id', classIds);

  if (studentsError) {
    return { count: null, error: studentsError };
  }

  return { count: count ?? 0, error: null };
};

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: 'Missing bearer token.' }, { status: 401 });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });
  }

  const payload = (await request.json()) as AddStudentRequest;

  if (!payload?.classId || !payload?.fullName) {
    return NextResponse.json({ error: 'Missing classId or fullName.' }, { status: 400 });
  }

  const { data: classData, error: classError } = await supabase
    .from('classes')
    .select('id')
    .eq('id', payload.classId)
    .eq('owner_id', data.user.id)
    .single();

  if (classError || !classData) {
    return NextResponse.json({ error: 'Class not found.' }, { status: 404 });
  }

  const subscription = await getDodoSubscriptionByEmail(data.user.email ?? data.user.id);
  const studentLimit = getStudentLimit(subscription);

  if (studentLimit !== null) {
    const { count, error: countError } = await countStudentsForOwner(data.user.id);

    if (countError || count === null) {
      return NextResponse.json({ error: 'Unable to verify student count.' }, { status: 500 });
    }

    if (count >= studentLimit) {
      return NextResponse.json(
        { error: 'Student limit reached.', studentLimit },
        { status: 403 }
      );
    }
  }

  const { data: student, error: insertError } = await supabase
    .from('students')
    .insert({
      class_id: payload.classId,
      full_name: payload.fullName,
      email: payload.email ?? null,
      phone: payload.phone ?? null
    })
    .select('id, class_id, full_name, email, phone')
    .single();

  if (insertError || !student) {
    return NextResponse.json({ error: 'Unable to add student.' }, { status: 500 });
  }

  return NextResponse.json({ student });
}
