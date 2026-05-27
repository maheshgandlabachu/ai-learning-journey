import PlatformSupportBadge from "@/components/PlatformSupportBadge";
import type { ChildProfile, Device } from "@/lib/types";

const syncLabels = {
  synced: { text: "Synced", class: "bg-emerald-100 text-emerald-800" },
  pending: { text: "Pending sync", class: "bg-amber-100 text-amber-800" },
  error: { text: "Sync error", class: "bg-rose-100 text-rose-800" },
};

interface Props {
  device: Device;
  child?: ChildProfile;
}

export default function DeviceCard({ device, child }: Props) {
  const sync = syncLabels[device.syncStatus];

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-slate-900">{device.name}</h3>
          {child && (
            <p className="text-sm text-slate-500">{child.name}&apos;s device</p>
          )}
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${device.status === "online" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}
        >
          {device.status}
        </span>
      </div>

      <div className="mt-3">
        <PlatformSupportBadge platform={device.platform} compact />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-slate-500">Protection</dt>
          <dd className="font-medium capitalize text-slate-800">
            {device.protectionLevel}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Sync</dt>
          <dd>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${sync.class}`}>
              {sync.text}
            </span>
          </dd>
        </div>
      </dl>
    </article>
  );
}
