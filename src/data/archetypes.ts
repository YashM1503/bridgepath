export interface BankingArchetype {
  id: string;
  name: string;
  type: "traditional" | "online" | "credit-union" | "neobank";
  eligibilityHints: string[];
  feeType: "none" | "waivable" | "monthly" | "per-transaction";
  feeDescription: string;
  noSSNRequired: boolean;
  imatricula: boolean;
  iTIN: boolean;
  corridors: string[];
  languageSupport: string[];
  minOpeningDeposit: "none" | "low" | "moderate" | "high";
  creditCheck: boolean;
  notes: string;
  lastReviewed: string;
  verifyUrl: string;
}

export interface TransferArchetype {
  id: string;
  name: string;
  type: "wire" | "app" | "cash" | "crypto-adjacent";
  corridors: string[];
  feeType: "flat" | "percentage" | "exchange-rate-spread" | "tiered";
  feeDescription: string;
  speedEstimate: string;
  regulatoryNote: string;
  pros: string[];
  cons: string[];
  languageSupport: string[];
  lastReviewed: string;
  verifyUrl: string;
}

export interface CreditArchetype {
  id: string;
  name: string;
  type: "secured-card" | "credit-builder-loan" | "store-card" | "student-card" | "cosigner" | "credit-union";
  eligibilityHints: string[];
  noSSNRequired: boolean;
  iTINAccepted: boolean;
  securityDepositRequired: boolean;
  reportsTo: string[];
  buildSpeed: "slow" | "moderate" | "fast";
  notes: string;
  corridors: string[];
  lastReviewed: string;
  verifyUrl: string;
}

export const BANKING_ARCHETYPES: BankingArchetype[] = [
  {
    id: "big4-traditional",
    name: "Major National Bank (Traditional)",
    type: "traditional",
    eligibilityHints: ["Usually requires SSN or ITIN", "In-person branch opening may be faster", "Some branches have foreign national programs"],
    feeType: "waivable",
    feeDescription: "Monthly fee waivable with minimum balance or direct deposit",
    noSSNRequired: false,
    imatricula: false,
    iTIN: true,
    corridors: ["india", "china", "latam"],
    languageSupport: ["English", "Spanish", "Mandarin"],
    minOpeningDeposit: "moderate",
    creditCheck: false,
    notes: "Wide branch and ATM network. Best for those with SSN or ITIN already. Spanish/Mandarin support varies by branch.",
    lastReviewed: "2025-01",
    verifyUrl: "https://www.fdic.gov/resources/resolutions/bank-failures/failed-bank-list/",
  },
  {
    id: "online-bank",
    name: "Online-First Bank",
    type: "online",
    eligibilityHints: ["May accept passport + visa in lieu of SSN", "100% digital opening", "No branch access"],
    feeType: "none",
    feeDescription: "No monthly fees on standard accounts",
    noSSNRequired: true,
    imatricula: false,
    iTIN: true,
    corridors: ["india", "china", "latam"],
    languageSupport: ["English"],
    minOpeningDeposit: "none",
    creditCheck: false,
    notes: "Great for tech-comfortable users. Instant virtual card. Verify acceptance of your visa type before applying.",
    lastReviewed: "2025-01",
    verifyUrl: "https://www.fdic.gov/",
  },
  {
    id: "immigrant-friendly-bank",
    name: "Immigrant-Focused Institution",
    type: "online",
    eligibilityHints: ["Designed for newcomers", "Accepts passport + visa", "No SSN required at opening"],
    feeType: "waivable",
    feeDescription: "Nominal monthly fee, often waivable",
    noSSNRequired: true,
    imatricula: true,
    iTIN: true,
    corridors: ["india", "china", "latam"],
    languageSupport: ["English", "Spanish", "Mandarin", "Hindi"],
    minOpeningDeposit: "low",
    creditCheck: false,
    notes: "Purpose-built for international arrivals. May have limitations on transfers and credit products initially.",
    lastReviewed: "2025-01",
    verifyUrl: "https://www.fdic.gov/",
  },
  {
    id: "credit-union",
    name: "Community Credit Union",
    type: "credit-union",
    eligibilityHints: ["Membership eligibility varies (employer, geography, affiliation)", "More flexible ID requirements", "Often accepts Matrícula Consular"],
    feeType: "none",
    feeDescription: "Low or no fees; member-owned",
    noSSNRequired: true,
    imatricula: true,
    iTIN: true,
    corridors: ["latam", "india"],
    languageSupport: ["English", "Spanish"],
    minOpeningDeposit: "low",
    creditCheck: false,
    notes: "Best option for LATAM newcomers without SSN. Membership requirement may limit access. Not-for-profit structure = lower fees.",
    lastReviewed: "2025-01",
    verifyUrl: "https://www.mycreditunion.gov/",
  },
  {
    id: "neobank",
    name: "Neobank / Fintech App",
    type: "neobank",
    eligibilityHints: ["Very fast opening (minutes)", "Limited to debit and basic banking", "May not accept all visa types"],
    feeType: "none",
    feeDescription: "No fees on standard tier",
    noSSNRequired: true,
    imatricula: false,
    iTIN: false,
    corridors: ["india", "china", "latam"],
    languageSupport: ["English"],
    minOpeningDeposit: "none",
    creditCheck: false,
    notes: "Fastest path to having a US account. Limited features. Useful as a bridge account while main account is being set up.",
    lastReviewed: "2025-01",
    verifyUrl: "https://www.fdic.gov/",
  },
];

export const TRANSFER_ARCHETYPES: TransferArchetype[] = [
  {
    id: "wire-transfer",
    name: "SWIFT Bank Wire",
    type: "wire",
    corridors: ["india", "china", "latam"],
    feeType: "flat",
    feeDescription: "Flat fee each direction; exchange rate may include spread",
    speedEstimate: "1–5 business days",
    regulatoryNote: "Transfers over $10,000 trigger Bank Secrecy Act reporting (not a problem if funds are legitimate)",
    pros: ["Universally accepted", "High transfer limits", "Regulated and insured"],
    cons: ["Higher fees", "Slower", "Opaque exchange rates"],
    languageSupport: ["English"],
    lastReviewed: "2025-01",
    verifyUrl: "https://www.federalreserve.gov/paymentsystems/fedwire.htm",
  },
  {
    id: "remittance-app",
    name: "Regulated Remittance App",
    type: "app",
    corridors: ["india", "china", "latam"],
    feeType: "tiered",
    feeDescription: "Low flat fee or exchange rate spread; varies by amount and corridor",
    speedEstimate: "Minutes to 2 business days",
    regulatoryNote: "Licensed Money Services Business (MSB). Required to comply with FinCEN regulations.",
    pros: ["Fast", "Lower fees than wire", "Mobile-first", "Transparent rates"],
    cons: ["Transfer limits may apply", "Account-to-account requires matching accounts", "Varies by destination country"],
    languageSupport: ["English", "Spanish", "Hindi", "Mandarin"],
    lastReviewed: "2025-01",
    verifyUrl: "https://www.fincen.gov/msb-registrant-search",
  },
  {
    id: "cash-remittance",
    name: "Cash Remittance Agent",
    type: "cash",
    corridors: ["latam"],
    feeType: "percentage",
    feeDescription: "Percentage fee plus exchange rate spread; varies widely by agent",
    speedEstimate: "Same day to 1 business day",
    regulatoryNote: "Must be a registered MSB. Request their FinCEN registration number.",
    pros: ["Cash pickup available at destination", "No bank account required at destination", "Familiar for many families"],
    cons: ["Higher fees in some cases", "Less transparent exchange rates", "Physical requirement to visit agent"],
    languageSupport: ["English", "Spanish"],
    lastReviewed: "2025-01",
    verifyUrl: "https://www.fincen.gov/msb-registrant-search",
  },
  {
    id: "fx-specialist",
    name: "FX Specialist Service",
    type: "wire",
    corridors: ["india", "china"],
    feeType: "exchange-rate-spread",
    feeDescription: "Profit primarily from exchange rate spread, not flat fees",
    speedEstimate: "1–3 business days",
    regulatoryNote: "Regulated differently from banks; verify registration with state money transmitter license.",
    pros: ["Better exchange rates than banks on large amounts", "Specialized corridors", "High limits"],
    cons: ["Less regulated perception (though regulated)", "Less accessible for small amounts"],
    languageSupport: ["English", "Hindi", "Mandarin"],
    lastReviewed: "2025-01",
    verifyUrl: "https://www.csbs.org/consumer-resources",
  },
];

export const CREDIT_ARCHETYPES: CreditArchetype[] = [
  {
    id: "secured-card",
    name: "Secured Credit Card",
    type: "secured-card",
    eligibilityHints: ["Deposit held as collateral equals credit limit", "Available to those with no US credit history", "Some accept ITIN"],
    noSSNRequired: false,
    iTINAccepted: true,
    securityDepositRequired: true,
    reportsTo: ["Equifax", "Experian", "TransUnion"],
    buildSpeed: "moderate",
    notes: "The most accessible credit-building tool for newcomers. Deposit returned after graduating to unsecured card (typically 12–18 months).",
    corridors: ["india", "china", "latam"],
    lastReviewed: "2025-01",
    verifyUrl: "https://www.consumerfinance.gov/consumer-tools/credit-cards/",
  },
  {
    id: "credit-builder-loan",
    name: "Credit-Builder Loan",
    type: "credit-builder-loan",
    eligibilityHints: ["Offered by credit unions and CDFIs", "You pay monthly; funds released at end of term", "No upfront credit needed"],
    noSSNRequired: false,
    iTINAccepted: true,
    securityDepositRequired: false,
    reportsTo: ["Equifax", "Experian", "TransUnion"],
    buildSpeed: "moderate",
    notes: "Builds credit and savings simultaneously. Lower risk than credit card. Seek out CDFIs for immigrant-friendly terms.",
    corridors: ["latam", "india"],
    lastReviewed: "2025-01",
    verifyUrl: "https://www.cdfifund.gov/",
  },
  {
    id: "student-card",
    name: "Student Credit Card",
    type: "student-card",
    eligibilityHints: ["Designed for college students", "Usually requires SSN", "Lower income requirements"],
    noSSNRequired: false,
    iTINAccepted: false,
    securityDepositRequired: false,
    reportsTo: ["Equifax", "Experian", "TransUnion"],
    buildSpeed: "moderate",
    notes: "Best for F-1/J-1 students with SSN. Easier approval than standard cards. Annual fee often waived for students.",
    corridors: ["india", "china"],
    lastReviewed: "2025-01",
    verifyUrl: "https://www.consumerfinance.gov/",
  },
  {
    id: "global-credit-transfer",
    name: "Global Credit History Transfer",
    type: "secured-card",
    eligibilityHints: ["Specialized service for H-1B, L-1, O-1 holders", "Transfers home-country credit data", "Limited to specific origin countries"],
    noSSNRequired: false,
    iTINAccepted: false,
    securityDepositRequired: false,
    reportsTo: ["Experian"],
    buildSpeed: "fast",
    notes: "Innovative option for professional visa holders. Verify if your home country is supported. Limited availability.",
    corridors: ["india", "china"],
    lastReviewed: "2025-01",
    verifyUrl: "https://www.consumerfinance.gov/",
  },
  {
    id: "credit-union-loan",
    name: "Credit Union Starter Loan",
    type: "credit-union",
    eligibilityHints: ["Membership required", "More flexible on immigration status", "Community-focused underwriting"],
    noSSNRequired: true,
    iTINAccepted: true,
    securityDepositRequired: false,
    reportsTo: ["Equifax", "Experian", "TransUnion"],
    buildSpeed: "moderate",
    notes: "Best option for LATAM newcomers with ITIN. Credit unions often consider alternative data (rental history, utility payments).",
    corridors: ["latam"],
    lastReviewed: "2025-01",
    verifyUrl: "https://www.mycreditunion.gov/",
  },
];
