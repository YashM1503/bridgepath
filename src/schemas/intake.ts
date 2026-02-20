import { z } from "zod";

export const OriginCountryEnum = z.enum(["india", "china", "mexico", "colombia", "brazil", "other"]);
export type OriginCountry = z.infer<typeof OriginCountryEnum>;

export const VisaTypeEnum = z.enum(["F-1", "J-1", "H-1B", "H-4", "L-1", "TN", "O-1", "EB", "DACA", "Asylum", "Pending", "Other"]);
export type VisaType = z.infer<typeof VisaTypeEnum>;

export const PersonStatusEnum = z.enum(["student", "worker", "dependent", "entrepreneur", "other"]);
export type PersonStatus = z.infer<typeof PersonStatusEnum>;

export const SSNStatusEnum = z.enum(["has_ssn", "has_itin", "applied_ssn", "applied_itin", "none"]);
export type SSNStatus = z.infer<typeof SSNStatusEnum>;

export const SavingsBandEnum = z.enum(["under_1k", "1k_5k", "5k_20k", "20k_plus"]);
export type SavingsBand = z.infer<typeof SavingsBandEnum>;

export const HomeCurrencyEnum = z.enum(["INR", "CNY", "MXN", "COP", "BRL", "Other"]);
export type HomeCurrency = z.infer<typeof HomeCurrencyEnum>;

export const FeeSensitivityEnum = z.enum(["very_sensitive", "moderate", "not_sensitive"]);
export type FeeSensitivity = z.infer<typeof FeeSensitivityEnum>;

export const LanguagePreferenceEnum = z.enum(["english", "spanish", "mandarin", "hindi", "portuguese", "other"]);
export type LanguagePreference = z.infer<typeof LanguagePreferenceEnum>;

export const IntakeFormSchema = z.object({
  // Step 1: Identity
  originCountry: OriginCountryEnum,
  destinationZip: z.string().regex(/^\d{5}(-\d{4})?$/, "Enter a valid US ZIP code"),
  status: PersonStatusEnum,
  visaType: VisaTypeEnum,

  // Step 2: Financial status
  ssnStatus: SSNStatusEnum,
  payrollStartDate: z.string().optional(),
  savingsBand: SavingsBandEnum,
  homeCurrency: HomeCurrencyEnum,

  // Step 3: Situational
  hasHousing: z.boolean(),
  hasPhone: z.boolean(),
  feeSensitivity: FeeSensitivityEnum,
  languagePreference: LanguagePreferenceEnum,
  sendMoneyHome: z.boolean(),
  primaryGoal: z.enum(["bank_asap", "build_credit", "save_fees", "send_money", "all"]),
});

export type IntakeForm = z.infer<typeof IntakeFormSchema>;

// Output schemas
export const ScoreSchema = z.object({
  cost: z.number().min(0).max(100),
  speed: z.number().min(0).max(100),
  access: z.number().min(0).max(100),
  risk: z.number().min(0).max(100),
});

export const PathwaySchema = z.object({
  id: z.string(),
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  scores: ScoreSchema,
  confidence: z.number().min(0).max(100),
  recommended: z.boolean(),
  bankingArchetypeId: z.string(),
  transferArchetypeId: z.string().optional(),
  creditArchetypeId: z.string().optional(),
  assumptions: z.array(z.string()),
  steps: z.array(z.string()),
  estimatedDays: z.number(),
  verifyNote: z.string(),
});

export const RiskFlagSchema = z.object({
  id: z.string(),
  severity: z.enum(["high", "medium", "low"]),
  title: z.string(),
  description: z.string(),
  mitigation: z.string(),
  corridor: z.string().optional(),
});

export const ChecklistItemSchema = z.object({
  id: z.string(),
  week: z.number().min(1).max(4),
  day: z.number().optional(),
  task: z.string(),
  category: z.enum(["banking", "credit", "transfer", "documents", "housing", "safety"]),
  priority: z.enum(["critical", "high", "medium"]),
  done: z.boolean().default(false),
  notes: z.string().optional(),
});

export const DocumentTemplateSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  body: z.string(),
  variables: z.array(z.string()),
  category: z.string(),
});

export const PipelineOutputSchema = z.object({
  profile: z.object({
    corridorId: z.string(),
    riskLevel: z.enum(["low", "medium", "high"]),
    primaryConstraint: z.string(),
  }),
  pathways: z.array(PathwaySchema).min(2).max(4),
  riskFlags: z.array(RiskFlagSchema),
  checklist: z.array(ChecklistItemSchema),
  templates: z.array(DocumentTemplateSchema),
  generatedAt: z.string(),
  disclaimer: z.string(),
});

export type Score = z.infer<typeof ScoreSchema>;
export type Pathway = z.infer<typeof PathwaySchema>;
export type RiskFlag = z.infer<typeof RiskFlagSchema>;
export type ChecklistItem = z.infer<typeof ChecklistItemSchema>;
export type DocumentTemplate = z.infer<typeof DocumentTemplateSchema>;
export type PipelineOutput = z.infer<typeof PipelineOutputSchema>;
