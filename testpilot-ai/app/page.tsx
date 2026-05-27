import FeatureCard from "@/components/FeatureCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LandingHero from "@/components/LandingHero";

const features = [
  {
    icon: "📋",
    title: "Structured test cases",
    description:
      "Get ID, title, preconditions, steps, expected results, and priority for every case.",
  },
  {
    icon: "➕",
    title: "Positive & negative paths",
    description:
      "Happy path, validation failures, auth blocks, and network errors in one run.",
  },
  {
    icon: "🔀",
    title: "Edge case coverage",
    description:
      "Boundaries, concurrency, and special characters — often missed in manual drafting.",
  },
  {
    icon: "🤖",
    title: "Automation hints",
    description:
      "Playwright, API collections, and CI suggestions to speed up SDET workflows.",
  },
  {
    icon: "🔄",
    title: "Regression checklist",
    description: "Smoke and regression items tied to your application type.",
  },
  {
    icon: "📤",
    title: "Export ready",
    description: "Copy, print, or download as text — Excel/PDF in Phase 3.",
  },
];

const steps = [
  {
    step: "1",
    title: "Paste your story",
    desc: "Add user story and acceptance criteria from Jira, Confluence, or docs.",
  },
  {
    step: "2",
    title: "Choose context",
    desc: "Select app type, testing type, and default priority.",
  },
  {
    step: "3",
    title: "Generate & export",
    desc: "Review structured cases, then copy or download for your test repo.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4">
          <LandingHero />

          <section id="features" className="py-16">
            <h2 className="text-center text-2xl font-bold text-slate-900">
              Features
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-500">
              Everything QA teams need for a fast first draft — refine before
              baseline.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </div>
          </section>

          <section id="how-it-works" className="border-t border-slate-200 py-16">
            <h2 className="text-center text-2xl font-bold text-slate-900">
              How it works
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {steps.map((s) => (
                <div key={s.step} className="text-center">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-pilot-600 text-lg font-bold text-white">
                    {s.step}
                  </span>
                  <h3 className="mt-4 font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
