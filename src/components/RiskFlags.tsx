import type { RiskFlag } from "@/schemas/intake";
import { AlertTriangle, AlertCircle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface RiskFlagsProps {
  flags: RiskFlag[];
}

const SEVERITY_CONFIG = {
  high: {
    icon: AlertTriangle,
    label: "High",
    badgeCls: "bg-destructive/10 text-destructive border border-destructive/20",
    iconColor: "text-destructive",
    headerBg: "bg-destructive/5",
  },
  medium: {
    icon: AlertCircle,
    label: "Medium",
    badgeCls: "bg-warning/10 text-warning-foreground border border-warning/20",
    iconColor: "text-warning",
    headerBg: "bg-warning/5",
  },
  low: {
    icon: Info,
    label: "Low",
    badgeCls: "bg-blue-light text-blue-mid border border-blue-mid/20",
    iconColor: "text-blue-mid",
    headerBg: "bg-blue-light/50",
  },
};

function RiskFlagCard({ flag }: { flag: RiskFlag }) {
  const [expanded, setExpanded] = useState(flag.severity === "high");
  const config = SEVERITY_CONFIG[flag.severity];
  const Icon = config.icon;

  return (
    <div className="bp-card overflow-hidden animate-fade-in">
      <button
        className={`w-full flex items-center gap-3 p-4 text-left ${config.headerBg} transition-all`}
        onClick={() => setExpanded((e) => !e)}
      >
        <Icon size={16} className={`flex-shrink-0 ${config.iconColor}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-foreground">{flag.title}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.badgeCls}`}>
              {config.label}
            </span>
            {flag.corridor && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {flag.corridor.toUpperCase()}
              </span>
            )}
          </div>
        </div>
        {expanded ? <ChevronUp size={14} className="flex-shrink-0 text-muted-foreground" /> : <ChevronDown size={14} className="flex-shrink-0 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-3 space-y-3 animate-fade-in">
          <p className="text-sm text-foreground">{flag.description}</p>
          <div className="rounded-lg p-3" style={{ background: "hsl(var(--success-light))" }}>
            <p className="text-xs font-semibold mb-1" style={{ color: "hsl(var(--success))" }}>✓ Mitigation</p>
            <p className="text-sm" style={{ color: "hsl(var(--foreground))" }}>{flag.mitigation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RiskFlags({ flags }: RiskFlagsProps) {
  const high = flags.filter((f) => f.severity === "high");
  const medium = flags.filter((f) => f.severity === "medium");
  const low = flags.filter((f) => f.severity === "low");

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Risk Flags</h2>
        <div className="flex gap-2">
          {high.length > 0 && <span className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive font-medium">{high.length} High</span>}
          {medium.length > 0 && <span className="text-xs px-2 py-1 rounded-full bg-warning/10 text-warning-foreground font-medium">{medium.length} Med</span>}
          {low.length > 0 && <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium">{low.length} Low</span>}
        </div>
      </div>

      {high.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">High Priority — Address Immediately</p>
          {high.map((flag) => <RiskFlagCard key={flag.id} flag={flag} />)}
        </div>
      )}
      {medium.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Medium Priority</p>
          {medium.map((flag) => <RiskFlagCard key={flag.id} flag={flag} />)}
        </div>
      )}
      {low.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Good to Know</p>
          {low.map((flag) => <RiskFlagCard key={flag.id} flag={flag} />)}
        </div>
      )}
    </div>
  );
}
