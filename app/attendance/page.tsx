import Link from 'next/link';

export default function AttendanceLookupPage() {
  return (
    <main className="page page--top">
      <section className="card card--wide">
        <h1>ClassPilot Attendance</h1>
        <p className="muted">
          Load a class roster and mark attendance in bulk. Your selections are saved to Supabase.
        </p>
        <form className="form" action="/attendance/mark" method="get">
          <label>
            Class ID
            <input name="class_id" type="text" placeholder="UUID" required />
          </label>
          <label>
            Attendance date
            <input name="date" type="date" required />
          </label>
          <button className="primary" type="submit">
            Open attendance
          </button>
        </form>
        <p className="helper">
          Need to authenticate? <Link href="/">Go back to the dashboard.</Link>
        </p>
      </section>
    </main>
  );
}
