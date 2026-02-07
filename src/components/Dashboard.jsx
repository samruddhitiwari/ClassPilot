const stats = [
  {
    label: "Total Students",
    value: "1,248",
    change: "+6.3%",
    helper: "since last term",
  },
  {
    label: "Active Classes",
    value: "42",
    change: "+2",
    helper: "this semester",
  },
  {
    label: "Attendance Rate",
    value: "96%",
    change: "+1.2%",
    helper: "past 30 days",
  },
];

const unpaidFees = [
  {
    name: "Grade 8B Field Trip",
    amount: "$1,240",
    due: "Oct 10",
    status: "Overdue",
  },
  {
    name: "Library Fees",
    amount: "$640",
    due: "Oct 18",
    status: "Due soon",
  },
  {
    name: "Lab Materials",
    amount: "$480",
    due: "Oct 25",
    status: "Upcoming",
  },
];

const quickLinks = [
  {
    title: "Create Invoice",
    description: "Send fees to guardians in one click.",
  },
  {
    title: "Attendance Report",
    description: "Download CSV for the last 30 days.",
  },
  {
    title: "Message Guardians",
    description: "Broadcast important announcements.",
  },
  {
    title: "Schedule Review",
    description: "Plan parent-teacher meetings.",
  },
];

const statusStyles = {
  Overdue: "bg-rose-50 text-rose-600",
  "Due soon": "bg-amber-50 text-amber-600",
  Upcoming: "bg-slate-100 text-slate-600",
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              ClassPilot Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              Welcome back, Principal Rivera
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-500">
              Track totals, monitor unpaid fees, and jump into key workflows with
              a tailored view of your school operations.
            </p>
          </div>
          <button className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800">
            Download Snapshot
          </button>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <div className="mt-4 flex items-end justify-between">
                <span className="text-3xl font-semibold text-slate-900">
                  {stat.value}
                </span>
                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                  {stat.change}
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-400">{stat.helper}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Unpaid Fees
                </h2>
                <p className="text-sm text-slate-500">
                  Keep tabs on pending payments and due dates.
                </p>
              </div>
              <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900">
                Send Reminder
              </button>
            </div>
            <div className="mt-6 space-y-4">
              {unpaidFees.map((fee) => (
                <div
                  key={fee.name}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {fee.name}
                    </p>
                    <p className="text-xs text-slate-500">Due {fee.due}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-800">
                      {fee.amount}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyles[fee.status]
                      }`}
                    >
                      {fee.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Quick Links</h2>
                <p className="text-sm text-slate-500">
                  Jump directly into your most-used actions.
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                4 Shortcuts
              </span>
            </div>
            <div className="mt-6 grid gap-4">
              {quickLinks.map((link) => (
                <button
                  key={link.title}
                  className="group flex items-start justify-between rounded-xl border border-slate-100 bg-white p-4 text-left transition hover:border-slate-200 hover:bg-slate-50"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {link.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {link.description}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-slate-400 transition group-hover:text-slate-700">
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
