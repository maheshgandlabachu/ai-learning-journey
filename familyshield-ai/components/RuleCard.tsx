import { RULE_TYPE_LABELS } from "@/lib/FamilyShieldContext";
import type { Rule } from "@/lib/types";

const statusStyles = {
  active: "bg-emerald-100 text-emerald-800",
  pending_sync: "bg-amber-100 text-amber-800",
  not_supported: "bg-rose-100 text-rose-800",
};

const statusLabels = {
  active: "Active",
  pending_sync: "Pending sync",
  not_supported: "Not supported on this platform",
};

interface Props {
  rule: Rule;
  childName?: string;
  deviceName?: string;
}

export default function RuleCard({ rule, childName, deviceName }: Props) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-slate-900">{rule.title}</h3>
          <p className="text-sm text-slate-500">
            {RULE_TYPE_LABELS[rule.type]} · {rule.target}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[rule.status]}`}
        >
          {statusLabels[rule.status]}
        </span>
      </div>

      {rule.schedule && (
        <p className="mt-3 text-sm text-slate-600">
          <span className="font-medium">Schedule:</span> {rule.schedule}
        </p>
      )}

      {(childName || deviceName) && (
        <p className="mt-2 text-xs text-slate-400">
          {childName}
          {deviceName ? ` · ${deviceName}` : ""}
        </p>
      )}
    </article>
  );
}
