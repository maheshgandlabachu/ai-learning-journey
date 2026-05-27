"use client";

import TestCaseCard from "@/components/TestCaseCard";
import { suiteToPlainText } from "@/lib/generateMockTestCases";
import type { GeneratedTestSuite } from "@/lib/types";
import { useState } from "react";

interface Props {
  suite: GeneratedTestSuite;
}

function BulletList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="font-bold text-slate-900">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/** Displays generated suite + Copy / Print / Download actions */
export default function TestCaseOutput({ suite }: Props) {
  const [copied, setCopied] = useState(false);

  const plainText = suiteToPlainText(suite);

  async function handleCopy() {
    await navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrint() {
    window.print();
  }

  function handleDownload() {
    const blob = new Blob([plainText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `testpilot-test-cases-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div id="test-output" className="print-output space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <h2 className="text-xl font-bold text-slate-900">Generated output</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            {copied ? "Copied!" : "Copy output"}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Print output
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-lg bg-pilot-600 px-4 py-2 text-sm font-medium text-white hover:bg-pilot-700"
          >
            Download as text file
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-pilot-200 bg-pilot-50 p-4">
        <h3 className="font-semibold text-slate-900">Summary</h3>
        <p className="mt-2 text-sm text-slate-700">{suite.summary}</p>
      </div>

      <section>
        <h3 className="mb-3 font-bold text-emerald-800">
          Positive test cases ({suite.positiveTestCases.length})
        </h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {suite.positiveTestCases.map((tc) => (
            <TestCaseCard key={tc.id} testCase={tc} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-bold text-rose-800">
          Negative test cases ({suite.negativeTestCases.length})
        </h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {suite.negativeTestCases.map((tc) => (
            <TestCaseCard key={tc.id} testCase={tc} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-bold text-amber-800">
          Edge cases ({suite.edgeCases.length})
        </h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {suite.edgeCases.map((tc) => (
            <TestCaseCard key={tc.id} testCase={tc} />
          ))}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <BulletList title="Regression checklist" items={suite.regressionChecklist} />
        <BulletList title="API validation ideas" items={suite.apiValidationIdeas} />
        <BulletList
          title="Automation suggestions"
          items={suite.automationSuggestions}
        />
        <BulletList title="Risk notes" items={suite.riskNotes} />
      </div>
    </div>
  );
}
