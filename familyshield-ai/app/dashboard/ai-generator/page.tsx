import AIRuleGenerator from "@/components/AIRuleGenerator";
import Header from "@/components/Header";

export default function AIGeneratorPage() {
  return (
    <>
      <Header
        title="AI Rule Generator"
        subtitle="Mock AI — generates plans without a real API (Phase 1)"
      />
      <div className="flex-1 p-4 sm:p-6">
        <AIRuleGenerator />
      </div>
    </>
  );
}
