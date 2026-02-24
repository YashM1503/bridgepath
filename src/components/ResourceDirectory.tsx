import { getResourcesByCorridorId, type ResourceLink } from "@/data/resources";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

interface ResourceDirectoryProps {
  corridorId: string;
}

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "government", label: "Government" },
  { key: "embassy", label: "Embassy & Consulate" },
  { key: "banking", label: "Banking & Finance" },
  { key: "documents", label: "Documents & Forms" },
  { key: "emergency", label: "Emergency" },
] as const;

function ResourceCard({ resource }: { resource: ResourceLink }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bp-card p-4 flex items-start gap-3 hover:shadow-md transition-all group"
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
  const [filter, setFilter] = useState("all");
  const resources = getResourcesByCorridorId(corridorId);
  const filtered = filter === "all" ? resources : resources.filter((r) => r.category === filter);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-foreground">Resource Directory</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Official links to government services, embassies, and financial resources. Always verify information directly with providers.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === cat.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-secondary"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>

      <div className="bp-card p-3 flex items-start gap-2">
        <span className="text-sm">ℹ️</span>
        <p className="text-xs text-muted-foreground">
          BridgePath links to official government and institutional websites for your convenience. 
          We do not endorse, promote, or have partnerships with any listed services unless explicitly stated. 
          Always verify information directly.
        </p>
      </div>
    </div>
  );
}
