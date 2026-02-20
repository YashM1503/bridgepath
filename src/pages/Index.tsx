import { useState } from "react";
import type { IntakeForm } from "@/schemas/intake";
import type { PipelineOutput } from "@/schemas/intake";
import { runPipeline } from "@/lib/pipeline";
import { exportToPDF } from "@/lib/pdf";
import IntakeFormComponent from "@/components/IntakeFormComponent";
import PathwayResults from "@/components/PathwayResults";
import RiskFlags from "@/components/RiskFlags";
import ChecklistPlan from "@/components/ChecklistPlan";
import DocumentTemplates from "@/components/DocumentTemplates";
import { Download, RefreshCw, MapPin, Shield, ArrowRight } from "lucide-react";

type AppStep = "landing" | "intake" | "results";
type ResultTab = "pathways" | "risks" | "checklist" | "templates";

function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="hero-gradient text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-medium"
            style={{ background: "hsl(var(--accent-gold) / 0.2)", color: "hsl(var(--accent-gold))" }}>
            <MapPin size={12} /> Designed for newcomers to the USA
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            BridgePath
          </h1>
          <p className="text-xl sm:text-2xl font-light mb-3 opacity-90">
            Your first 30 days, handled.
          </p>
          <p className="text-base opacity-70 max-w-2xl mx-auto mb-10">
            Financial onboarding for newcomers from India, China, and Latin America.
            Get a personalized banking plan, risk flags, and 30-day checklist — in under 5 minutes.
          </p>
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all amber-gradient shadow-lg hover:shadow-xl hover:scale-105"
            style={{ color: "hsl(var(--accent-gold-foreground))" }}
          >
            Start My Plan <ArrowRight size={18} />
          </button>
          <p className="text-xs opacity-50 mt-4">No account required · No advice · Options only · Always verify with providers</p>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-6 py-14 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          {[
            { emoji: "🏦", title: "Ranked Pathways", desc: "3–4 scored options by Cost, Speed, Access & Risk" },
            { emoji: "🚩", title: "Risk Flags", desc: "Corridor-specific warnings and scam alerts with mitigations" },
            { emoji: "✅", title: "30-Day Plan", desc: "Week-by-week checklist you can check off as you go" },
          ].map((f) => (
            <div key={f.title} className="bp-card p-5 text-center">
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3 className="font-bold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="bp-card p-5 flex items-start gap-3 mb-14">
          <Shield size={18} className="flex-shrink-0 mt-0.5" style={{ color: "hsl(var(--teal))" }} />
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Not advice.</strong> BridgePath provides general information and options only.
            It is not a bank, and does not provide financial, legal, tax, or immigration advice.
            All options must be verified directly with providers. Regulations and products change frequently.
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">Supporting newcomers from:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["🇮🇳 India", "🇨🇳 China", "🇲🇽 Mexico", "🇨🇴 Colombia", "🇧🇷 Brazil"].map((c) => (
              <span key={c} className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const TABS: { key: ResultTab; label: string }[] = [
  { key: "pathways", label: "Pathways" },
  { key: "risks", label: "Risk Flags" },
  { key: "checklist", label: "30-Day Plan" },
  { key: "templates", label: "Templates" },
];

export default function Index() {
  const [appStep, setAppStep] = useState<AppStep>("landing");
  const [output, setOutput] = useState<PipelineOutput | null>(null);
  const [activeTab, setActiveTab] = useState<ResultTab>("pathways");
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleFormComplete(data: IntakeForm) {
    setLoading(true);
    setTimeout(() => {
      try {
        const result = runPipeline(data);
        setOutput(result);
        setSelectedPathway(result.pathways.find((p) => p.recommended)?.id ?? result.pathways[0]?.id ?? null);
        setAppStep("results");
      } catch (e) {
        console.error("Pipeline error:", e);
      } finally {
        setLoading(false);
      }
    }, 800);
  }

  async function handleExport() {
    if (!output) return;
    setExporting(true);
    try {
      await exportToPDF(output);
    } catch (e) {
      console.error("Export error:", e);
    } finally {
      setExporting(false);
    }
  }

  if (appStep === "landing") {
    return <LandingPage onStart={() => setAppStep("intake")} />;
  }

  if (appStep === "intake") {
    return (
      <div className="min-h-screen bg-background">
        <div className="hero-gradient px-6 py-6">
          <div className="max-w-2xl mx-auto">
            <button onClick={() => setAppStep("landing")} className="text-primary-foreground/70 text-sm hover:text-primary-foreground mb-2 flex items-center gap-1">
              ← BridgePath
            </button>
            <h1 className="text-2xl font-bold text-primary-foreground">Build Your Onboarding Plan</h1>
            <p className="text-primary-foreground/70 text-sm mt-1">~3 minutes · No account needed</p>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-6 py-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4" />
              <p className="text-foreground font-medium">Generating your personalized plan…</p>
              <p className="text-muted-foreground text-sm mt-1">Analyzing your corridor and profile</p>
            </div>
          ) : (
            <IntakeFormComponent onComplete={handleFormComplete} />
          )}
        </div>
      </div>
    );
  }

  // Results
  return (
    <div className="min-h-screen bg-background">
      {/* Results Header */}
      <div className="hero-gradient px-6 py-6 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <button onClick={() => setAppStep("landing")} className="text-primary-foreground/60 text-xs hover:text-primary-foreground mb-1 flex items-center gap-1">
              ← BridgePath
            </button>
            <h1 className="text-lg font-bold text-primary-foreground">Your Onboarding Plan</h1>
            {output && (
              <p className="text-xs text-primary-foreground/60">
                {output.profile.corridorId.toUpperCase()} · Risk: {output.profile.riskLevel}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setAppStep("intake"); setOutput(null); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-primary-foreground/80 border border-primary-foreground/20 hover:bg-primary-foreground/10 transition-all"
            >
              <RefreshCw size={13} /> Restart
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold amber-gradient transition-all"
              style={{ color: "hsl(var(--accent-gold-foreground))" }}
            >
              <Download size={13} /> {exporting ? "Exporting…" : "Export PDF"}
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer banner */}
      {output && (
        <div className="bg-warning/10 border-b border-warning/20 px-6 py-2">
          <p className="text-xs text-warning-foreground text-center max-w-3xl mx-auto">
            ⚠ General information only — not financial, legal, or immigration advice. Verify all options with providers.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border bg-card sticky top-[88px] z-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex gap-0">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {tab.key === "risks" && output && output.riskFlags.filter((f) => f.severity === "high").length > 0 && (
                  <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">
                    {output.riskFlags.filter((f) => f.severity === "high").length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-6 pb-16">
        {output && (
          <>
            {activeTab === "pathways" && (
              <PathwayResults
                pathways={output.pathways}
                selected={selectedPathway}
                onSelect={setSelectedPathway}
              />
            )}
            {activeTab === "risks" && <RiskFlags flags={output.riskFlags} />}
            {activeTab === "checklist" && <ChecklistPlan items={output.checklist} />}
            {activeTab === "templates" && <DocumentTemplates templates={output.templates} />}
          </>
        )}
      </div>
    </div>
  );
}
