"use client";

import { useFamilyShield } from "@/lib/FamilyShieldContext";

const cards = [
  { key: "children", label: "Children", color: "bg-family-lavender" },
  { key: "devices", label: "Devices", color: "bg-family-mint" },
  { key: "rules", label: "Rules", color: "bg-family-peach" },
  { key: "active", label: "Active rules", color: "bg-brand-50" },
] as const;

export default function DashboardStats() {
  const { children, devices, rules } = useFamilyShield();
  const activeRules = rules.filter((r) => r.status === "active").length;

  const values: Record<string, number> = {
    children: children.length,
    devices: devices.length,
    rules: rules.length,
    active: activeRules,
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className={`rounded-2xl border border-slate-200 p-5 ${card.color}`}
        >
          <p className="text-sm font-medium text-slate-600">{card.label}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {values[card.key]}
          </p>
        </div>
      ))}
    </div>
  );
}
