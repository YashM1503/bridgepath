// Ballpark cost reference for US immigration & financial onboarding.
// STRICTLY INFORMATIONAL. Fees change frequently — every entry links to the
// official fee schedule so users can verify the current amount themselves.

export interface CostItem {
  id: string;
  name: string;
  code?: string;
  category: "visa" | "status" | "documents" | "travel" | "financial" | "legal";
  /** Ballpark government fee in USD. Use `null` when it varies too much to quote. */
  govFeeUsd: number | null;
  /** Extra out-of-pocket costs users routinely forget (photos, biometrics, courier, translation). */
  extrasUsd?: string;
  typicalTimeline: string;
  notes: string;
  officialUrl: string;
  officialLabel: string;
  corridors: string[];
}

export const LAST_VERIFIED = "2026-07";

export const COST_ITEMS: CostItem[] = [
  // ─── Visas / consular ───
  {
    id: "ds160-nonimmigrant",
    name: "Nonimmigrant visa application (DS-160)",
    code: "B-1/B-2, F, M, J",
    category: "visa",
    govFeeUsd: 185,
    extrasUsd: "Photos $10–20; travel to consulate; courier return $15–30",
    typicalTimeline: "Interview wait varies by post (days to 12+ months)",
    notes:
      "Machine-readable visa (MRV) fee. Non-refundable and generally non-transferable. Petition-based categories cost more.",
    officialUrl: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/fees/fees-visa-services.html",
    officialLabel: "State Dept — Visa fee schedule",
    corridors: ["india", "china", "latam"],
  },
  {
    id: "petition-based-visa",
    name: "Petition-based work visa fee (H, L, O, P, Q, R)",
    code: "H-1B / L-1 / O-1",
    category: "visa",
    govFeeUsd: 205,
    extrasUsd: "Employer usually pays petition costs; some are illegal to pass to the worker",
    typicalTimeline: "After petition approval; consular wait varies",
    notes:
      "This is the applicant's consular fee only. The employer's I-129 petition, fraud-prevention and ACWIA fees are separate and are normally the employer's legal responsibility.",
    officialUrl: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/fees/fees-visa-services.html",
    officialLabel: "State Dept — Visa fee schedule",
    corridors: ["india", "china", "latam"],
  },
  {
    id: "sevis-f-m",
    name: "SEVIS I-901 fee — students",
    code: "F-1 / M-1",
    category: "visa",
    govFeeUsd: 350,
    extrasUsd: "Paid before the visa interview; keep the receipt",
    typicalTimeline: "Instant to 3 business days for receipt",
    notes: "Separate from the DS-160 visa fee. J-1 exchange visitors generally pay a lower SEVIS fee.",
    officialUrl: "https://www.fmjfee.com/",
    officialLabel: "ICE — I-901 SEVIS fee",
    corridors: ["india", "china", "latam"],
  },
  {
    id: "visa-reciprocity",
    name: "Visa issuance (reciprocity) fee",
    category: "visa",
    govFeeUsd: null,
    typicalTimeline: "Paid at issuance",
    notes:
      "Depends entirely on your nationality and visa class — $0 for many countries, several hundred dollars for others. Check the reciprocity table for your country before budgeting.",
    officialUrl: "https://travel.state.gov/content/travel/en/us-visas/Visa-Reciprocity-and-Civil-Documents-by-Country.html",
    officialLabel: "State Dept — Reciprocity by country",
    corridors: ["india", "china", "latam"],
  },
  {
    id: "esta",
    name: "ESTA (Visa Waiver Program)",
    category: "travel",
    govFeeUsd: 21,
    typicalTimeline: "Minutes to 72 hours",
    notes:
      "Only for VWP countries — India, China and most of Latin America are not eligible. Use only the official .gov site; lookalike sites charge large markups.",
    officialUrl: "https://esta.cbp.dhs.gov/",
    officialLabel: "CBP — Official ESTA",
    corridors: ["latam"],
  },

  // ─── Status / USCIS ───
  {
    id: "i-765-ead",
    name: "Work permit (EAD)",
    code: "Form I-765",
    category: "status",
    govFeeUsd: 470,
    extrasUsd: "Online filing is typically cheaper than paper; fee waivers exist for some categories",
    typicalTimeline: "Roughly 2–8 months depending on category and service center",
    notes: "Some categories (e.g. certain adjustment-of-status applicants) file at no additional cost.",
    officialUrl: "https://www.uscis.gov/g-1055",
    officialLabel: "USCIS — Fee schedule (G-1055)",
    corridors: ["india", "china", "latam"],
  },
  {
    id: "i-485-aos",
    name: "Adjustment of status (green card from inside the US)",
    code: "Form I-485",
    category: "status",
    govFeeUsd: 1440,
    extrasUsd: "Medical exam (I-693) $200–500 per person, not covered by the filing fee",
    typicalTimeline: "Commonly 8–24 months; varies widely by category and country of birth",
    notes: "Separate fees may apply for the accompanying work permit and travel document.",
    officialUrl: "https://www.uscis.gov/g-1055",
    officialLabel: "USCIS — Fee schedule (G-1055)",
    corridors: ["india", "china", "latam"],
  },
  {
    id: "i-131-ap",
    name: "Travel document / advance parole",
    code: "Form I-131",
    category: "status",
    govFeeUsd: 630,
    typicalTimeline: "Several months — do not book non-refundable travel first",
    notes: "Leaving the US without an approved travel document can abandon a pending application.",
    officialUrl: "https://www.uscis.gov/g-1055",
    officialLabel: "USCIS — Fee schedule (G-1055)",
    corridors: ["india", "china", "latam"],
  },
  {
    id: "i-539-extend",
    name: "Extend / change nonimmigrant status",
    code: "Form I-539",
    category: "status",
    govFeeUsd: 470,
    typicalTimeline: "3–10 months",
    notes: "Online filing is generally cheaper than paper filing. Each dependent may need their own filing.",
    officialUrl: "https://www.uscis.gov/g-1055",
    officialLabel: "USCIS — Fee schedule (G-1055)",
    corridors: ["india", "china", "latam"],
  },
  {
    id: "i-90-renew",
    name: "Replace / renew green card",
    code: "Form I-90",
    category: "status",
    govFeeUsd: 465,
    typicalTimeline: "6–14 months",
    notes: "Receipt notices often extend card validity while the renewal is pending.",
    officialUrl: "https://www.uscis.gov/g-1055",
    officialLabel: "USCIS — Fee schedule (G-1055)",
    corridors: ["india", "china", "latam"],
  },
  {
    id: "n-400",
    name: "Naturalization (citizenship)",
    code: "Form N-400",
    category: "status",
    govFeeUsd: 760,
    extrasUsd: "Reduced fee and fee-waiver options exist based on household income",
    typicalTimeline: "Commonly 6–14 months",
    notes: "Online filing is usually cheaper than paper. Check the income-based reduced-fee request.",
    officialUrl: "https://www.uscis.gov/g-1055",
    officialLabel: "USCIS — Fee schedule (G-1055)",
    corridors: ["india", "china", "latam"],
  },
  {
    id: "premium-processing",
    name: "Premium processing (optional speed-up)",
    code: "Form I-907",
    category: "status",
    govFeeUsd: null,
    typicalTimeline: "15 business or calendar days depending on form type",
    notes:
      "Runs roughly $1,700–$2,900 depending on the underlying form. It buys a faster decision, not a better one.",
    officialUrl: "https://www.uscis.gov/forms/all-forms/how-do-i-request-premium-processing",
    officialLabel: "USCIS — Premium processing",
    corridors: ["india", "china", "latam"],
  },

  // ─── Documents & identity ───
  {
    id: "ssn",
    name: "Social Security number (SSN)",
    category: "documents",
    govFeeUsd: 0,
    typicalTimeline: "2–6 weeks after arrival records sync",
    notes:
      "Always free. Anyone charging you to 'get an SSN' is a scam. Wait ~10 days after arrival so your entry record propagates.",
    officialUrl: "https://www.ssa.gov/number-card",
    officialLabel: "SSA — Get an SSN",
    corridors: ["india", "china", "latam"],
  },
  {
    id: "itin",
    name: "ITIN — taxpayer ID for those ineligible for an SSN",
    code: "Form W-7",
    category: "documents",
    govFeeUsd: 0,
    extrasUsd: "Certified Acceptance Agent $50–250 if you don't want to mail your passport",
    typicalTimeline: "Roughly 7–14 weeks; longer in tax season",
    notes: "The IRS charges nothing. Costs come only from optional acceptance agents or certified copies.",
    officialUrl: "https://www.irs.gov/individuals/individual-taxpayer-identification-number",
    officialLabel: "IRS — ITIN",
    corridors: ["india", "china", "latam"],
  },
  {
    id: "i94",
    name: "I-94 arrival record (digital copy)",
    category: "documents",
    govFeeUsd: 0,
    typicalTimeline: "Instant online",
    notes: "Free from CBP. Paid 'I-94 retrieval' sites are reselling a free government service.",
    officialUrl: "https://i94.cbp.dhs.gov/",
    officialLabel: "CBP — I-94",
    corridors: ["india", "china", "latam"],
  },
  {
    id: "state-id",
    name: "State ID card or driver's license",
    category: "documents",
    govFeeUsd: null,
    extrasUsd: "Written/road test fees, and often a translated driving record",
    typicalTimeline: "Same day to a few weeks for the card",
    notes:
      "Roughly $10–$90 depending on the state and whether it's REAL ID compliant. Requirements for non-citizens vary a lot by state.",
    officialUrl: "https://www.usa.gov/motor-vehicle-services",
    officialLabel: "USA.gov — DMV by state",
    corridors: ["india", "china", "latam"],
  },
  {
    id: "credential-eval",
    name: "Foreign credential / degree evaluation",
    category: "documents",
    govFeeUsd: null,
    typicalTimeline: "1–6 weeks (rush options cost more)",
    notes:
      "Typically $100–$400 for a course-by-course report. Ask the employer or school which evaluator they accept before paying.",
    officialUrl: "https://www.naces.org/members",
    officialLabel: "NACES — Member evaluators",
    corridors: ["india", "china", "latam"],
  },
  {
    id: "apostille-translation",
    name: "Apostille & certified translation",
    category: "documents",
    govFeeUsd: null,
    typicalTimeline: "1–4 weeks per document",
    notes:
      "Budget roughly $20–$50 per page for certified translation plus consular/apostille fees from your home country.",
    officialUrl: "https://travel.state.gov/content/travel/en/records-and-authentications/authenticate-your-document/apostille-requirements.html",
    officialLabel: "State Dept — Apostille",
    corridors: ["india", "china", "latam"],
  },

  // ─── Financial setup ───
  {
    id: "bank-account",
    name: "Opening a US bank account",
    category: "financial",
    govFeeUsd: 0,
    extrasUsd: "Opening deposit $0–100; monthly fee $0–15 (usually waivable)",
    typicalTimeline: "Same day in-branch; 1–3 days online",
    notes:
      "Many banks accept a passport + visa + proof of address without an SSN. Ask for a no-minimum or student account before accepting monthly fees.",
    officialUrl: "https://www.fdic.gov/resources/consumers/consumer-assistance-topics/opening-account.html",
    officialLabel: "FDIC — Opening an account",
    corridors: ["india", "china", "latam"],
  },
  {
    id: "secured-card",
    name: "Secured credit card (credit building)",
    category: "financial",
    govFeeUsd: null,
    typicalTimeline: "6–12 months to build a usable score",
    notes:
      "Security deposit of $200–$500 is refundable. Avoid cards with annual fees above ~$40 or mandatory 'processing' fees.",
    officialUrl: "https://www.consumerfinance.gov/consumer-tools/credit-reports-and-scores/",
    officialLabel: "CFPB — Credit basics",
    corridors: ["india", "china", "latam"],
  },
  {
    id: "remittance",
    name: "Sending money home (remittance)",
    category: "financial",
    govFeeUsd: null,
    typicalTimeline: "Minutes to 3 business days",
    notes:
      "Real cost = stated fee + exchange-rate markup. Compare the total amount received, not the advertised fee. Providers must give you a written disclosure before you pay.",
    officialUrl: "https://www.consumerfinance.gov/sending-money/",
    officialLabel: "CFPB — Sending money abroad",
    corridors: ["india", "china", "latam"],
  },
  {
    id: "credit-report",
    name: "Credit reports",
    category: "financial",
    govFeeUsd: 0,
    typicalTimeline: "Instant online",
    notes: "Free weekly from all three bureaus at the official site. Never pay a third party for this.",
    officialUrl: "https://www.annualcreditreport.com/",
    officialLabel: "AnnualCreditReport.com",
    corridors: ["india", "china", "latam"],
  },

  // ─── Legal help ───
  {
    id: "legal-help",
    name: "Immigration legal help",
    category: "legal",
    govFeeUsd: null,
    typicalTimeline: "Varies",
    notes:
      "Free or low-cost accredited representatives exist. Private attorney flat fees commonly run $1,500–$7,000+ per case. Only licensed attorneys or DOJ-accredited representatives may give immigration advice — 'notarios' may not.",
    officialUrl: "https://www.justice.gov/eoir/list-pro-bono-legal-service-providers",
    officialLabel: "DOJ — Free legal service providers",
    corridors: ["india", "china", "latam"],
  },
];

export const COST_CATEGORIES = [
  { key: "all", label: "All" },
  { key: "visa", label: "Visas" },
  { key: "status", label: "Status & USCIS" },
  { key: "documents", label: "Documents & ID" },
  { key: "financial", label: "Banking & Money" },
  { key: "legal", label: "Legal help" },
  { key: "travel", label: "Travel" },
] as const;

export function getCostsByCorridor(corridorId: string): CostItem[] {
  return COST_ITEMS.filter((c) => c.corridors.includes(corridorId));
}
