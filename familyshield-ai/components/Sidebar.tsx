"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/children", label: "Children", icon: "👧" },
  { href: "/dashboard/devices", label: "Devices", icon: "📱" },
  { href: "/dashboard/rules", label: "Rules", icon: "🛡️" },
  { href: "/dashboard/ai-generator", label: "AI Generator", icon: "✨" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-b border-slate-200 bg-white lg:w-64 lg:border-b-0 lg:border-r">
      <div className="border-b border-slate-100 p-5">
        <Link href="/" className="text-lg font-bold text-brand-700">
          FamilyShield AI
        </Link>
        <p className="text-xs text-slate-500">Parent dashboard · Phase 1</p>
      </div>

      <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col lg:overflow-visible">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-brand-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span aria-hidden>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
