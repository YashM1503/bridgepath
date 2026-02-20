import type {
  IntakeForm,
  PipelineOutput,
  Pathway,
  RiskFlag,
  ChecklistItem,
  DocumentTemplate,
} from "@/schemas/intake";
import { getCorridorByCountry, CORRIDORS } from "@/data/corridors";
import { BANKING_ARCHETYPES, CREDIT_ARCHETYPES, TRANSFER_ARCHETYPES } from "@/data/archetypes";
import { PipelineOutputSchema } from "@/schemas/intake";

// ─── Helpers ────────────────────────────────────────────────────────────────

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function hasSsn(form: IntakeForm) {
  return form.ssnStatus === "has_ssn";
}
function hasItin(form: IntakeForm) {
  return ["has_itin", "applied_itin"].includes(form.ssnStatus);
}
function hasAnyId(form: IntakeForm) {
  return form.ssnStatus !== "none";
}

// ─── Scoring Engine ─────────────────────────────────────────────────────────

function scorePathway(
  form: IntakeForm,
  bankingId: string,
  transferId: string | undefined,
  creditId: string | undefined
) {
  const bank = BANKING_ARCHETYPES.find((b) => b.id === bankingId)!;
  const transfer = transferId ? TRANSFER_ARCHETYPES.find((t) => t.id === transferId) : undefined;
  const credit = creditId ? CREDIT_ARCHETYPES.find((c) => c.id === creditId) : undefined;

  // COST score (higher = lower cost for user)
  let cost = 70;
  if (bank.feeType === "none") cost += 15;
  if (bank.feeType === "waivable") cost += 5;
  if (bank.feeType === "monthly") cost -= 15;
  if (transfer?.feeType === "flat") cost += 5;
  if (transfer?.feeType === "percentage") cost -= 5;
  if (transfer?.feeType === "exchange-rate-spread") cost += 2;
  if (form.feeSensitivity === "very_sensitive") cost = clamp(cost + 5);

  // SPEED score (higher = faster)
  let speed = 65;
  if (bank.type === "neobank" || bank.type === "online") speed += 20;
  if (bank.type === "credit-union") speed -= 10;
  if (bank.noSSNRequired) speed += 5;
  if (!hasAnyId(form)) speed -= 15;
  if (transfer?.speedEstimate?.includes("Minutes")) speed += 10;
  if (transfer?.speedEstimate?.includes("5")) speed -= 10;

  // ACCESS score (higher = easier to get)
  let access = 60;
  if (bank.noSSNRequired) access += 15;
  if (bank.imatricula && form.originCountry !== "india" && form.originCountry !== "china") access += 8;
  if (bank.iTIN && hasItin(form)) access += 10;
  if (hasSsn(form)) access += 15;
  if (form.savingsBand === "under_1k" && bank.minOpeningDeposit === "moderate") access -= 15;
  if (form.savingsBand === "under_1k" && bank.minOpeningDeposit === "low") access -= 5;
  if (bank.minOpeningDeposit === "none") access += 5;
  if (credit && credit.iTINAccepted && hasItin(form)) access += 5;

  // RISK score (higher = lower risk)
  let risk = 70;
  if (bank.type === "traditional") risk += 15;
  if (bank.type === "credit-union") risk += 12;
  if (bank.type === "neobank") risk -= 5;
  if (transfer?.type === "wire") risk += 10;
  if (transfer?.type === "app") risk += 5;
  if (transfer?.type === "cash") risk -= 5;
  if (credit?.reportsTo?.length === 3) risk += 5;

  return {
    cost: clamp(cost),
    speed: clamp(speed),
    access: clamp(access),
    risk: clamp(risk),
  };
}

// ─── Pathway Builder ─────────────────────────────────────────────────────────

function buildPathways(form: IntakeForm): Pathway[] {
  const corridorId = getCorridorByCountry(form.originCountry);
  const corridor = CORRIDORS[corridorId];
  const noSsn = !hasSsn(form);

  // Select banking archetypes applicable to corridor
  const applicableBanks = BANKING_ARCHETYPES.filter((b) =>
    b.corridors.includes(corridorId)
  );

  // Pathway A: Fast Access (Neobank or Online)
  const fastBank = noSsn
    ? (applicableBanks.find((b) => b.noSSNRequired && b.type === "neobank") ?? applicableBanks[0])
    : (applicableBanks.find((b) => b.type === "online") ?? applicableBanks[0]);

  const fastTransfer = TRANSFER_ARCHETYPES.find(
    (t) => t.corridors.includes(corridorId) && t.type === "app"
  );
  const fastCredit = CREDIT_ARCHETYPES.find(
    (c) => c.corridors.includes(corridorId) && c.type === "secured-card"
  );

  // Pathway B: Traditional + Full Credit
  const tradBank = applicableBanks.find((b) => b.type === "traditional") ?? applicableBanks[0];
  const tradTransfer = TRANSFER_ARCHETYPES.find(
    (t) => t.corridors.includes(corridorId) && t.type === "wire"
  );
  const tradCredit = CREDIT_ARCHETYPES.find(
    (c) => c.corridors.includes(corridorId) && c.type !== "credit-builder-loan"
  );

  // Pathway C: Community / Credit Union
  const cuBank = applicableBanks.find((b) => b.type === "credit-union") ?? applicableBanks[0];
  const cuCredit = CREDIT_ARCHETYPES.find((c) => c.type === "credit-builder-loan");

  // Pathway D: Global Credit Transfer (India/China professional visas)
  const globalCredit = CREDIT_ARCHETYPES.find((c) => c.id === "global-credit-transfer");
  const isProVisa = ["H-1B", "L-1", "O-1"].includes(form.visaType);

  const pathways: Pathway[] = [];

  // Path A
  const scoresA = scorePathway(form, fastBank.id, fastTransfer?.id, fastCredit?.id);
  pathways.push({
    id: "path-a",
    name: "Fast Start",
    tagline: "Bank open in 24–48 hours, no SSN needed",
    description: `Use ${fastBank.name} to get a US account within days using your passport and visa. Begin building credit immediately with a secured card.`,
    scores: scoresA,
    confidence: noSsn ? 85 : 90,
    recommended: form.primaryGoal === "bank_asap" || noSsn,
    bankingArchetypeId: fastBank.id,
    transferArchetypeId: fastTransfer?.id,
    creditArchetypeId: fastCredit?.id,
    assumptions: [
      "Passport and valid US visa available",
      "Smartphone with US number (or temporary)",
      noSsn ? "SSN/ITIN not yet obtained" : "SSN available",
    ],
    steps: [
      `Open ${fastBank.name} account online (passport + visa)`,
      "Fund with international wire or cash deposit",
      `Apply for ${fastCredit?.name ?? "secured card"} to start US credit`,
      "Set up payroll direct deposit once employed",
      fastTransfer ? `Register with ${fastTransfer.name} for home country transfers` : "Compare remittance options",
    ],
    estimatedDays: 3,
    verifyNote: "Verify current ID requirements directly with the institution before applying.",
  });

  // Path B
  const scoresB = scorePathway(form, tradBank.id, tradTransfer?.id, tradCredit?.id);
  pathways.push({
    id: "path-b",
    name: "Traditional Route",
    tagline: "Established banking with full services",
    description: `Open a major national bank account for wider acceptance, ATM access, and full-service banking. Best if you already have SSN or ITIN.`,
    scores: scoresB,
    confidence: hasSsn(form) ? 90 : 65,
    recommended: form.primaryGoal === "build_credit" && hasSsn(form),
    bankingArchetypeId: tradBank.id,
    transferArchetypeId: tradTransfer?.id,
    creditArchetypeId: tradCredit?.id,
    assumptions: [
      hasSsn(form) ? "SSN available" : "ITIN or SSN application in progress",
      "Minimum opening deposit available",
      "US address established",
    ],
    steps: [
      `Visit ${tradBank.name} branch with passport, visa, and proof of address`,
      hasSsn(form) ? "Apply for credit card or secured card" : "Apply for ITIN (IRS Form W-7) to enable credit",
      "Set up online banking and mobile app",
      "Arrange bill autopay for utilities",
      tradTransfer ? `Use ${tradTransfer.name} for international wire if needed` : "Compare wire options",
    ],
    estimatedDays: hasSsn(form) ? 5 : 14,
    verifyNote: "Branch requirements vary. Call ahead to confirm documents needed for your visa type.",
  });

  // Path C (Credit Union — more relevant for LATAM)
  const scoresC = scorePathway(form, cuBank.id, fastTransfer?.id, cuCredit?.id);
  pathways.push({
    id: "path-c",
    name: "Community Banking",
    tagline: "Lower fees, flexible requirements, member benefits",
    description: `${cuBank.name} offers more flexible ID rules, lower fees, and community lending. Ideal if you have limited savings or an ITIN.`,
    scores: scoresC,
    confidence: corridorId === "latam" ? 85 : 70,
    recommended: form.primaryGoal === "save_fees" || corridorId === "latam",
    bankingArchetypeId: cuBank.id,
    transferArchetypeId: fastTransfer?.id,
    creditArchetypeId: cuCredit?.id,
    assumptions: [
      "Eligible for credit union membership (employer, geography, or community affiliation)",
      "ITIN or Matrícula Consular available if no SSN",
      "Willing to engage with community banking model",
    ],
    steps: [
      `Verify credit union membership eligibility at ${corridor.name} community CU`,
      "Open share account (savings) as membership foundation",
      "Apply for credit-builder loan to establish payment history",
      "Add checking account after 30 days",
      "Use for bill pay and direct deposit",
    ],
    estimatedDays: 7,
    verifyNote: "Membership requirements vary by credit union. Use NCUA's credit union locator to find options near your ZIP code.",
  });

  // Path D — only for professional visa + India/China
  if ((corridorId === "india" || corridorId === "china") && isProVisa && globalCredit) {
    const scoresD = scorePathway(form, tradBank.id, fastTransfer?.id, globalCredit.id);
    pathways.push({
      id: "path-d",
      name: "Credit Transfer Route",
      tagline: "Leverage home-country credit history",
      description: `For ${corridor.name} H-1B/L-1/O-1 holders, specialized services may transfer your home-country credit history to a US credit file, bypassing the secured card step.`,
      scores: scoresD,
      confidence: 75,
      recommended: isProVisa && form.primaryGoal === "build_credit",
      bankingArchetypeId: tradBank.id,
      transferArchetypeId: fastTransfer?.id,
      creditArchetypeId: globalCredit.id,
      assumptions: [
        `H-1B, L-1, or O-1 visa holder from ${corridor.name}`,
        "Home-country credit file is healthy (no defaults)",
        "Employer has sponsored your visa",
      ],
      steps: [
        "Apply to global credit history transfer service (verify country support)",
        "Open traditional bank account with SSN",
        "Receive US credit card offer based on transferred history",
        "Begin building US credit profile immediately",
        "Monitor US credit report (free annually at AnnualCreditReport.com)",
      ],
      estimatedDays: 10,
      verifyNote: "This service has limited availability. Verify your home country is supported before relying on this path.",
    });
  }

  // Sort: recommended first, then by overall composite score
  return pathways.sort((a, b) => {
    const compositeA = (a.scores.cost + a.scores.speed + a.scores.access + a.scores.risk) / 4;
    const compositeB = (b.scores.cost + b.scores.speed + b.scores.access + b.scores.risk) / 4;
    if (a.recommended && !b.recommended) return -1;
    if (!a.recommended && b.recommended) return 1;
    return compositeB - compositeA;
  });
}

// ─── Risk Flags ───────────────────────────────────────────────────────────────

function buildRiskFlags(form: IntakeForm): RiskFlag[] {
  const corridorId = getCorridorByCountry(form.originCountry);
  const corridor = CORRIDORS[corridorId];
  const flags: RiskFlag[] = [];

  // Universal flags
  if (form.ssnStatus === "none") {
    flags.push({
      id: "no-id",
      severity: "high",
      title: "No US Tax ID (SSN/ITIN)",
      description: "Without an SSN or ITIN, most traditional banks, credit cards, and credit-reporting services are inaccessible.",
      mitigation: "Open a no-SSN account now. Apply for SSN at Social Security Administration (if eligible) or ITIN via IRS Form W-7. Allow 8–12 weeks.",
    });
  }

  if (form.savingsBand === "under_1k") {
    flags.push({
      id: "low-savings",
      severity: "medium",
      title: "Low Initial Savings",
      description: "Under $1,000 in savings may not cover security deposits, opening deposit requirements, and first month's expenses.",
      mitigation: "Prioritize no-fee or low-fee bank accounts. Explore employer advances or emergency assistance programs at your institution.",
    });
  }

  if (!form.hasHousing) {
    flags.push({
      id: "no-housing",
      severity: "high",
      title: "No Established Housing",
      description: "Banks require a US address. Landlords run credit checks — you may need alternatives.",
      mitigation: "Use employer's address for banking initially (confirm HR policy). Negotiate with landlord for larger security deposit in lieu of credit history.",
    });
  }

  if (!form.hasPhone) {
    flags.push({
      id: "no-phone",
      severity: "medium",
      title: "No US Phone Number",
      description: "Most banks require a US phone for 2FA. Online account opening is blocked without it.",
      mitigation: "Purchase a prepaid SIM before bank application. Google Voice or similar VoIP may work for some banks — verify beforehand.",
    });
  }

  // Corridor-specific
  corridor.scamWarnings.forEach((warning, i) => {
    flags.push({
      id: `scam-${corridorId}-${i}`,
      severity: "medium",
      title: "Common Scam Alert",
      description: warning,
      mitigation: "Never pay fees for free government services. Verify all financial services via official websites. When in doubt, call the official number.",
      corridor: corridorId,
    });
  });

  if (corridorId === "india" && form.savingsBand === "20k_plus") {
    flags.push({
      id: "fbar-india",
      severity: "medium",
      title: "FBAR Filing Obligation",
      description: "If you hold more than $10,000 in foreign accounts (Indian bank), you may be required to file an FBAR with FinCEN.",
      mitigation: "Consult a qualified US tax professional. FBAR filing is free via BSA E-Filing. Penalties for non-compliance are severe.",
      corridor: "india",
    });
  }

  if (corridorId === "china") {
    flags.push({
      id: "safe-quota",
      severity: "medium",
      title: "China SAFE Annual Quota",
      description: "China's State Administration of Foreign Exchange limits individual forex conversions to $50,000 USD equivalent per year.",
      mitigation: "Plan large transfers across calendar years if needed. Use a licensed FX specialist for high-volume corridors.",
      corridor: "china",
    });
  }

  if (form.visaType === "F-1") {
    flags.push({
      id: "f1-work-auth",
      severity: "medium",
      title: "F-1 Work Authorization Limits",
      description: "F-1 students have strict rules on employment. Unauthorized work can jeopardize visa status.",
      mitigation: "Confirm all employment with your Designated School Official (DSO). OPT/CPT must be authorized before starting work. This is general information — verify with your international office.",
    });
  }

  if (form.sendMoneyHome && corridorId === "latam") {
    flags.push({
      id: "remittance-fees-latam",
      severity: "low",
      title: "Remittance Fee Risk",
      description: "Remittance fees vary widely. Some neighborhood agents charge significantly above market rates.",
      mitigation: "Compare rates at CFPB's Send Money Abroad tool (consumerfinance.gov). Regulated app-based services often beat traditional agents.",
      corridor: "latam",
    });
  }

  return flags.slice(0, 8); // Cap at 8 for readability
}

// ─── 30-Day Checklist ─────────────────────────────────────────────────────────

function buildChecklist(form: IntakeForm, recommendedPathway: Pathway): ChecklistItem[] {
  const corridorId = getCorridorByCountry(form.originCountry);
  const hasSsnNow = hasSsn(form);

  const items: ChecklistItem[] = [
    // Week 1 — Critical
    {
      id: "w1-phone",
      week: 1,
      day: 1,
      task: "Get a US phone number (prepaid SIM or eSIM)",
      category: "documents",
      priority: "critical",
      done: form.hasPhone,
      notes: "Required for 2FA on all US financial accounts",
    },
    {
      id: "w1-bank",
      week: 1,
      day: 2,
      task: "Open a US bank account (use Fast Start pathway if no SSN)",
      category: "banking",
      priority: "critical",
      done: false,
      notes: "Bring passport, visa, and proof of address",
    },
    {
      id: "w1-address",
      week: 1,
      day: 1,
      task: "Establish a US mailing address (housing, mailbox service, or employer HR)",
      category: "housing",
      priority: "critical",
      done: form.hasHousing,
    },
    {
      id: "w1-fund",
      week: 1,
      day: 3,
      task: "Fund US account via international wire or cash deposit",
      category: "banking",
      priority: "high",
      done: false,
      notes: "Keep receipts for all transfers",
    },
    {
      id: "w1-ssn",
      week: 1,
      day: 5,
      task: hasSsnNow ? "Confirm SSN on file with employer HR" : "Apply for SSN at Social Security Administration (if eligible)",
      category: "documents",
      priority: "critical",
      done: hasSsnNow,
      notes: hasSsnNow ? undefined : "Bring I-94, visa, passport, and offer letter",
    },

    // Week 2 — Important
    {
      id: "w2-debit",
      week: 2,
      task: "Activate debit card and set up online banking",
      category: "banking",
      priority: "high",
      done: false,
    },
    {
      id: "w2-credit",
      week: 2,
      task: "Apply for secured credit card or credit-builder product",
      category: "credit",
      priority: "high",
      done: false,
      notes: "Use ITIN or SSN. A $200–$500 secured card starts your US credit file.",
    },
    ...(form.sendMoneyHome
      ? [
          {
            id: "w2-remit",
            week: 2,
            task: "Register with a regulated remittance service for home transfers",
            category: "transfer" as const,
            priority: "medium" as const,
            done: false,
            notes: "Compare rates at consumerfinance.gov/send-money-abroad",
          },
        ]
      : []),
    {
      id: "w2-docs",
      week: 2,
      task: "Scan and securely store all immigration and financial documents",
      category: "documents",
      priority: "high",
      done: false,
      notes: "Use encrypted cloud storage. Keep physical copies in a secure location.",
    },
    {
      id: "w2-notify",
      week: 2,
      task: `Notify home-country bank (${corridorId === "india" ? "Indian" : corridorId === "china" ? "Chinese" : "home country"} bank) of international address`,
      category: "banking",
      priority: "medium",
      done: false,
    },

    // Week 3 — Building
    {
      id: "w3-payroll",
      week: 3,
      task: "Set up direct deposit with employer payroll",
      category: "banking",
      priority: "high",
      done: false,
      notes: "Provide bank routing + account number to HR",
    },
    {
      id: "w3-autopay",
      week: 3,
      task: "Set up autopay for recurring bills (phone, utilities)",
      category: "banking",
      priority: "medium",
      done: false,
    },
    {
      id: "w3-credit-monitor",
      week: 3,
      task: "Check if credit file has been created (AnnualCreditReport.com)",
      category: "credit",
      priority: "medium",
      done: false,
      notes: "Free weekly reports available. Look for your name to confirm file creation.",
    },
    ...(corridorId === "india" && form.savingsBand === "20k_plus"
      ? [
          {
            id: "w3-fbar",
            week: 3,
            task: "Research FBAR filing obligation with a qualified tax professional",
            category: "documents" as const,
            priority: "high" as const,
            done: false,
            notes: "Consult a licensed CPA or EA. Filing is free via BSA E-Filing.",
          },
        ]
      : []),

    // Week 4 — Optimize
    {
      id: "w4-review",
      week: 4,
      task: "Review all accounts: fees, balances, and credit card usage",
      category: "banking",
      priority: "medium",
      done: false,
    },
    {
      id: "w4-emergency",
      week: 4,
      task: "Identify local emergency financial assistance programs (211.org)",
      category: "safety",
      priority: "medium",
      done: false,
    },
    {
      id: "w4-credit-use",
      week: 4,
      task: "Use credit card for 1–2 small purchases; pay in full before due date",
      category: "credit",
      priority: "high",
      done: false,
      notes: "Keep utilization under 30%. Pay in full to avoid interest.",
    },
    {
      id: "w4-plan",
      week: 4,
      task: "Plan 90-day financial goals: savings target, credit limit increase timeline",
      category: "banking",
      priority: "medium",
      done: false,
    },
  ];

  return items;
}

// ─── Document Templates ───────────────────────────────────────────────────────

function buildTemplates(form: IntakeForm): DocumentTemplate[] {
  const corridorId = getCorridorByCountry(form.originCountry);
  const lang = form.languagePreference;

  return [
    {
      id: "bank-intro-letter",
      title: "Bank Account Introduction Letter",
      description: "Use this when speaking with a bank branch representative to explain your situation.",
      body: `Dear Bank Representative,

My name is [YOUR NAME]. I recently arrived in the United States from [HOME COUNTRY] on a [VISA TYPE] visa. I am interested in opening a checking account.

I have the following documents available:
- Passport (country: [HOME COUNTRY])
- Valid US Visa ([VISA TYPE])
- [SSN / ITIN / Matricula Consular] (if applicable)
- Proof of US address: [ADDRESS DOCUMENT TYPE]

I understand that your institution may have programs for international newcomers. I would appreciate guidance on the most appropriate account type for my situation.

Thank you for your assistance.

Sincerely,
[YOUR NAME]
[YOUR PHONE]
[YOUR EMAIL]`,
      variables: ["YOUR NAME", "HOME COUNTRY", "VISA TYPE", "SSN / ITIN / Matricula Consular", "ADDRESS DOCUMENT TYPE", "YOUR PHONE", "YOUR EMAIL"],
      category: "banking",
    },
    {
      id: "landlord-credit-letter",
      title: "Landlord Credit History Explanation Letter",
      description: "Explain your lack of US credit history to prospective landlords.",
      body: `Dear [LANDLORD NAME],

I am writing to apply for the rental at [PROPERTY ADDRESS].

As a recent arrival to the United States from [HOME COUNTRY], I do not yet have a US credit history. However, I can provide:

1. Employment verification letter from [EMPLOYER NAME]
2. Offer letter confirming salary of [SALARY RANGE, e.g., "in the $XX,000–$XX,000 range"]
3. Bank statements showing [SAVINGS BAND, e.g., "sufficient funds"]
4. References from [HOME COUNTRY EMPLOYER / UNIVERSITY]

I am prepared to offer [X MONTHS] of security deposit as assurance of my commitment to fulfilling the lease terms.

I am happy to provide any additional documentation at your request.

Respectfully,
[YOUR NAME]
[YOUR PHONE]
[YOUR EMAIL]`,
      variables: ["LANDLORD NAME", "PROPERTY ADDRESS", "HOME COUNTRY", "EMPLOYER NAME", "SALARY RANGE", "SAVINGS BAND", "X MONTHS", "YOUR NAME", "YOUR PHONE", "YOUR EMAIL"],
      category: "housing",
    },
    {
      id: "employer-payroll-setup",
      title: "Payroll Direct Deposit Setup Message",
      description: "Send to HR to set up direct deposit to your new US bank account.",
      body: `Hi [HR CONTACT NAME],

I'd like to set up direct deposit for my payroll to my US bank account. Here are my banking details:

Bank Name: [BANK NAME]
Account Type: Checking
Routing Number: [ROUTING NUMBER]
Account Number: [ACCOUNT NUMBER]

Please let me know if you need a voided check or any additional documentation. I'd like this to take effect starting [PAYROLL START DATE].

Thank you,
[YOUR NAME]`,
      variables: ["HR CONTACT NAME", "BANK NAME", "ROUTING NUMBER", "ACCOUNT NUMBER", "PAYROLL START DATE", "YOUR NAME"],
      category: "banking",
    },
    ...(form.sendMoneyHome
      ? [
          {
            id: "remittance-record",
            title: "International Transfer Record Template",
            description: "Keep records of all international transfers for tax and FBAR purposes.",
            body: `INTERNATIONAL TRANSFER RECORD
Date: [DATE]
Sender: [YOUR NAME]
Recipient: [RECIPIENT NAME]
Recipient Relationship: [RELATIONSHIP]
Sending from: US Bank — [BANK NAME]
Receiving at: [HOME COUNTRY BANK]
Amount Sent (USD): $[AMOUNT]
Exchange Rate Applied: [RATE]
Fees Paid: $[FEES]
Amount Received ([HOME CURRENCY]): [AMOUNT IN HOME CURRENCY]
Service Used: [SERVICE NAME]
Reference/Confirmation Number: [CONFIRMATION NUMBER]
Purpose: [e.g., Family support / Living expenses]

Note: Keep this record for US tax purposes. Consult a qualified tax professional regarding reporting obligations.`,
            variables: ["DATE", "YOUR NAME", "RECIPIENT NAME", "RELATIONSHIP", "BANK NAME", "HOME COUNTRY BANK", "AMOUNT", "RATE", "FEES", "AMOUNT IN HOME CURRENCY", "HOME CURRENCY", "SERVICE NAME", "CONFIRMATION NUMBER"],
            category: "transfer",
          },
        ]
      : []),
    ...(lang === "spanish"
      ? [
          {
            id: "carta-banco-espanol",
            title: "Carta de Presentación para el Banco (Spanish)",
            description: "Versión en español de la carta de introducción al banco.",
            body: `Estimado/a representante bancario/a:

Mi nombre es [SU NOMBRE]. Llegué recientemente a los Estados Unidos desde [PAÍS DE ORIGEN] con visa [TIPO DE VISA]. Me interesa abrir una cuenta bancaria.

Tengo los siguientes documentos:
- Pasaporte (país: [PAÍS DE ORIGEN])
- Visa de EE.UU. válida ([TIPO DE VISA])
- [SSN / ITIN / Matrícula Consular]
- Comprobante de domicilio: [TIPO DE DOCUMENTO]

Agradezco su orientación sobre el tipo de cuenta más adecuado para mi situación.

Atentamente,
[SU NOMBRE]
[SU TELÉFONO]
[SU CORREO ELECTRÓNICO]`,
            variables: ["SU NOMBRE", "PAÍS DE ORIGEN", "TIPO DE VISA", "SSN / ITIN / Matrícula Consular", "TIPO DE DOCUMENTO", "SU TELÉFONO", "SU CORREO ELECTRÓNICO"],
            category: "banking",
          },
        ]
      : []),
  ];
}

// ─── Main Pipeline ────────────────────────────────────────────────────────────

export function runPipeline(form: IntakeForm): PipelineOutput {
  const corridorId = getCorridorByCountry(form.originCountry);

  // Determine risk level
  const noId = form.ssnStatus === "none";
  const lowSavings = form.savingsBand === "under_1k";
  const noHousing = !form.hasHousing;
  const riskLevel =
    (noId ? 1 : 0) + (lowSavings ? 1 : 0) + (noHousing ? 1 : 0) >= 2
      ? "high"
      : noId || lowSavings || noHousing
      ? "medium"
      : "low";

  const primaryConstraint = noId
    ? "No US Tax ID (SSN/ITIN) — limits banking and credit access"
    : lowSavings
    ? "Low savings — focus on fee-free options"
    : noHousing
    ? "No established US address — needed for bank account"
    : "Standard newcomer onboarding";

  const pathways = buildPathways(form);
  const recommendedPathway = pathways.find((p) => p.recommended) ?? pathways[0];
  const riskFlags = buildRiskFlags(form);
  const checklist = buildChecklist(form, recommendedPathway);
  const templates = buildTemplates(form);

  const output: PipelineOutput = {
    profile: {
      corridorId,
      riskLevel,
      primaryConstraint,
    },
    pathways,
    riskFlags,
    checklist,
    templates,
    generatedAt: new Date().toISOString(),
    disclaimer:
      "BridgePath provides general information and options only. This is not financial, legal, tax, or immigration advice. All pathways, fees, and eligibility requirements should be verified directly with the relevant institutions. Regulations and product terms change frequently. Consult qualified professionals for your specific situation.",
  };

  // Validate output with Zod (development safety)
  try {
    return PipelineOutputSchema.parse(output);
  } catch (e) {
    console.warn("Pipeline output validation warning:", e);
    return output;
  }
}
