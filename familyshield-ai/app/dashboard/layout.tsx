import Sidebar from "@/components/Sidebar";
import { FamilyShieldProvider } from "@/lib/FamilyShieldContext";

/** Dashboard shell — wraps all parent pages with sidebar + shared state */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FamilyShieldProvider>
      <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
        <Sidebar />
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </FamilyShieldProvider>
  );
}
