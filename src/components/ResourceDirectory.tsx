import { getResourcesByCorridorId, searchResources, type ResourceLink } from "@/data/resources";
import { ExternalLink, Search, Info } from "lucide-react";
import { useMemo, useState } from "react";

interface ResourceDirectoryProps {
  corridorId: string;
}

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "government", label: "Government" },
  { key: "embassy", label: "Embassy & Consulate" },
  { key: "banking", label: "Banking & Money" },
  { key: "documents", label: "Documents & Forms" },
  { key: "legal", label: "Legal help" },
  { key: "education", label: "Study & Settling in" },
  { key: "emergency", label: "Emergency" },
] as const;

function ResourceCard({ resource }: { resource: ResourceLink }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bp-card p-4 flex items-start gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all group"
    >
      <span className="text-2xl flex-shrink-0">{resource.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors">
            {resource.title}
          </h3>
          <ExternalLink size={12} className="text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{resource.description}</p>
        <span className="bp-badge-accent text-xs mt-2 inline-block capitalize">{resource.category}</span>
      </div>
    </a>
  );
}

export default function ResourceDirectory({ corridorId }: ResourceDirectoryProps) {
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  const resources = useMemo(() => getResourcesByCorridorId(corridorId), [corridorId]);
  const filtered = useMemo(() => {
    const byCat = filter === "all" ? resources : resources.filter((r) => r.category === filter);
    return searchResources(byCat, query);
  }, [resources, filter, query]);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground">Resource Directory</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {resources.length} official links to government services, embassies, legal help and financial
          resources for your corridor. Informational only — always verify directly with the provider.
        </p>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value.slice(0, 100))}
          maxLength={100}
          placeholder="Search resources — e.g. SSN, ITIN, visa fees, legal aid"
          aria-label="Search resources"
          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
        {CATEGORIES.map((cat) => (
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
        {filtered.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No resources match that search. Try a broader term.
        </p>
      )}

      <div className="bp-card p-3 flex items-start gap-2">
        <Info size={14} className="text-muted-foreground flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          BridgePath links to official government and institutional websites for your convenience.
          We do not endorse, promote, or have partnerships with any listed service unless explicitly stated,
          and we never ask for your documents or account details. Always verify information directly.
        </p>
      </div>
    </div>
  );
}
