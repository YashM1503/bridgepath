import { useState } from "react";
import type { DocumentTemplate } from "@/schemas/intake";
import { Copy, Check, FileText } from "lucide-react";

interface DocumentTemplatesProps {
  templates: DocumentTemplate[];
}

function TemplateCard({ template }: { template: DocumentTemplate }) {
  const [body, setBody] = useState(template.body);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bp-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <FileText size={16} className="flex-shrink-0 mt-0.5" style={{ color: "hsl(var(--primary))" }} />
          <div>
            <h3 className="font-semibold text-sm text-foreground">{template.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border hover:bg-muted transition-all"
        >
          {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <div className="p-3">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {template.variables.map((v) => (
            <span
              key={v}
              className="text-xs px-2 py-0.5 rounded-full border border-border bg-muted text-muted-foreground font-mono"
            >
              [{v}]
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mb-2">Edit the template below — replace [BRACKETS] with your details:</p>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={12}
          className="w-full text-xs font-mono bg-muted/30 border border-border rounded-lg p-3 text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );
}

export default function DocumentTemplates({ templates }: DocumentTemplatesProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-foreground">Document Templates</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Editable templates for common conversations and requests. Replace [BRACKETS] with your information.
        </p>
      </div>
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}
