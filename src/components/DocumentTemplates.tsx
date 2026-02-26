import { useState } from "react";
import type { DocumentTemplate } from "@/schemas/intake";
import { Copy, Check, FileText } from "lucide-react";

interface DocumentTemplatesProps {
  templates: DocumentTemplate[];
}

function TemplateCard({ template }: { template: DocumentTemplate }) {
  const [body, setBody] = useState(template.body);
  const [copied, setCopied] = useState(false);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    template.variables.forEach((v) => { initial[v] = ""; });
    return initial;
  });

  function applyFields() {
    let result = template.body;
    Object.entries(fieldValues).forEach(([key, value]) => {
      if (value.trim()) {
        result = result.split(`[${key}]`).join(value);
      }
    });
    setBody(result);
  }

  function handleFieldChange(key: string, value: string) {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bp-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <FileText size={16} className="flex-shrink-0 mt-0.5 text-primary" />
          <div>
            <h3 className="font-semibold text-sm text-foreground">{template.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border hover:bg-muted transition-all"
        >
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Fillable fields */}
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <p className="text-xs font-medium text-foreground mb-2">Fill in your details:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {template.variables.map((v) => (
            <div key={v}>
              <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{v}</label>
              <input
                value={fieldValues[v] || ""}
                onChange={(e) => handleFieldChange(v, e.target.value)}
                placeholder={`Enter ${v.toLowerCase().replace(/_/g, " ")}…`}
                className="w-full bg-background border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring mt-0.5"
              />
            </div>
          ))}
        </div>
        <button
          onClick={applyFields}
          className="mt-2 px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-all"
        >
          Apply to Template
        </button>
      </div>

      <div className="p-3">
        <p className="text-xs text-muted-foreground mb-2">Preview — edit directly or fill fields above:</p>
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
          Fill in your details above each template, then click "Apply" to auto-populate. You can also edit directly.
        </p>
      </div>
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}
