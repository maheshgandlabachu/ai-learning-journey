"use client";

import DashboardStats from "@/components/DashboardStats";
import Footer from "@/components/Footer";
import GeneratorForm from "@/components/GeneratorForm";
import Header from "@/components/Header";
import TestCaseOutput from "@/components/TestCaseOutput";
import {
  generateMockTestCases,
  statsFromSuite,
} from "@/lib/generateMockTestCases";
import type {
  DashboardStats as Stats,
  GeneratedTestSuite,
  GeneratorFormInput,
} from "@/lib/types";
import { useState } from "react";

/** Default mock stats before first generation */
const emptyStats: Stats = {
  totalGenerated: 0,
  positiveCount: 0,
  negativeCount: 0,
  edgeCount: 0,
  automationCandidates: 0,
};

export default function GeneratorPage() {
  const [suite, setSuite] = useState<GeneratedTestSuite | null>(null);
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [loading, setLoading] = useState(false);

  function handleGenerate(input: GeneratorFormInput) {
    setLoading(true);
    // Simulate brief AI delay for UX (remove when real API is added)
    setTimeout(() => {
      const result = generateMockTestCases(input);
      setSuite(result);
      setStats(statsFromSuite(result));
      setLoading(false);
    }, 600);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header showCta={false} />
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            TestPilot AI — by Mahesh Gandla Bachu
          </h1>
          <p className="text-sm text-slate-500">
            Generator · Mock AI Phase 1. No login, database, or Jira yet.
          </p>
        </div>

        <GeneratorForm onSubmit={handleGenerate} loading={loading} />

        <DashboardStats
          stats={stats}
          title={
            suite
              ? "Stats from last generation"
              : "Dashboard preview (generate to update)"
          }
        />

        {suite && <TestCaseOutput suite={suite} />}
      </main>
      <Footer />
    </div>
  );
}
