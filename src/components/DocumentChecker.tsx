import { useState } from "react";
import { Upload, FileCheck, FileX, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PURPOSES = [
  { value: "open_bank_account", label: "Open a Bank Account" },
  { value: "apply_credit_card", label: "Apply for Credit Card" },
  { value: "rent_apartment", label: "Rent an Apartment" },
  { value: "get_ssn", label: "Apply for SSN" },
  { value: "get_itin", label: "Apply for ITIN" },
  { value: "get_drivers_license", label: "Get a Driver's License" },
  { value: "employer_verification", label: "Employer Verification (I-9)" },
];

const DOCUMENT_TYPES = [
  "Passport",
  "US Visa (in passport)",
  "Driver's License",
  "State ID",
  "I-20 (Student)",
  "DS-2019 (Exchange Visitor)",
  "I-94 Arrival Record",
  "Employment Authorization Document (EAD)",
  "Social Security Card",
  "ITIN Letter",
  "Utility Bill",
  "Bank Statement",
  "Lease Agreement",
  "W-2 Form",
  "Pay Stub",
  "Other",
];

interface CheckResult {
  sufficient: boolean;
  explanation: string;
  required_documents: string[];
  missing_documents: string[];
  tips: string[];
}

export default function DocumentChecker() {
  const [purpose, setPurpose] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);

  async function handleCheck() {
    if (!purpose || !documentType) return;
    setChecking(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("doc-checker", {
        body: { purpose, documentType, documentText: file?.name || "" },
      });

      if (error) throw error;
      setResult(data);
    } catch (e: any) {
      console.error("Doc checker error:", e);
      setResult({
        sufficient: false,
        explanation: "Unable to check at this time. Please try again.",
        required_documents: [],
        missing_documents: [],
        tips: ["Try refreshing and checking again."],
      });
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-foreground">Document Checker</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Verify if your documents meet the requirements for a specific process.
        </p>
      </div>

      <div className="bp-card p-4 space-y-4">
        {/* Purpose */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">What do you need this document for?</label>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select purpose…</option>
            {PURPOSES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* Document type */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">What document do you have?</label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select document type…</option>
            {DOCUMENT_TYPES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Optional file upload */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-1.5">Upload document (optional — for reference only)</label>
          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="doc-upload"
            />
            <label htmlFor="doc-upload" className="cursor-pointer">
              <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">
                {file ? file.name : "Click to upload PDF or image"}
              </p>
            </label>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            We do not store your documents. They are only used for reference during this check.
          </p>
        </div>

        <button
          onClick={handleCheck}
          disabled={!purpose || !documentType || checking}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {checking ? <Loader2 size={16} className="animate-spin" /> : <FileCheck size={16} />}
          {checking ? "Checking…" : "Check My Document"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className={`bp-card p-4 border-l-4 animate-fade-in ${result.sufficient ? "border-l-green-500" : "border-l-destructive"}`}>
          <div className="flex items-start gap-3 mb-3">
            {result.sufficient ? (
              <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <FileX size={20} className="text-destructive flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h3 className="font-semibold text-sm text-foreground">
                {result.sufficient ? "Document appears sufficient ✓" : "Additional documents needed"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{result.explanation}</p>
            </div>
          </div>

          {result.required_documents.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-foreground mb-1">Required documents for this process:</p>
              <ul className="list-disc list-inside text-xs text-muted-foreground space-y-0.5">
                {result.required_documents.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
          )}

          {result.missing_documents.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-destructive mb-1">You still need:</p>
              <ul className="list-disc list-inside text-xs text-foreground space-y-0.5">
                {result.missing_documents.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
          )}

          {result.tips.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-3 mt-3">
              <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
                <AlertTriangle size={12} /> Tips
              </p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {result.tips.map((tip, i) => <li key={i}>• {tip}</li>)}
              </ul>
            </div>
          )}

          <p className="text-[10px] text-muted-foreground mt-3 italic">
            ⚠ Requirements vary by institution. Always verify directly with the provider.
          </p>
        </div>
      )}
    </div>
  );
}
