"use client";

import type {
  ApplicationType,
  GeneratorFormInput,
  Priority,
  TestingType,
} from "@/lib/types";

const APP_TYPES: ApplicationType[] = [
  "Web App",
  "Mobile App",
  "API",
  "E-commerce",
  "Banking/Finance",
  "Healthcare",
  "SaaS",
];

const TESTING_TYPES: TestingType[] = [
  "Functional Testing",
  "Regression Testing",
  "API Testing",
  "UI Testing",
  "Negative Testing",
  "End-to-End Testing",
];

const PRIORITIES: Priority[] = ["High", "Medium", "Low"];

interface Props {
  onSubmit: (input: GeneratorFormInput) => void;
  loading?: boolean;
}

/** Main input form for test case generation */
export default function GeneratorForm({ onSubmit, loading }: Props) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    onSubmit({
      userStory: String(data.get("userStory") ?? ""),
      acceptanceCriteria: String(data.get("acceptanceCriteria") ?? ""),
      applicationType: data.get("applicationType") as ApplicationType,
      testingType: data.get("testingType") as TestingType,
      priority: data.get("priority") as Priority,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-slate-900">Test case generator</h2>
      <p className="mt-1 text-sm text-slate-500">
        Paste your user story and acceptance criteria — mock AI will structure
        test cases (Phase 1).
      </p>

      <div className="mt-6 space-y-4">
        <label className="block text-sm">
          <span className="font-medium text-slate-700">User story / requirement</span>
          <textarea
            name="userStory"
            required
            rows={4}
            defaultValue="As a registered user, I want to reset my password so that I can regain access to my account."
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-sm"
            placeholder="As a user, I want to..."
          />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700">Acceptance criteria</span>
          <textarea
            name="acceptanceCriteria"
            rows={4}
            defaultValue={`Given valid email, when user requests reset, then email is sent within 60s.\nGiven expired token, when user submits new password, then error is shown.`}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-sm"
            placeholder="Given... When... Then..."
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-sm">
            <span className="font-medium text-slate-700">Application type</span>
            <select
              name="applicationType"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            >
              {APP_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            <span className="font-medium text-slate-700">Testing type</span>
            <select
              name="testingType"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            >
              {TESTING_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            <span className="font-medium text-slate-700">Default priority</span>
            <select
              name="priority"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-pilot-600 py-3 font-semibold text-white hover:bg-pilot-700 disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {loading ? "Generating…" : "Generate Test Cases"}
      </button>
    </form>
  );
}
