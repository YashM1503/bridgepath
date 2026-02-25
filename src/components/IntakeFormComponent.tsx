import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IntakeFormSchema, type IntakeForm } from "@/schemas/intake";
import { useLanguage } from "@/i18n/LanguageContext";
import { ChevronRight, ChevronLeft, Globe, Briefcase, CreditCard, Settings2 } from "lucide-react";

interface IntakeFormProps {
  onComplete: (data: IntakeForm) => void;
}

const STEPS = [
  { key: "origin", icon: Globe },
  { key: "status", icon: Briefcase },
  { key: "finances", icon: CreditCard },
  { key: "preferences", icon: Settings2 },
] as const;

type StepKey = 0 | 1 | 2 | 3;

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
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`text-left px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
            value === opt.value
              ? "border-accent bg-accent/5 text-foreground shadow-sm"
              : "border-border bg-card text-foreground hover:border-accent/40 hover:bg-muted/50"
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
          ? "border-accent bg-accent/5"
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
            value ? "bg-accent" : "bg-muted"
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
  const { t } = useLanguage();
  const [step, setStep] = useState<StepKey>(0);

  const stepLabels = [
    t("intake.step.origin"),
    t("intake.step.status"),
    t("intake.step.finances"),
    t("intake.step.preferences"),
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
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
    0: ["originCountry", "destinationZip"],
    1: ["status", "visaType"],
    2: ["ssnStatus", "savingsBand", "homeCurrency"],
    3: ["hasHousing", "hasPhone", "feeSensitivity", "languagePreference", "sendMoneyHome", "primaryGoal"],
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

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto">
      {/* Step indicator - matching reference design */}
      <div className="flex items-center justify-between mb-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === step;
          const isCompleted = i < step;
          return (
            <React.Fragment key={s.key}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all ${
                    isCompleted
                      ? "bg-accent text-accent-foreground"
                      : isActive
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? "✓" : <Icon size={16} />}
                </div>
                <span className={`text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {stepLabels[i]}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 ${i < step ? "bg-accent" : "bg-border"}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted rounded-full mb-8 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, background: "hsl(var(--accent))" }}
        />
      </div>

      {/* Card wrapper */}
      <div className="bp-card p-6 sm:p-8 animate-fade-in">
        {/* Step 0: Origin */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">{t("intake.origin.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("intake.origin.desc")}</p>
            </div>

            <Controller
              name="originCountry"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("intake.origin.country")} *</label>
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
                  <label className="block text-sm font-medium text-foreground mb-2">{t("intake.origin.zip")} *</label>
                  <input
                    {...field}
                    placeholder="e.g. 94105"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{t("intake.origin.zipHint")}</p>
                  {errors.destinationZip && <p className="text-destructive text-xs mt-1">{errors.destinationZip.message}</p>}
                </div>
              )}
            />
          </div>
        )}

        {/* Step 1: Status */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">{t("intake.status.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("intake.status.desc")}</p>
            </div>

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("intake.status.label")}</label>
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
                  <label className="block text-sm font-medium text-foreground mb-2">{t("intake.status.visa")}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {visaTypes.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => field.onChange(opt.value)}
                        className={`text-left px-3 py-2 rounded-lg border-2 text-xs font-medium transition-all ${
                          field.value === opt.value
                            ? "border-accent bg-accent/5 text-foreground"
                            : "border-border bg-card text-foreground hover:border-accent/40"
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

        {/* Step 2: Financial */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">{t("intake.financial.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("intake.financial.desc")}</p>
            </div>

            <Controller
              name="ssnStatus"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("intake.financial.ssn")}</label>
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
                  <label className="block text-sm font-medium text-foreground mb-2">{t("intake.financial.savings")}</label>
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
                  <label className="block text-sm font-medium text-foreground mb-2">{t("intake.financial.currency")}</label>
                  <SelectGrid options={currencies} value={field.value} onChange={field.onChange} cols={3} />
                </div>
              )}
            />

            <Controller
              name="payrollStartDate"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("intake.financial.payroll")}</label>
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

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">{t("intake.prefs.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("intake.prefs.desc")}</p>
            </div>

            <Controller
              name="hasHousing"
              control={control}
              render={({ field }) => (
                <ToggleCard value={field.value} onChange={field.onChange} label={t("intake.prefs.housing")} description={t("intake.prefs.housingDesc")} />
              )}
            />

            <Controller
              name="hasPhone"
              control={control}
              render={({ field }) => (
                <ToggleCard value={field.value} onChange={field.onChange} label={t("intake.prefs.phone")} description={t("intake.prefs.phoneDesc")} />
              )}
            />

            <Controller
              name="sendMoneyHome"
              control={control}
              render={({ field }) => (
                <ToggleCard value={field.value} onChange={field.onChange} label={t("intake.prefs.sendMoney")} description={t("intake.prefs.sendMoneyDesc")} />
              )}
            />

            <Controller
              name="feeSensitivity"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("intake.prefs.feeSensitivity")}</label>
                  <SelectGrid options={feeSensitivities} value={field.value} onChange={field.onChange} cols={1} />
                </div>
              )}
            />

            <Controller
              name="languagePreference"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("intake.prefs.language")}</label>
                  <SelectGrid options={languagePrefs} value={field.value} onChange={field.onChange} cols={3} />
                </div>
              )}
            />

            <Controller
              name="primaryGoal"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t("intake.prefs.goal")}</label>
                  <SelectGrid options={primaryGoals} value={field.value} onChange={field.onChange} cols={1} />
                </div>
              )}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 px-5 py-3 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-all"
          >
            <ChevronLeft size={16} /> {t("intake.back")}
          </button>
        )}
        <div className="flex-1" />
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-lg accent-gradient text-accent-foreground text-sm font-semibold transition-all hover:shadow-lg"
          >
            {t("intake.continue")} <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-lg accent-gradient text-accent-foreground text-sm font-semibold transition-all hover:shadow-lg"
          >
            {t("intake.submit")} <ChevronRight size={16} />
          </button>
        )}
      </div>
    </form>
  );
}
