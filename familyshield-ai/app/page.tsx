import Link from "next/link";
import PlatformSupportBadge from "@/components/PlatformSupportBadge";

const features = [
  {
    title: "AI rule plans",
    desc: "Describe your concern — get schedules, talking points, and setup steps.",
    icon: "✨",
  },
  {
    title: "Multi-device",
    desc: "Manage Android, iPhone/iPad, and Windows from one parent dashboard.",
    icon: "📱",
  },
  {
    title: "Clear platform limits",
    desc: "See what each OS can actually enforce before you set expectations.",
    icon: "🛡️",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-family-lavender/30">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <span className="text-xl font-bold text-brand-700">FamilyShield AI</span>
        <Link
          href="/dashboard"
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Open dashboard
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16">
        <section className="py-12 text-center md:py-20">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Phase 1 MVP
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            FamilyShield AI
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Help parents create safe screen-time and app-blocking plans for kids —
            based on age, device, and what matters to your family.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-xl bg-brand-600 px-8 py-3 font-semibold text-white shadow-lg hover:bg-brand-700"
            >
              Go to parent dashboard
            </Link>
            <Link
              href="/dashboard/ai-generator"
              className="rounded-xl border border-slate-200 bg-white px-8 py-3 font-semibold text-slate-800 hover:bg-slate-50"
            >
              Try AI generator
            </Link>
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-center text-2xl font-bold text-slate-900">Features</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="text-3xl" aria-hidden>
                  {f.icon}
                </span>
                <h3 className="mt-3 font-bold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-center text-2xl font-bold text-slate-900">
            Supported platforms
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-500">
            Child apps come in later phases. Today: parent web dashboard with mock
            controls.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <PlatformSupportBadge platform="android" />
            <PlatformSupportBadge platform="ios" />
            <PlatformSupportBadge platform="windows" />
            <PlatformSupportBadge platform="router" />
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <p className="mx-auto max-w-2xl px-4">
          This tool gives general guidance and does not replace official device
          parental-control settings.
        </p>
        <p className="mt-2">© FamilyShield AI · Learning project</p>
      </footer>
    </div>
  );
}
