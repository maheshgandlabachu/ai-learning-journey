import type { ChildProfile } from "@/lib/types";
import Link from "next/link";

const riskColors = {
  low: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-rose-100 text-rose-800",
};

interface Props {
  child: ChildProfile;
  deviceCount: number;
  ruleCount: number;
  onEdit?: () => void;
}

export default function ChildProfileCard({
  child,
  deviceCount,
  ruleCount,
  onEdit,
}: Props) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{child.name}</h3>
          <p className="text-sm text-slate-500">Age {child.age}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${riskColors[child.riskLevel]}`}
        >
          {child.riskLevel} risk
        </span>
      </div>

      <dl className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex justify-between">
          <dt>Primary device</dt>
          <dd className="font-medium text-slate-800">{child.deviceType}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Screen time goal</dt>
          <dd className="font-medium text-slate-800">{child.screenTimeGoal}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Devices / Rules</dt>
          <dd className="font-medium text-slate-800">
            {deviceCount} / {ruleCount}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex gap-2">
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Edit
          </button>
        )}
        <Link
          href="/dashboard/rules"
          className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          Manage rules
        </Link>
      </div>
    </article>
  );
}
