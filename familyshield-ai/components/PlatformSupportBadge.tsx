import { PLATFORM_SUPPORT } from "@/lib/platform";
import type { DevicePlatform } from "@/lib/types";

const toneClasses = {
  success: "bg-emerald-50 text-emerald-800 border-emerald-200",
  warning: "bg-amber-50 text-amber-900 border-amber-200",
  info: "bg-sky-50 text-sky-900 border-sky-200",
  muted: "bg-slate-50 text-slate-600 border-slate-200",
};

interface Props {
  platform: DevicePlatform;
  compact?: boolean;
}

/** Shows what each platform can and cannot do — important for parent expectations */
export default function PlatformSupportBadge({ platform, compact }: Props) {
  const info = PLATFORM_SUPPORT[platform];

  return (
    <span
      className={`inline-flex flex-col rounded-lg border px-3 py-1.5 text-xs font-medium ${toneClasses[info.tone]} ${compact ? "max-w-xs" : ""}`}
      title={info.message}
    >
      <span className="font-semibold">{info.label}</span>
      {!compact && <span className="mt-0.5 font-normal opacity-90">{info.message}</span>}
    </span>
  );
}
