import type { DashboardStats as Stats } from "@/lib/types";

const items = [
  { key: "totalGenerated", label: "Total test cases", color: "bg-pilot-50" },
  { key: "positiveCount", label: "Positive cases", color: "bg-emerald-50" },
  { key: "negativeCount", label: "Negative cases", color: "bg-rose-50" },
  { key: "edgeCount", label: "Edge cases", color: "bg-amber-50" },
  {
    key: "automationCandidates",
    label: "Automation candidates",
    color: "bg-violet-50",
  },
] as const;

interface Props {
  stats: Stats;
  title?: string;
}

/** Dashboard stat cards — mock preview after generation */
export default function DashboardStats({
  stats,
  title = "Generation stats",
}: Props) {
  return (
    <section>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((item) => (
          <div
            key={item.key}
            className={`rounded-xl border border-slate-200 p-4 ${item.color}`}
          >
            <p className="text-xs font-medium text-slate-600">{item.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {stats[item.key]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
