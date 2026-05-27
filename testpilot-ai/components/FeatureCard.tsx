interface Props {
  icon: string;
  title: string;
  description: string;
}

/** Reusable feature card for landing page grid */
export default function FeatureCard({ icon, title, description }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <span className="text-3xl" aria-hidden>
        {icon}
      </span>
      <h3 className="mt-3 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}
