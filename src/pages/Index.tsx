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
import DocumentChecker from "@/components/DocumentChecker";
import LanguageToggle from "@/components/LanguageToggle";
import type { DemoProfile } from "@/data/demoProfiles";
import { getCorridorByCountry } from "@/data/corridors";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Download, RefreshCw, ArrowRight,
  Compass, AlertTriangle, CheckSquare, FileText, ExternalLink, Users,
  MapPin, FileSearch
} from "lucide-react";

type AppStep = "landing" | "intake" | "results";
type ResultPage = "pathways" | "risks" | "checklist" | "templates" | "resources" | "doccheck";

export default function Index() {
  const { t } = useLanguage();
  const [appStep, setAppStep] = useState<AppStep>("landing");
  const [output, setOutput] = useState<PipelineOutput | null>(null);
  const [activePage, setActivePage] = useState<ResultPage>("pathways");
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoProfile, setDemoProfile] = useState<DemoProfile | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  const NAV_ITEMS: { key: ResultPage; label: string; icon: typeof Compass }[] = [
    { key: "pathways", label: t("nav.pathways"), icon: Compass },
    { key: "risks", label: t("nav.risks"), icon: AlertTriangle },
    { key: "checklist", label: t("nav.plan"), icon: CheckSquare },
    { key: "templates", label: t("nav.templates"), icon: FileText },
    { key: "doccheck", label: "Doc Check", icon: FileSearch },
    { key: "resources", label: t("nav.resources"), icon: ExternalLink },
  ];

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

  // ─── LANDING PAGE ───
  if (appStep === "landing") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        {/* Full-bleed dark hero */}
        <div className="hero-gradient text-primary-foreground">
          {/* Top bar */}
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="text-primary-foreground/60 text-xs font-medium tracking-wider">BRIDGEPATH</span>
            <LanguageToggle />
          </div>

          {/* Hero content */}
          <div className="max-w-4xl mx-auto px-6 pt-8 pb-20 text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-medium tracking-wide"
              style={{ background: "hsl(205 75% 48% / 0.2)", color: "hsl(205 80% 75%)" }}
            >
              <MapPin size={12} /> {t("landing.tagline")}
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 leading-tight tracking-tight">
              {t("landing.title")}
            </h1>

            <p className="text-xl sm:text-2xl font-light mb-4 opacity-90 italic">
              {t("landing.subtitle")}
            </p>

            <p className="text-base opacity-60 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t("landing.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={() => setAppStep("intake")}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all accent-gradient shadow-lg hover:shadow-xl hover:scale-105 text-accent-foreground"
              >
                {t("landing.cta")} <ArrowRight size={18} />
              </button>
              <button
                onClick={() => setShowDemo(!showDemo)}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium text-sm border border-primary-foreground/30 text-primary-foreground/80 hover:bg-primary-foreground/10 transition-all"
              >
                <Users size={16} /> {t("landing.demo")}
              </button>
            </div>

            {/* Country pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {["🇮🇳 India", "🇨🇳 China", "🌎 Latin America"].map((c) => (
                <span
                  key={c}
                  className="px-5 py-2 rounded-full text-sm font-medium border border-primary-foreground/20 text-primary-foreground/80"
                >
                  {c}
                </span>
              ))}
            </div>

            {/* Stats row */}
            <div className="flex justify-center gap-12 sm:gap-16 mb-10">
              {[
                { value: t("landing.stats.time"), label: t("landing.stats.timeLabel") },
                { value: t("landing.stats.pathways"), label: t("landing.stats.pathwaysLabel") },
                { value: t("landing.stats.plan"), label: t("landing.stats.planLabel") },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold tracking-tight">{stat.value}</p>
                  <p className="text-xs opacity-60 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <p className="text-xs opacity-40 max-w-xl mx-auto">
              {t("landing.disclaimer")}
            </p>
          </div>
        </div>

        {/* Demo profiles */}
        {showDemo && (
          <div className="max-w-4xl mx-auto px-6 py-8 w-full">
            <DemoProfiles onSelect={handleDemoSelect} />
          </div>
        )}

        {/* Features */}
        <div className="max-w-4xl mx-auto px-6 py-14 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
            {[
              { emoji: "🧭", title: t("landing.features.pathways"), desc: t("landing.features.pathwaysDesc") },
              { emoji: "🛡️", title: t("landing.features.risks"), desc: t("landing.features.risksDesc") },
              { emoji: "📋", title: t("landing.features.plan"), desc: t("landing.features.planDesc") },
            ].map((f) => (
              <div key={f.title} className="bp-card p-6 text-center">
                <div className="text-3xl mb-3">{f.emoji}</div>
                <h3 className="font-bold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">{t("landing.supporting")}</p>
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

  // ─── INTAKE PAGE ───
  if (appStep === "intake") {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <button
            onClick={handleRestart}
            className="text-muted-foreground text-sm hover:text-foreground mb-6 flex items-center gap-1"
          >
            {t("nav.backHome")}
          </button>

          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{t("intake.title")}</h1>
            <p className="text-muted-foreground">{t("intake.subtitle")}</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin mx-auto mb-4" />
              <p className="text-foreground font-medium">{t("intake.generating")}</p>
              <p className="text-muted-foreground text-sm mt-1">{t("intake.generatingDesc")}</p>
            </div>
          ) : (
            <IntakeFormComponent onComplete={handleFormComplete} />
          )}
        </div>
      </div>
    );
  }

  // ─── RESULTS PAGE ───
  const corridorId = output ? getCorridorByCountry(output.profile.corridorId === "latam" ? "mexico" : output.profile.corridorId) : "latam";

  return (
    <div className="min-h-screen bg-background">
      {/* Results Header */}
      <div className="border-b border-border bg-card px-6 py-3 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handleRestart} className="text-foreground font-bold text-lg hover:opacity-80 transition-opacity">
              BridgePath
            </button>
            {output && (
              <span className="text-xs text-muted-foreground border-l border-border pl-4">
                {demoProfile ? `${demoProfile.avatar} ${demoProfile.name}` : ""} {output.profile.corridorId.toUpperCase()} → ZIP
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border border-border hover:bg-muted transition-all"
            >
              <Download size={13} /> {exporting ? t("nav.exporting") : t("nav.exportPdf")}
            </button>
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border border-border hover:bg-muted transition-all"
            >
              <RefreshCw size={13} /> {t("nav.restart")}
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal tab nav */}
      <div className="border-b border-border bg-card sticky top-[53px] z-10">
        <div className="max-w-5xl mx-auto flex gap-0 px-6 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? "border-accent text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={15} />
                {item.label}
                {item.key === "risks" && output && output.riskFlags.filter((f) => f.severity === "high").length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-destructive/20 text-destructive font-semibold">
                    {output.riskFlags.filter((f) => f.severity === "high").length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile summary bar */}
      {output && (
        <div className="bg-muted/50 border-b border-border px-6 py-2.5">
          <div className="max-w-5xl mx-auto flex flex-wrap gap-4 text-xs text-foreground">
            <span><strong>Status:</strong> {output.profile.corridorId.toUpperCase()} · {output.profile.riskLevel}</span>
            {demoProfile && <span><strong>Demo:</strong> {demoProfile.name} — {demoProfile.tagline}</span>}
          </div>
        </div>
      )}

      {/* Disclaimer banner */}
      {output && (
        <div style={{ background: "hsl(var(--warning-light))" }} className="border-b border-border px-6 py-2">
          <p className="text-xs text-foreground/70 text-center max-w-5xl mx-auto">
            {t("results.disclaimer")}
          </p>
        </div>
      )}

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-6 pb-16">
        {output && (
          <>
            {activePage === "pathways" && (
              <PathwayResults pathways={output.pathways} selected={selectedPathway} onSelect={setSelectedPathway} />
            )}
            {activePage === "risks" && <RiskFlags flags={output.riskFlags} />}
            {activePage === "checklist" && <ChecklistPlan items={output.checklist} />}
            {activePage === "templates" && <DocumentTemplates templates={output.templates} />}
            {activePage === "doccheck" && <DocumentChecker />}
            {activePage === "resources" && <ResourceDirectory corridorId={output.profile.corridorId} />}
          </>
        )}
      </div>
    </div>
  );
}
