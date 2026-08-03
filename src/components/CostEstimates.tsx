import { useMemo, useState } from "react";
import { ExternalLink, Info } from "lucide-react";
import { COST_CATEGORIES, LAST_VERIFIED, getCostsByCorridor, type CostItem } from "@/data/costs";

interface CostEstimatesProps {
  corridorId: string;
}

function formatFee(item: CostItem) {
  if (item.govFeeUsd === null) return "Varies";
  if (item.govFeeUsd === 0) return "Free";
  return `~$${item.govFeeUsd.toLocaleString()}`;
}

function CostRow({ item }: { item: CostItem }) {
  return (
    <div className="bp-card p-4">
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-sm text-foreground break-words">{item.name}</h3>
          {item.code && <p className="text-xs text-muted-foreground mt-0.5">{item.code}</p>}
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-bold text-sm sm:text-base text-foreground tabular-nums">{formatFee(item)}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Ballpark</p>
        </div>
      </div>

      <dl className="mt-3 grid gap-2 text-xs sm:grid-cols-2">

        <div>
          <dt className="text-muted-foreground">Typical timeline</dt>
          <dd className="text-foreground">{item.typicalTimeline}</dd>
        </div>
        {item.extrasUsd && (
          <div>
            <dt className="text-muted-foreground">Costs people forget</dt>
            <dd className="text-foreground">{item.extrasUsd}</dd>
          </div>
        )}
      </dl>

      <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{item.notes}</p>

      <a
        href={item.officialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline mt-3"
      >
        {item.officialLabel} <ExternalLink size={11} />
      </a>
    </div>
  );
}

export default function CostEstimates({ corridorId }: CostEstimatesProps) {
  const [filter, setFilter] = useState<string>("all");
  const items = useMemo(() => getCostsByCorridor(corridorId), [corridorId]);
  const filtered = filter === "all" ? items : items.filter((i) => i.category === filter);

  const quotable = filtered.filter((i) => typeof i.govFeeUsd === "number" && i.govFeeUsd > 0);
  const low = quotable.length ? Math.min(...quotable.map((i) => i.govFeeUsd as number)) : 0;
  const high = quotable.reduce((sum, i) => sum + (i.govFeeUsd as number), 0);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground">Fees &amp; Cost Estimates</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Ballpark government fees and the extras people forget, so you can budget before you begin.
          Figures are illustrative and last reviewed {LAST_VERIFIED} — confirm every amount on the
          official page linked in each card before you pay anything.
        </p>
      </div>

      {quotable.length > 1 && (
        <div className="bp-card p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[auto_auto_1fr] lg:items-center lg:gap-x-8">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Smallest single fee</p>
            <p className="text-lg font-bold text-foreground tabular-nums">${low.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              If every listed item applied
            </p>
            <p className="text-lg font-bold text-foreground tabular-nums">${high.toLocaleString()}</p>
          </div>
          <p className="text-xs text-muted-foreground sm:col-span-2 lg:col-span-1">
            Almost nobody pays all of these. Use it only as an upper bound while planning.
          </p>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
        {COST_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              filter === cat.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-secondary"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((item) => (
          <CostRow key={item.id} item={item} />
        ))}
      </div>

      <div className="bp-card p-3 flex items-start gap-2">
        <Info size={14} className="text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          These are estimates for planning only — not quotes, legal advice, or tax advice. Fees change,
          categories differ, and your case may carry costs not listed here. Always verify with the
          official agency, and never pay a third party for a service the government provides free.
        </p>
      </div>
    </div>
  );
}
