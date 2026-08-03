import { useState } from "react";
import { ExternalLink, Info } from "lucide-react";
import { DIGESTS, NEWS_SOURCES, NEWS_TAGS, NEWS_UPDATED } from "@/data/news";

export default function NewsCenter() {
  const [tag, setTag] = useState<string>("all");

  const sources = tag === "all" ? NEWS_SOURCES : NEWS_SOURCES.filter((s) => s.tag === tag);
  const digests = tag === "all" ? DIGESTS : DIGESTS.filter((d) => d.tag === tag);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground">Visa &amp; Immigration Updates</h2>
        <p className="text-sm text-muted-foreground mt-1">
          One place to reach every official feed that actually changes your case — plus short
          plain-language explainers on things newcomers most often miss. Summaries reviewed{" "}
          {NEWS_UPDATED}; the linked government page is always the authority.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
        {NEWS_TAGS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTag(t.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              tag === t.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-secondary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Official sources — check these directly
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {sources.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bp-card p-4 flex items-start gap-3 hover:shadow-md transition-all group"
            >
              <span className="text-2xl flex-shrink-0">{s.icon}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors">
                    {s.title}
                  </h4>
                  <ExternalLink size={12} className="text-muted-foreground flex-shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                <span className="bp-badge-muted text-xs mt-2 inline-block">{s.cadence}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          What newcomers most often miss
        </h3>
        <div className="grid gap-3">
          {digests.map((d) => (
            <article key={d.id} className="bp-card p-4">
              <h4 className="font-semibold text-sm text-foreground">{d.headline}</h4>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{d.summary}</p>
              <p className="text-xs text-foreground mt-2 leading-relaxed">
                <strong className="font-semibold">Why it matters: </strong>
                {d.whyItMatters}
              </p>
              <a
                href={d.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline mt-3"
              >
                {d.sourceLabel} <ExternalLink size={11} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <div className="bp-card p-3 flex items-start gap-2">
        <Info size={14} className="text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          BridgePath does not publish news and is not affiliated with any agency. Summaries are general
          background that can go out of date at any time — read the official source before acting, and
          consult a licensed attorney or DOJ-accredited representative for advice on your situation.
        </p>
      </div>
    </div>
  );
}
