import type { TestCase } from "@/lib/types";

const priorityColors = {
  High: "bg-rose-100 text-rose-800",
  Medium: "bg-amber-100 text-amber-800",
  Low: "bg-slate-100 text-slate-700",
};

/** Single test case card — used inside TestCaseOutput */
export default function TestCaseCard({ testCase }: { testCase: TestCase }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-xs text-pilot-700">{testCase.id}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${priorityColors[testCase.priority]}`}
        >
          {testCase.priority}
        </span>
      </div>
      <h4 className="mt-2 font-semibold text-slate-900">{testCase.title}</h4>
      <p className="mt-2 text-sm text-slate-600">
        <span className="font-medium text-slate-700">Preconditions:</span>{" "}
        {testCase.preconditions}
      </p>
      <div className="mt-2 text-sm text-slate-600">
        <span className="font-medium text-slate-700">Steps:</span>
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          {testCase.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
      <p className="mt-2 text-sm text-slate-600">
        <span className="font-medium text-slate-700">Expected:</span>{" "}
        {testCase.expectedResult}
      </p>
    </article>
  );
}
