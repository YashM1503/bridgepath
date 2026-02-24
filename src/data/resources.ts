export interface ResourceLink {
  id: string;
  title: string;
  description: string;
  url: string;
  category: "government" | "embassy" | "banking" | "documents" | "legal" | "emergency" | "education";
  corridors: string[];
  icon: string;
}

export const RESOURCES: ResourceLink[] = [
  // Government
  {
    id: "ssa",
    title: "Social Security Administration",
    description: "Apply for SSN, check application status",
    url: "https://www.ssa.gov/",
    category: "government",
    corridors: ["india", "china", "latam"],
    icon: "🏛️",
  },
  {
    id: "irs-itin",
    title: "IRS — ITIN Application (Form W-7)",
    description: "Apply for Individual Taxpayer Identification Number",
    url: "https://www.irs.gov/individuals/individual-taxpayer-identification-number",
    category: "government",
    corridors: ["india", "china", "latam"],
    icon: "📋",
  },
  {
    id: "uscis",
    title: "USCIS — Immigration Services",
    description: "Check visa status, file forms, case status tracker",
    url: "https://www.uscis.gov/",
    category: "government",
    corridors: ["india", "china", "latam"],
    icon: "🏛️",
  },
  {
    id: "cbp-i94",
    title: "CBP — I-94 Travel Record",
    description: "Retrieve your I-94 arrival/departure record",
    url: "https://i94.cbp.dhs.gov/",
    category: "documents",
    corridors: ["india", "china", "latam"],
    icon: "📄",
  },
  {
    id: "annual-credit",
    title: "AnnualCreditReport.com",
    description: "Free weekly credit reports from all three bureaus",
    url: "https://www.annualcreditreport.com/",
    category: "banking",
    corridors: ["india", "china", "latam"],
    icon: "📊",
  },
  {
    id: "cfpb-send-money",
    title: "CFPB — Send Money Abroad",
    description: "Compare international money transfer fees and rates",
    url: "https://www.consumerfinance.gov/sending-money/",
    category: "banking",
    corridors: ["india", "china", "latam"],
    icon: "💱",
  },
  {
    id: "fdic",
    title: "FDIC — Bank Verification",
    description: "Verify if a bank is FDIC insured",
    url: "https://www.fdic.gov/resources/bankers/",
    category: "banking",
    corridors: ["india", "china", "latam"],
    icon: "🏦",
  },
  {
    id: "ncua",
    title: "NCUA — Credit Union Locator",
    description: "Find NCUA-insured credit unions near you",
    url: "https://www.mycreditunion.gov/",
    category: "banking",
    corridors: ["india", "china", "latam"],
    icon: "🏦",
  },

  // India-specific
  {
    id: "india-embassy",
    title: "Embassy of India — Washington DC",
    description: "Consular services, OCI, PIO assistance",
    url: "https://www.indianembassyusa.gov.in/",
    category: "embassy",
    corridors: ["india"],
    icon: "🇮🇳",
  },
  {
    id: "bsa-efiling",
    title: "BSA E-Filing — FBAR",
    description: "File Foreign Bank Account Report (FinCEN 114)",
    url: "https://bsaefiling.fincen.treas.gov/",
    category: "documents",
    corridors: ["india"],
    icon: "📋",
  },

  // China-specific
  {
    id: "china-embassy",
    title: "Embassy of China — Washington DC",
    description: "Visa services, passport renewal, notarization",
    url: "http://us.china-embassy.gov.cn/",
    category: "embassy",
    corridors: ["china"],
    icon: "🇨🇳",
  },

  // LATAM-specific
  {
    id: "mexico-consulate",
    title: "Mexican Consulate Network",
    description: "Matrícula Consular, passport services, legal aid referrals",
    url: "https://consulmex.sre.gob.mx/",
    category: "embassy",
    corridors: ["latam"],
    icon: "🇲🇽",
  },
  {
    id: "colombia-consulate",
    title: "Colombian Consulate Network",
    description: "Consular registration, document authentication",
    url: "https://www.cancilleria.gov.co/",
    category: "embassy",
    corridors: ["latam"],
    icon: "🇨🇴",
  },
  {
    id: "brazil-consulate",
    title: "Brazilian Consulate Network",
    description: "Voter registration abroad, document services",
    url: "https://www.gov.br/mre/",
    category: "embassy",
    corridors: ["latam"],
    icon: "🇧🇷",
  },

  // Emergency
  {
    id: "211",
    title: "211.org — Community Resources",
    description: "Free, confidential help with food, housing, employment, health, crisis intervention",
    url: "https://www.211.org/",
    category: "emergency",
    corridors: ["india", "china", "latam"],
    icon: "🆘",
  },
  {
    id: "vita",
    title: "IRS VITA — Free Tax Preparation",
    description: "Free tax help for qualifying taxpayers",
    url: "https://www.irs.gov/individuals/free-tax-return-preparation-for-qualifying-taxpayers",
    category: "government",
    corridors: ["india", "china", "latam"],
    icon: "📋",
  },
];

export function getResourcesByCorridorId(corridorId: string): ResourceLink[] {
  return RESOURCES.filter((r) => r.corridors.includes(corridorId));
}

export function getResourcesByCategory(category: ResourceLink["category"]): ResourceLink[] {
  return RESOURCES.filter((r) => r.category === category);
}
