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
import ResourceDirectory from "@/components/ResourceDirectory";
import DemoProfiles from "@/components/DemoProfiles";
import LanguageToggle from "@/components/LanguageToggle";
import type { DemoProfile } from "@/data/demoProfiles";
import { getCorridorByCountry } from "@/data/corridors";
import {
  Download, RefreshCw, MapPin, Shield, ArrowRight, Compass,
  AlertTriangle, CheckSquare, FileText, ExternalLink, Users
} from "lucide-react";

type AppStep = "landing" | "intake" | "results";
type ResultPage = "pathways" | "risks" | "checklist" | "templates" | "resources";

const NAV_ITEMS: { key: ResultPage; label: string; icon: typeof Compass }[] = [
  { key: "pathways", label: "Pathways", icon: Compass },
  { key: "risks", label: "Risk Flags", icon: AlertTriangle },
  { key: "checklist", label: "30-Day Plan", icon: CheckSquare },
  { key: "templates", label: "Templates", icon: FileText },
  { key: "resources", label: "Resources", icon: ExternalLink },
];

function LandingPage({
  onStart,
  onDemo,
  language,
  onLanguageChange,
}: {
  onStart: () => void;
  onDemo: (profile: DemoProfile) => void;
  language: string;
  onLanguageChange: (code: string) => void;
}) {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="hero-gradient">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <span className="text-primary-foreground/60 text-xs font-medium">BridgePath</span>
          <LanguageToggle current={language} onChange={onLanguageChange} />
        </div>
      </div>

      {/* Hero */}
      <div className="hero-gradient text-primary-foreground">
        <div className="max-w-4xl mx-auto px-6 pt-10 pb-16 text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-medium"
            style={{ background: "hsl(205 75% 48% / 0.2)", color: "hsl(205 80% 75%)" }}
          >
            <MapPin size={12} /> Designed for newcomers to the USA
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">BridgePath</h1>
          <p className="text-xl sm:text-2xl font-light mb-3 opacity-90">Your first 30 days, handled.</p>
          <p className="text-base opacity-70 max-w-2xl mx-auto mb-10">
            Financial onboarding for newcomers from India, China, and Latin America.
            Get a personalized plan, risk flags, and 30-day checklist — in under 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onStart}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all accent-gradient shadow-lg hover:shadow-xl hover:scale-105 text-accent-foreground"
            >
              Start My Plan <ArrowRight size={18} />
            </button>
            <button
              onClick={() => setShowDemo(!showDemo)}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium text-sm border border-primary-foreground/30 text-primary-foreground/80 hover:bg-primary-foreground/10 transition-all"
            >
              <Users size={16} /> Try a Demo Profile
            </button>
          </div>
          <p className="text-xs opacity-50 mt-4">
            No account required · No advice · Options only · Always verify with providers
          </p>
        </div>
      </div>

      {/* Demo profiles */}
      {showDemo && (
        <div className="max-w-4xl mx-auto px-6 py-8 w-full">
          <DemoProfiles onSelect={onDemo} />
        </div>
      )}

      {/* Features */}
      <div className="max-w-4xl mx-auto px-6 py-14 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          {[
            { emoji: "🧭", title: "Guided Pathways", desc: "3–4 scored options by Cost, Speed, Access & Risk" },
            { emoji: "🛡️", title: "Risk Alerts", desc: "Corridor-specific warnings and scam alerts with mitigations" },
            { emoji: "📋", title: "30-Day Plan", desc: "Week-by-week checklist you can check off as you go" },
          ].map((f) => (
            <div key={f.title} className="bp-card p-5 text-center">
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3 className="font-bold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="bp-card p-5 flex items-start gap-3 mb-14">
          <Shield size={18} className="flex-shrink-0 mt-0.5 text-accent" />
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Not advice.</strong> BridgePath provides general information and options only.
            It is not a bank, and does not provide financial, legal, tax, or immigration advice.
            All options must be verified directly with providers.
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

export default function Index() {
  const [appStep, setAppStep] = useState<AppStep>("landing");
  const [output, setOutput] = useState<PipelineOutput | null>(null);
  const [activePage, setActivePage] = useState<ResultPage>("pathways");
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [demoProfile, setDemoProfile] = useState<DemoProfile | null>(null);

  function processForm(data: IntakeForm) {
    setLoading(true);
    setTimeout(() => {
      try {
        const result = runPipeline(data);
        setOutput(result);
        setSelectedPathway(result.pathways.find((p) => p.recommended)?.id ?? result.pathways[0]?.id ?? null);
        setAppStep("results");
        setActivePage("pathways");
      } catch (e) {
        console.error("Pipeline error:", e);
      } finally {
        setLoading(false);
      }
    }, 800);
  }

  function handleFormComplete(data: IntakeForm) {
    setDemoProfile(null);
    processForm(data);
  }

  function handleDemoSelect(profile: DemoProfile) {
    setDemoProfile(profile);
    processForm(profile.formData);
  }

  function handleRestart() {
    setAppStep("landing");
    setOutput(null);
    setDemoProfile(null);
  }

  async function handleExport() {
    if (!output) return;
    setExporting(true);
    try {
      await exportToPDF(output, demoProfile?.name);
    } catch (e) {
      console.error("Export error:", e);
    } finally {
      setExporting(false);
    }
  }

  if (appStep === "landing") {
    return (
      <LandingPage
        onStart={() => setAppStep("intake")}
        onDemo={handleDemoSelect}
        language={language}
        onLanguageChange={setLanguage}
      />
    );
  }

  if (appStep === "intake") {
    return (
      <div className="min-h-screen bg-background">
        <div className="hero-gradient px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div>
              <button onClick={handleRestart} className="text-primary-foreground/70 text-sm hover:text-primary-foreground mb-1 flex items-center gap-1">
                ← BridgePath
              </button>
              <h1 className="text-xl font-bold text-primary-foreground">Build Your Onboarding Plan</h1>
              <p className="text-primary-foreground/60 text-xs mt-0.5">~3 minutes · No account needed</p>
            </div>
            <LanguageToggle current={language} onChange={setLanguage} />
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-6 py-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin mx-auto mb-4" />
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

  const corridorId = output ? getCorridorByCountry(output.profile.corridorId === "latam" ? "mexico" : output.profile.corridorId) : "latam";

  return (
    <div className="min-h-screen bg-background">
      {/* Results Header */}
      <div className="hero-gradient px-6 py-4 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <button onClick={handleRestart} className="text-primary-foreground/60 text-xs hover:text-primary-foreground mb-0.5 flex items-center gap-1">
              ← BridgePath
            </button>
            <h1 className="text-lg font-bold text-primary-foreground flex items-center gap-2">
              {demoProfile ? `${demoProfile.avatar} ${demoProfile.name}'s Plan` : "Your Onboarding Plan"}
            </h1>
            {output && (
              <p className="text-xs text-primary-foreground/50">
                {output.profile.corridorId.toUpperCase()} · Risk: {output.profile.riskLevel}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <LanguageToggle current={language} onChange={setLanguage} />
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-primary-foreground/80 border border-primary-foreground/20 hover:bg-primary-foreground/10 transition-all"
            >
              <RefreshCw size={13} /> Restart
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold accent-gradient text-accent-foreground transition-all"
            >
              <Download size={13} /> {exporting ? "Exporting…" : "Export PDF"}
            </button>
          </div>
        </div>
      </div>

      {/* Demo profile banner */}
      {demoProfile && (
        <div className="bg-blue-light border-b border-border px-6 py-2">
          <p className="text-xs text-foreground text-center max-w-4xl mx-auto">
            📋 Demo: Viewing <strong>{demoProfile.name}'s</strong> plan — {demoProfile.tagline} from {demoProfile.origin}
          </p>
        </div>
      )}

      {/* Disclaimer banner */}
      {output && (
        <div style={{ background: "hsl(var(--warning-light))" }} className="border-b border-border px-6 py-2">
          <p className="text-xs text-foreground/70 text-center max-w-4xl mx-auto">
            ⚠ General information only — not financial, legal, or immigration advice. Verify all options with providers.
          </p>
        </div>
      )}

      {/* Navigation sidebar + content */}
      <div className="max-w-4xl mx-auto flex">
        {/* Side nav */}
        <nav className="w-48 flex-shrink-0 border-r border-border py-4 px-2 hidden md:block sticky top-[76px] h-[calc(100vh-76px)]">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1 ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon size={15} />
                {item.label}
                {item.key === "risks" && output && output.riskFlags.filter((f) => f.severity === "high").length > 0 && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-destructive/20 text-destructive font-semibold">
                    {output.riskFlags.filter((f) => f.severity === "high").length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile nav */}
        <div className="md:hidden border-b border-border bg-card sticky top-[76px] z-10 overflow-x-auto w-full">
          <div className="flex gap-0 px-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className={`px-3 py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                  activePage === item.key
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 py-6 pb-16 min-w-0">
          {output && (
            <>
              {activePage === "pathways" && (
                <PathwayResults pathways={output.pathways} selected={selectedPathway} onSelect={setSelectedPathway} />
              )}
              {activePage === "risks" && <RiskFlags flags={output.riskFlags} />}
              {activePage === "checklist" && <ChecklistPlan items={output.checklist} />}
              {activePage === "templates" && <DocumentTemplates templates={output.templates} />}
              {activePage === "resources" && <ResourceDirectory corridorId={output.profile.corridorId} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
