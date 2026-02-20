import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IntakeFormSchema, type IntakeForm } from "@/schemas/intake";
import { ChevronRight, ChevronLeft, Globe, Briefcase, CreditCard, Settings2 } from "lucide-react";

interface IntakeFormProps {
  onComplete: (data: IntakeForm) => void;
}

const STEPS = [
  { label: "Identity", icon: Globe },
  { label: "Financial", icon: CreditCard },
  { label: "Situation", icon: Settings2 },
];

type StepKey = 0 | 1 | 2;

const countries = [
  { value: "india", label: "🇮🇳 India" },
  { value: "china", label: "🇨🇳 China" },
  { value: "mexico", label: "🇲🇽 Mexico" },
  { value: "colombia", label: "🇨🇴 Colombia" },
  { value: "brazil", label: "🇧🇷 Brazil" },
  { value: "other", label: "🌐 Other" },
];

const statuses = [
  { value: "student", label: "Student" },
  { value: "worker", label: "Worker / Employee" },
  { value: "dependent", label: "Dependent" },
  { value: "entrepreneur", label: "Entrepreneur" },
  { value: "other", label: "Other" },
];

const visaTypes = [
  { value: "F-1", label: "F-1 (Student)" },
  { value: "J-1", label: "J-1 (Exchange)" },
  { value: "H-1B", label: "H-1B (Specialty Occupation)" },
  { value: "H-4", label: "H-4 (Dependent)" },
  { value: "L-1", label: "L-1 (Intracompany Transfer)" },
  { value: "TN", label: "TN (NAFTA/USMCA)" },
  { value: "O-1", label: "O-1 (Extraordinary Ability)" },
  { value: "EB", label: "EB (Employment-Based GC)" },
  { value: "DACA", label: "DACA" },
  { value: "Asylum", label: "Asylum / Refugee" },
  { value: "Pending", label: "Pending" },
  { value: "Other", label: "Other" },
];

const ssnStatuses = [
  { value: "has_ssn", label: "I have an SSN" },
  { value: "has_itin", label: "I have an ITIN" },
  { value: "applied_ssn", label: "Applied for SSN (pending)" },
  { value: "applied_itin", label: "Applied for ITIN (pending)" },
  { value: "none", label: "No SSN or ITIN yet" },
];

const savingsBands = [
  { value: "under_1k", label: "Under $1,000" },
  { value: "1k_5k", label: "$1,000 – $5,000" },
  { value: "5k_20k", label: "$5,000 – $20,000" },
  { value: "20k_plus", label: "$20,000+" },
];

const currencies = [
  { value: "INR", label: "INR – Indian Rupee" },
  { value: "CNY", label: "CNY – Chinese Yuan" },
  { value: "MXN", label: "MXN – Mexican Peso" },
  { value: "COP", label: "COP – Colombian Peso" },
  { value: "BRL", label: "BRL – Brazilian Real" },
  { value: "Other", label: "Other" },
];

const feeSensitivities = [
  { value: "very_sensitive", label: "Very fee-conscious — I want the cheapest option" },
  { value: "moderate", label: "Moderate — I'll pay a little for convenience" },
  { value: "not_sensitive", label: "Not sensitive — speed and reliability matter more" },
];

const languagePrefs = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Español" },
  { value: "mandarin", label: "普通话 (Mandarin)" },
  { value: "hindi", label: "हिन्दी (Hindi)" },
  { value: "portuguese", label: "Português" },
  { value: "other", label: "Other" },
];

const primaryGoals = [
  { value: "bank_asap", label: "🏦 Get a bank account ASAP" },
  { value: "build_credit", label: "📈 Start building US credit" },
  { value: "save_fees", label: "💰 Minimize fees" },
  { value: "send_money", label: "🌍 Send money home affordably" },
  { value: "all", label: "✨ All of the above" },
];

function SelectGrid({
  options,
  value,
  onChange,
  cols = 2,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  cols?: number;
}) {
  return (
    <div className={`grid gap-2 grid-cols-${cols}`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`text-left px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
            value === opt.value
              ? "border-primary bg-primary text-primary-foreground shadow-md"
              : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted/50"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ToggleCard({
  value,
  onChange,
  label,
  description,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`w-full text-left px-4 py-4 rounded-lg border-2 transition-all ${
        value
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-border/70"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-sm text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <div
          className={`w-10 h-6 rounded-full transition-all flex items-center ${
            value ? "bg-primary" : "bg-muted"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-card shadow-sm transition-all mx-1 ${
              value ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </div>
      </div>
    </button>
  );
}

export default function IntakeFormComponent({ onComplete }: IntakeFormProps) {
  const [step, setStep] = useState<StepKey>(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<IntakeForm>({
    resolver: zodResolver(IntakeFormSchema),
    defaultValues: {
      originCountry: undefined,
      destinationZip: "",
      status: undefined,
      visaType: undefined,
      ssnStatus: undefined,
      savingsBand: undefined,
      homeCurrency: "INR",
      hasHousing: false,
      hasPhone: false,
      feeSensitivity: "moderate",
      languagePreference: "english",
      sendMoneyHome: false,
      primaryGoal: "all",
    },
  });

  const stepFields: Record<number, (keyof IntakeForm)[]> = {
    0: ["originCountry", "destinationZip", "status", "visaType"],
    1: ["ssnStatus", "savingsBand", "homeCurrency"],
    2: ["hasHousing", "hasPhone", "feeSensitivity", "languagePreference", "sendMoneyHome", "primaryGoal"],
  };

  async function handleNext() {
    const valid = await trigger(stepFields[step] as (keyof IntakeForm)[]);
    if (valid) setStep((s) => (s + 1) as StepKey);
  }

  function handleBack() {
    setStep((s) => (s - 1) as StepKey);
  }

  const onSubmit = (data: IntakeForm) => {
    onComplete(data);
  };

  const StepIcon = STEPS[step].icon;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <React.Fragment key={s.label}>
              <div className="flex items-center gap-2">
                <div
                  className={`step-indicator ${
                    i < step ? "completed" : i === step ? "active" : "pending"
                  }`}
                >
                  {i < step ? "✓" : <Icon size={14} />}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:inline ${
                    i === step ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px ${i < step ? "bg-success" : "bg-border"}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="animate-fade-in">
        {/* Step 0: Identity */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">Where are you coming from?</h2>
              <p className="text-sm text-muted-foreground">We'll customize recommendations for your corridor.</p>
            </div>

            <Controller
              name="originCountry"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Origin Country</label>
                  <SelectGrid options={countries} value={field.value} onChange={field.onChange} cols={3} />
                  {errors.originCountry && <p className="text-destructive text-xs mt-1">{errors.originCountry.message}</p>}
                </div>
              )}
            />

            <Controller
              name="destinationZip"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Destination ZIP Code</label>
                  <input
                    {...field}
                    placeholder="e.g. 10001"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {errors.destinationZip && <p className="text-destructive text-xs mt-1">{errors.destinationZip.message}</p>}
                </div>
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Your Status</label>
                  <SelectGrid options={statuses} value={field.value} onChange={field.onChange} cols={3} />
                  {errors.status && <p className="text-destructive text-xs mt-1">{errors.status.message}</p>}
                </div>
              )}
            />

            <Controller
              name="visaType"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Visa Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {visaTypes.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => field.onChange(opt.value)}
                        className={`text-left px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all ${
                          field.value === opt.value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-foreground hover:border-primary/50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {errors.visaType && <p className="text-destructive text-xs mt-1">{errors.visaType.message}</p>}
                </div>
              )}
            />
          </div>
        )}

        {/* Step 1: Financial */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">Your financial picture</h2>
              <p className="text-sm text-muted-foreground">No exact amounts needed — ranges help us match you to the right options.</p>
            </div>

            <Controller
              name="ssnStatus"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">SSN / ITIN Status</label>
                  <SelectGrid options={ssnStatuses} value={field.value} onChange={field.onChange} cols={1} />
                  {errors.ssnStatus && <p className="text-destructive text-xs mt-1">{errors.ssnStatus.message}</p>}
                </div>
              )}
            />

            <Controller
              name="savingsBand"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Approximate Savings Available (USD)</label>
                  <SelectGrid options={savingsBands} value={field.value} onChange={field.onChange} cols={2} />
                  {errors.savingsBand && <p className="text-destructive text-xs mt-1">{errors.savingsBand.message}</p>}
                </div>
              )}
            />

            <Controller
              name="homeCurrency"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Home Currency</label>
                  <SelectGrid options={currencies} value={field.value} onChange={field.onChange} cols={3} />
                  {errors.homeCurrency && <p className="text-destructive text-xs mt-1">{errors.homeCurrency.message}</p>}
                </div>
              )}
            />

            <Controller
              name="payrollStartDate"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Payroll Start Date (optional)</label>
                  <input
                    {...field}
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              )}
            />
          </div>
        )}

        {/* Step 2: Situation */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">Your situation & preferences</h2>
              <p className="text-sm text-muted-foreground">These details help us flag risks and prioritize your action plan.</p>
            </div>

            <Controller
              name="hasHousing"
              control={control}
              render={({ field }) => (
                <ToggleCard
                  value={field.value}
                  onChange={field.onChange}
                  label="I have a US address established"
                  description="Temporary housing, employer housing, or confirmed lease counts"
                />
              )}
            />

            <Controller
              name="hasPhone"
              control={control}
              render={({ field }) => (
                <ToggleCard
                  value={field.value}
                  onChange={field.onChange}
                  label="I have a US phone number"
                  description="Required for 2FA on all US bank accounts"
                />
              )}
            />

            <Controller
              name="sendMoneyHome"
              control={control}
              render={({ field }) => (
                <ToggleCard
                  value={field.value}
                  onChange={field.onChange}
                  label="I plan to send money home regularly"
                  description="We'll include remittance recommendations and fee comparisons"
                />
              )}
            />

            <Controller
              name="feeSensitivity"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Fee Sensitivity</label>
                  <SelectGrid options={feeSensitivities} value={field.value} onChange={field.onChange} cols={1} />
                </div>
              )}
            />

            <Controller
              name="languagePreference"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Language Preference</label>
                  <SelectGrid options={languagePrefs} value={field.value} onChange={field.onChange} cols={3} />
                </div>
              )}
            />

            <Controller
              name="primaryGoal"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Primary Goal (first 30 days)</label>
                  <SelectGrid options={primaryGoals} value={field.value} onChange={field.onChange} cols={1} />
                </div>
              )}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 px-5 py-3 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-all"
          >
            <ChevronLeft size={16} /> Back
          </button>
        )}
        <div className="flex-1" />
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all"
            style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
          >
            Continue <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3 rounded-lg text-sm font-semibold transition-all amber-gradient"
            style={{ color: "hsl(var(--accent-gold-foreground))" }}
          >
            Generate My Plan <ChevronRight size={16} />
          </button>
        )}
      </div>
    </form>
  );
}
