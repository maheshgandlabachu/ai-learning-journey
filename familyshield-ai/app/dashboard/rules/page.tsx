"use client";

import RuleCard from "@/components/RuleCard";
import Header from "@/components/Header";
import { RULE_TYPE_LABELS, useFamilyShield } from "@/lib/FamilyShieldContext";
import type { RuleType } from "@/lib/types";
import { useState } from "react";

export default function RulesPage() {
  const { children, devices, rules, addRule } = useFamilyShield();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    childId: children[0]?.id ?? "",
    deviceId: devices[0]?.id ?? "",
    title: "",
    type: "limit_time" as RuleType,
    target: "",
    schedule: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.childId || !form.deviceId) return;
    addRule({
      childId: form.childId,
      deviceId: form.deviceId,
      title: form.title,
      type: form.type,
      target: form.target,
      schedule: form.schedule,
    });
    setForm({ ...form, title: "", target: "", schedule: "" });
    setShowForm(false);
  }

  return (
    <>
      <Header title="Rules" subtitle="Create mock parental control rules" />
      <div className="flex-1 space-y-6 p-4 sm:p-6">
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {showForm ? "Cancel" : "+ Create rule"}
        </button>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <h2 className="font-bold">New rule</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                Child
                <select
                  value={form.childId}
                  onChange={(e) => {
                    const childId = e.target.value;
                    const dev = devices.find((d) => d.childId === childId);
                    setForm({
                      ...form,
                      childId,
                      deviceId: dev?.id ?? form.deviceId,
                    });
                  }}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                >
                  {children.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                Device
                <select
                  value={form.deviceId}
                  onChange={(e) =>
                    setForm({ ...form, deviceId: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                >
                  {devices
                    .filter((d) => d.childId === form.childId)
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                </select>
              </label>
              <label className="text-sm sm:col-span-2">
                Rule title
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                />
              </label>
              <label className="text-sm">
                Type
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as RuleType })
                  }
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                >
                  {(Object.keys(RULE_TYPE_LABELS) as RuleType[]).map((t) => (
                    <option key={t} value={t}>
                      {RULE_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                App / website
                <input
                  value={form.target}
                  onChange={(e) =>
                    setForm({ ...form, target: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                />
              </label>
              <label className="text-sm sm:col-span-2">
                Schedule
                <input
                  value={form.schedule}
                  onChange={(e) =>
                    setForm({ ...form, schedule: e.target.value })
                  }
                  placeholder="e.g. Daily 60 min"
                  className="mt-1 w-full rounded-xl border px-3 py-2"
                />
              </label>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              iOS block rules may show &quot;Not supported&quot; — mock platform
              behavior.
            </p>
            <button
              type="submit"
              className="mt-4 rounded-xl bg-brand-600 px-6 py-2 text-sm font-semibold text-white"
            >
              Save rule
            </button>
          </form>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {rules.map((rule) => {
            const child = children.find((c) => c.id === rule.childId);
            const device = devices.find((d) => d.id === rule.deviceId);
            return (
              <RuleCard
                key={rule.id}
                rule={rule}
                childName={child?.name}
                deviceName={device?.name}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
