import type { Pathway, Score } from "@/schemas/intake";
import { CheckCircle, Star, AlertCircle, Clock, DollarSign, Unlock, Shield } from "lucide-react";

interface PathwayResultsProps {
  pathways: Pathway[];
  selected: string | null;
  onSelect: (id: string) => void;
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-semibold text-foreground">{value}</span>
      </div>
      <div className="score-bar">
        <div
          className="score-bar-fill animate-bar-fill"
          style={{
            width: `${value}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}

const SCORE_ICONS = {
  cost: DollarSign,
  speed: Clock,
  access: Unlock,
  risk: Shield,
};

const SCORE_COLORS: Record<keyof Score, string> = {
  cost: "hsl(148 55% 35%)",
  speed: "hsl(213 62% 40%)",
  access: "hsl(38 90% 52%)",
  risk: "hsl(185 65% 35%)",
};

function confidenceBadge(confidence: number) {
  if (confidence >= 85) return { label: "High confidence", cls: "bp-badge-success" };
  if (confidence >= 70) return { label: "Moderate confidence", cls: "bp-badge-warning" };
  return { label: "Lower confidence", cls: "bp-badge-muted" };
}

export default function PathwayResults({ pathways, selected, onSelect }: PathwayResultsProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-foreground">Your Transition Pathways</h2>
        <span className="text-xs text-muted-foreground">{pathways.length} options ranked for you</span>
      </div>

      {pathways.map((pathway, idx) => {
        const badge = confidenceBadge(pathway.confidence);
        const isSelected = selected === pathway.id;

        return (
          <div
            key={pathway.id}
            className={`pathway-card ${isSelected ? "selected" : ""} ${pathway.recommended ? "recommended" : ""}`}
            onClick={() => onSelect(pathway.id)}
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  background: pathway.recommended
                    ? "hsl(var(--accent-gold))"
                    : "hsl(var(--primary))",
                  color: pathway.recommended
                    ? "hsl(var(--accent-gold-foreground))"
                    : "hsl(var(--primary-foreground))",
                }}
              >
                {pathway.recommended ? <Star size={16} /> : idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-foreground">{pathway.name}</h3>
                  {pathway.recommended && (
                    <span className="bp-badge-warning text-xs">★ Recommended</span>
                  )}
                  <span className={badge.cls}>{badge.label}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{pathway.tagline}</p>
              </div>
              <div className="flex-shrink-0 text-xs text-muted-foreground">
                <Clock size={12} className="inline mr-1" />
                ~{pathway.estimatedDays}d
              </div>
            </div>

            <p className="text-sm text-foreground mb-4 leading-relaxed">{pathway.description}</p>

            {/* Score bars */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4">
              <ScoreBar label="Cost Efficiency" value={pathway.scores.cost} color={SCORE_COLORS.cost} />
              <ScoreBar label="Speed" value={pathway.scores.speed} color={SCORE_COLORS.speed} />
              <ScoreBar label="Accessibility" value={pathway.scores.access} color={SCORE_COLORS.access} />
              <ScoreBar label="Risk Level" value={pathway.scores.risk} color={SCORE_COLORS.risk} />
            </div>

            {/* Assumptions */}
            <div className="bg-muted/50 rounded-lg p-3 mb-3">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Assumes:</p>
              <ul className="space-y-0.5">
                {pathway.assumptions.map((a, i) => (
                  <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                    <CheckCircle size={10} className="mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--success))" }} />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps preview */}
            {isSelected && (
              <div className="mt-3 animate-fade-in">
                <p className="text-xs font-semibold text-foreground mb-2">Key Steps:</p>
                <ol className="space-y-1.5">
                  {pathway.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
                      >
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Verify note */}
            <div className="flex items-start gap-2 mt-3 pt-3 border-t border-border">
              <AlertCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: "hsl(var(--warning))" }} />
              <p className="text-xs text-muted-foreground italic">{pathway.verifyNote}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
