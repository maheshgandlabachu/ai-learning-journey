import Link from "next/link";

/** Hero section on the landing page */
export default function LandingHero() {
  return (
    <section className="py-16 text-center md:py-24">
      <p className="text-sm font-semibold uppercase tracking-wide text-pilot-600">
        Phase 1 MVP
      </p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
        TestPilot AI
        <span className="mt-2 block text-xl font-semibold text-pilot-700 md:text-2xl">
          — by Mahesh Gandla Bachu
        </span>
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
        Generate smarter test cases from user stories in seconds.
      </p>
      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
        Built for QA engineers, SDETs, product owners, and startups — positive,
        negative, edge, and automation-ready output.
      </p>
      <Link
        href="/generator"
        className="mt-8 inline-block rounded-xl bg-pilot-600 px-8 py-3 text-lg font-semibold text-white shadow-lg hover:bg-pilot-700"
      >
        Start Generating Test Cases
      </Link>
    </section>
  );
}
