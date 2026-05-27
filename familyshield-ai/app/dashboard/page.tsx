import DashboardStats from "@/components/DashboardStats";
import Header from "@/components/Header";
import Link from "next/link";

export default function DashboardOverviewPage() {
  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Overview of children, devices, and rules (mock data)"
      />
      <div className="flex-1 space-y-8 p-4 sm:p-6">
        <DashboardStats />

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-slate-900">Quick actions</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/dashboard/children"
              className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              Add child profile
            </Link>
            <Link
              href="/dashboard/devices"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Manage devices
            </Link>
            <Link
              href="/dashboard/ai-generator"
              className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-100"
            >
              Generate AI plan
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>Phase 1:</strong> Mock data only. No real device control, login, or
          payments yet. Rules show Active / Pending sync / Not supported per platform.
        </section>
      </div>
    </>
  );
}
