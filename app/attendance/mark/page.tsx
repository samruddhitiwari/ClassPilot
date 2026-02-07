'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { supabase } from '../../../lib/supabaseClient';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

interface Student {
  id: string;
  full_name: string;
  email: string | null;
}

const statusOptions: AttendanceStatus[] = ['present', 'absent', 'late', 'excused'];

export default function AttendanceMarkPage() {
  const searchParams = useSearchParams();
  const [classId, setClassId] = useState(searchParams.get('class_id') ?? '');
  const [date, setDate] = useState(searchParams.get('date') ?? '');
  const [notes, setNotes] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [statusMessage, setStatusMessage] = useState('Provide a class ID and date to load the roster.');
  const [statusTone, setStatusTone] = useState<'muted' | 'success' | 'warning' | 'error'>('muted');
  const hasAutoLoaded = useRef(false);

  const studentsCount = students.length;
  const rosterVisible = studentsCount > 0;

  const setStatus = useCallback(
    (message: string, tone: 'muted' | 'success' | 'warning' | 'error' = 'muted') => {
      setStatusMessage(message);
      setStatusTone(tone);
    },
    []
  );

  const loadRoster = useCallback(async () => {
    const trimmedClassId = classId.trim();
    const trimmedDate = date.trim();
    if (!trimmedClassId || !trimmedDate) {
      setStatus('Provide a class ID and date to load the roster.', 'warning');
      return;
    }

    setStatus('Loading roster...');
    const { data, error } = await supabase
      .from('students')
      .select('id, full_name, email')
      .eq('class_id', trimmedClassId)
      .order('full_name', { ascending: true });

    if (error) {
      setStatus(`Failed to load roster: ${error.message}`, 'error');
      return;
    }

    const roster = data ?? [];
    setStudents(roster);
    const nextStatuses: Record<string, AttendanceStatus> = {};
    roster.forEach((student) => {
      nextStatuses[student.id] = 'present';
    });
    setStatuses(nextStatuses);
    setStatus(`Loaded ${roster.length} students.`, 'success');
  }, [classId, date, setStatus]);

  const bulkSet = useCallback(
    (status: AttendanceStatus) => {
      if (!students.length) {
        setStatus('Load a roster first.', 'warning');
        return;
      }
      const nextStatuses: Record<string, AttendanceStatus> = {};
      students.forEach((student) => {
        nextStatuses[student.id] = status;
      });
      setStatuses(nextStatuses);
      setStatus(`Marked ${students.length} students as ${status}.`, 'success');
    },
    [students, setStatus]
  );

  const saveAttendance = useCallback(async () => {
    if (!students.length) {
      setStatus('Load a roster first.', 'warning');
      return;
    }

    const trimmedClassId = classId.trim();
    const trimmedDate = date.trim();
    if (!trimmedClassId || !trimmedDate) {
      setStatus('Provide a class ID and date before saving.', 'warning');
      return;
    }

    const payload = students.map((student) => ({
      class_id: trimmedClassId,
      student_id: student.id,
      attendance_date: trimmedDate,
      status: statuses[student.id] ?? 'present',
      notes: notes.trim() || null
    }));

    setStatus('Saving attendance...');
    const { error } = await supabase
      .from('attendance')
      .upsert(payload, { onConflict: 'student_id,attendance_date' });

    if (error) {
      setStatus(`Failed to save attendance: ${error.message}`, 'error');
      return;
    }

    setStatus('Attendance saved successfully.', 'success');
  }, [classId, date, notes, statuses, students, setStatus]);

  useEffect(() => {
    if (!hasAutoLoaded.current && classId && date) {
      hasAutoLoaded.current = true;
      loadRoster();
    }
  }, [classId, date, loadRoster]);

  const studentRows = useMemo(
    () =>
      students.map((student) => (
        <div className="student-row" key={student.id}>
          <div className="student-name">
            <strong>{student.full_name}</strong>
            <span>{student.email ?? ''}</span>
          </div>
          <select
            name={`status-${student.id}`}
            value={statuses[student.id] ?? 'present'}
            onChange={(event) =>
              setStatuses((prev) => ({
                ...prev,
                [student.id]: event.target.value as AttendanceStatus
              }))
            }
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )),
    [students, statuses]
  );

  return (
    <main className="page page--top">
      <section className="card card--wide">
        <div className="header">
          <div>
            <h1>Mark attendance</h1>
            <p className="muted">Bulk mark present or absent, then save.</p>
          </div>
          <Link className="link" href="/attendance">
            Back to class lookup
          </Link>
        </div>
        <form
          className="form"
          autoComplete="off"
          onSubmit={(event) => {
            event.preventDefault();
            loadRoster();
          }}
        >
          <label>
            Class ID
            <input
              name="class_id"
              type="text"
              placeholder="UUID"
              required
              value={classId}
              onChange={(event) => setClassId(event.target.value)}
            />
          </label>
          <label>
            Attendance date
            <input
              name="date"
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
          <label>
            Notes (optional)
            <input
              name="notes"
              type="text"
              placeholder="Shared note for this session"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>
          <button className="primary" type="submit">
            Load roster
          </button>
        </form>
        <div className={`status ${statusTone}`} role="status">
          {statusMessage}
        </div>
        {rosterVisible ? (
          <section className="roster">
            <div className="toolbar">
              <div className="toolbar-actions">
                <button type="button" onClick={() => bulkSet('present')}>
                  Mark all present
                </button>
                <button type="button" onClick={() => bulkSet('absent')}>
                  Mark all absent
                </button>
              </div>
              <button className="primary" type="button" onClick={saveAttendance}>
                Save attendance
              </button>
            </div>
            <div className="students">{studentRows}</div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
