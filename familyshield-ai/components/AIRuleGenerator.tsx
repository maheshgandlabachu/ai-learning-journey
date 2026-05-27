"use client";

import { useState } from "react";
import PlatformSupportBadge from "@/components/PlatformSupportBadge";
import { generatePlan } from "@/lib/generate-plan";
import { platformFromDeviceType } from "@/lib/platform";
import type { GeneratedPlan } from "@/lib/types";

const DEVICE_OPTIONS = [
  "Android Phone",
  "iPhone/iPad",
  "Windows PC",
  "Router/Wi-Fi",
];

const GOAL_OPTIONS = [
  "Block app/website",
  "Limit time",
  "Bedtime schedule",
  "Homework focus mode",
  "Monitor usage",
];

function planToText(plan: GeneratedPlan, childAge: number, appWebsite: string): string {
  return [
    "FamilyShield AI — Safe Family Plan",
    "================================",
    "",
    `Summary: ${plan.summary}`,
    "",
    `Recommended rule: ${plan.recommendedRule}`,
    "",
    `Schedule: ${plan.schedule}`,
    "",
    "Step-by-step setup:",
    ...plan.setupSteps.map((s, i) => `${i + 1}. ${s}`),
    "",
    "Safety notes:",
    ...plan.safetyNotes.map((s) => `• ${s}`),
    "",
    "Parent talking points:",
    ...plan.parentTalkingPoints.map((s) => `• ${s}`),
    "",
    `Platform: ${plan.platformNote}`,
    "",
    `Generated for age ${childAge}, target: ${appWebsite}`,
    "This is general guidance — use official device parental controls too.",
  ].join("\n");
}

/** Mock AI form — Phase 3 will call a real API */
export default function AIRuleGenerator() {
  const [childAge, setChildAge] = useState(10);
  const [deviceType, setDeviceType] = useState(DEVICE_OPTIONS[0]);
  const [appWebsite, setAppWebsite] = useState("YouTube");
  const [concern, setConcern] = useState("");
  const [goal, setGoal] = useState(GOAL_OPTIONS[0]);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [copied, setCopied] = useState(false);

  const platform = platformFromDeviceType(deviceType);

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    const result = generatePlan({
      childAge,
      deviceType,
      appWebsite,
      concern,
      goal,
    });
    setPlan(result);
    setCopied(false);
  }

  async function handleCopy() {
    if (!plan) return;
    const text = planToText(plan, childAge, appWebsite);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleGenerate}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-bold text-slate-900">AI Rule Generator</h2>
        <p className="mt-1 text-sm text-slate-500">
          Mock AI for Phase 1 — generates a safe family plan from your inputs.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Child age</span>
            <input
              type="number"
              min={3}
              max={18}
              value={childAge}
              onChange={(e) => setChildAge(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-700">Device type</span>
            <select
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            >
              {DEVICE_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm sm:col-span-2">
            <span className="font-medium text-slate-700">App / website</span>
            <input
              type="text"
              value={appWebsite}
              onChange={(e) => setAppWebsite(e.target.value)}
              placeholder="YouTube, Roblox, TikTok…"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>

          <label className="block text-sm sm:col-span-2">
            <span className="font-medium text-slate-700">Goal</span>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            >
              {GOAL_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm sm:col-span-2">
            <span className="font-medium text-slate-700">Parent concern</span>
            <textarea
              value={concern}
              onChange={(e) => setConcern(e.target.value)}
              rows={3}
              placeholder="e.g. stays up late watching videos…"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
        </div>

        <div className="mt-4">
          <PlatformSupportBadge platform={platform} />
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700 sm:w-auto sm:px-8"
        >
          Generate Safe Family Plan
        </button>
      </form>

      {plan && (
        <div
          id="generated-plan"
          className="print-plan rounded-2xl border border-brand-200 bg-gradient-to-b from-brand-50 to-white p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
            <h2 className="text-lg font-bold text-slate-900">Your plan</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
              >
                {copied ? "Copied!" : "Copy plan"}
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                Print plan
              </button>
            </div>
          </div>

          <section className="mt-4 space-y-6 text-sm text-slate-700">
            <div>
              <h3 className="font-semibold text-slate-900">Summary</h3>
              <p className="mt-1">{plan.summary}</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Recommended rule</h3>
              <p className="mt-1">{plan.recommendedRule}</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Schedule</h3>
              <p className="mt-1">{plan.schedule}</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Setup guide</h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                {plan.setupSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Safety notes</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {plan.safetyNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Parent talking points</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {plan.parentTalkingPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Platform limitation</h3>
              <p className="mt-1">{plan.platformNote}</p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
