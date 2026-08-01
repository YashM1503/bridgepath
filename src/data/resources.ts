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

  // ─── Government / status ───
  {
    id: "uscis-account",
    title: "USCIS Online Account",
    description: "File forms online, track case status, upload evidence, get notices in one place",
    url: "https://my.uscis.gov/",
    category: "government",
    corridors: ["india", "china", "latam"],
    icon: "🧾",
  },
  {
    id: "uscis-processing",
    title: "USCIS Case Processing Times",
    description: "Published processing time for your exact form, category and field office",
    url: "https://egov.uscis.gov/processing-times/",
    category: "government",
    corridors: ["india", "china", "latam"],
    icon: "⏱️",
  },
  {
    id: "uscis-fees",
    title: "USCIS Fee Schedule (G-1055)",
    description: "Authoritative current filing fee for every USCIS form",
    url: "https://www.uscis.gov/g-1055",
    category: "government",
    corridors: ["india", "china", "latam"],
    icon: "💵",
  },
  {
    id: "uscis-ar11",
    title: "USCIS — Change of Address (AR-11)",
    description: "Most non-citizens must report a move within 10 days",
    url: "https://www.uscis.gov/addresschange",
    category: "government",
    corridors: ["india", "china", "latam"],
    icon: "📮",
  },
  {
    id: "uscis-avoid-scams",
    title: "USCIS — Avoid Immigration Scams",
    description: "How to spot unauthorized preparers and report fraud",
    url: "https://www.uscis.gov/avoid-scams",
    category: "government",
    corridors: ["india", "china", "latam"],
    icon: "🚨",
  },
  {
    id: "visa-bulletin",
    title: "State Dept — Visa Bulletin",
    description: "Monthly green card priority date cut-offs by category and country",
    url: "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html",
    category: "government",
    corridors: ["india", "china", "latam"],
    icon: "📅",
  },
  {
    id: "visa-wait-times",
    title: "Consular Interview Wait Times",
    description: "Estimated visa appointment wait at each US embassy or consulate",
    url: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/wait-times.html",
    category: "government",
    corridors: ["india", "china", "latam"],
    icon: "🗓️",
  },
  {
    id: "dos-visa-fees",
    title: "State Dept — Visa Fee Schedule",
    description: "Current application, issuance and reciprocity fees by visa class",
    url: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/fees/fees-visa-services.html",
    category: "government",
    corridors: ["india", "china", "latam"],
    icon: "💳",
  },
  {
    id: "federal-register",
    title: "Federal Register — Immigration Rules",
    description: "Binding text of proposed and final immigration rules",
    url: "https://www.federalregister.gov/agencies/u-s-citizenship-and-immigration-services",
    category: "government",
    corridors: ["india", "china", "latam"],
    icon: "📜",
  },
  {
    id: "usa-gov-dmv",
    title: "USA.gov — Motor Vehicle Services",
    description: "Find your state DMV for a driver's license or state ID",
    url: "https://www.usa.gov/motor-vehicle-services",
    category: "government",
    corridors: ["india", "china", "latam"],
    icon: "🚗",
  },

  // ─── Documents ───
  {
    id: "ds160",
    title: "DS-160 — Nonimmigrant Visa Application",
    description: "Official online application form for most US visas",
    url: "https://ceac.state.gov/genniv/",
    category: "documents",
    corridors: ["india", "china", "latam"],
    icon: "📝",
  },
  {
    id: "sevis-fee",
    title: "I-901 SEVIS Fee Payment",
    description: "Required for F, M and J applicants before the visa interview",
    url: "https://www.fmjfee.com/",
    category: "documents",
    corridors: ["india", "china", "latam"],
    icon: "🎓",
  },
  {
    id: "apostille",
    title: "State Dept — Apostille & Authentication",
    description: "Certify documents for use across borders",
    url: "https://travel.state.gov/content/travel/en/records-and-authentications/authenticate-your-document/apostille-requirements.html",
    category: "documents",
    corridors: ["india", "china", "latam"],
    icon: "🔏",
  },
  {
    id: "naces",
    title: "NACES — Credential Evaluators",
    description: "Recognized services that evaluate foreign degrees for US employers and schools",
    url: "https://www.naces.org/members",
    category: "documents",
    corridors: ["india", "china", "latam"],
    icon: "🎖️",
  },
  {
    id: "reciprocity",
    title: "Visa Reciprocity & Civil Documents by Country",
    description: "What documents your country issues and what the US accepts",
    url: "https://travel.state.gov/content/travel/en/us-visas/Visa-Reciprocity-and-Civil-Documents-by-Country.html",
    category: "documents",
    corridors: ["india", "china", "latam"],
    icon: "🌐",
  },

  // ─── Banking & money ───
  {
    id: "cfpb-newcomers",
    title: "CFPB — Banking Basics for Newcomers",
    description: "Plain-language guides on accounts, fees and consumer rights",
    url: "https://www.consumerfinance.gov/consumer-tools/",
    category: "banking",
    corridors: ["india", "china", "latam"],
    icon: "📘",
  },
  {
    id: "cfpb-complaint",
    title: "CFPB — Submit a Complaint",
    description: "Free official channel if a bank or transfer provider treats you unfairly",
    url: "https://www.consumerfinance.gov/complaint/",
    category: "banking",
    corridors: ["india", "china", "latam"],
    icon: "📣",
  },
  {
    id: "cfpb-credit",
    title: "CFPB — Credit Reports & Scores",
    description: "How US credit works and how to build it from zero",
    url: "https://www.consumerfinance.gov/consumer-tools/credit-reports-and-scores/",
    category: "banking",
    corridors: ["india", "china", "latam"],
    icon: "📈",
  },
  {
    id: "fdic-open-account",
    title: "FDIC — Opening a Bank Account",
    description: "What ID banks may accept, including without an SSN",
    url: "https://www.fdic.gov/resources/consumers/consumer-assistance-topics/opening-account.html",
    category: "banking",
    corridors: ["india", "china", "latam"],
    icon: "🪪",
  },
  {
    id: "irs-newcomers",
    title: "IRS — Taxpayers Living Abroad & Aliens",
    description: "Residency tests, treaty benefits and filing basics",
    url: "https://www.irs.gov/individuals/international-taxpayers",
    category: "banking",
    corridors: ["india", "china", "latam"],
    icon: "🧮",
  },
  {
    id: "ftc-scams",
    title: "FTC — Scam Alerts",
    description: "Current scams targeting immigrants and how to report them",
    url: "https://consumer.ftc.gov/features/scam-alerts",
    category: "banking",
    corridors: ["india", "china", "latam"],
    icon: "⚠️",
  },
  {
    id: "identitytheft",
    title: "IdentityTheft.gov",
    description: "Official recovery plan if your documents or identity are misused",
    url: "https://www.identitytheft.gov/",
    category: "emergency",
    corridors: ["india", "china", "latam"],
    icon: "🛡️",
  },

  // ─── Legal ───
  {
    id: "eoir-probono",
    title: "DOJ — Free & Low-Cost Legal Providers",
    description: "Official list of pro bono immigration legal services by state",
    url: "https://www.justice.gov/eoir/list-pro-bono-legal-service-providers",
    category: "legal",
    corridors: ["india", "china", "latam"],
    icon: "⚖️",
  },
  {
    id: "eoir-recognized",
    title: "DOJ — Recognized Organizations & Accredited Reps",
    description: "Verify that someone is authorized to represent you",
    url: "https://www.justice.gov/eoir/recognition-and-accreditation-program",
    category: "legal",
    corridors: ["india", "china", "latam"],
    icon: "✅",
  },
  {
    id: "eoir-case-status",
    title: "EOIR — Immigration Court Case Status",
    description: "Check hearing dates and case information",
    url: "https://acis.eoir.justice.gov/en/",
    category: "legal",
    corridors: ["india", "china", "latam"],
    icon: "🏛️",
  },
  {
    id: "dol-workers",
    title: "Dept of Labor — Worker Rights",
    description: "Wage, hour and workplace protections that apply regardless of status",
    url: "https://www.dol.gov/agencies/whd/immigration",
    category: "legal",
    corridors: ["india", "china", "latam"],
    icon: "👷",
  },

  // ─── Education & settling in ───
  {
    id: "ice-sevp",
    title: "ICE SEVP — Students & Exchange Visitors",
    description: "Guidance for F-1/M-1 students, OPT and school transfers",
    url: "https://www.ice.gov/sevis/whats-new",
    category: "education",
    corridors: ["india", "china", "latam"],
    icon: "🏫",
  },
  {
    id: "educationusa",
    title: "EducationUSA",
    description: "State Dept advising network for studying in the United States",
    url: "https://educationusa.state.gov/",
    category: "education",
    corridors: ["india", "china", "latam"],
    icon: "🌎",
  },
  {
    id: "uscis-citizenship-resources",
    title: "USCIS — Citizenship Resource Center",
    description: "Free study materials, English and civics preparation",
    url: "https://www.uscis.gov/citizenship",
    category: "education",
    corridors: ["india", "china", "latam"],
    icon: "📚",
  },
  {
    id: "benefits-gov",
    title: "Benefits.gov — Eligibility Screener",
    description: "Check which public programs you may qualify for",
    url: "https://www.benefits.gov/",
    category: "government",
    corridors: ["india", "china", "latam"],
    icon: "🤝",
  },
  {
    id: "healthcare-gov",
    title: "HealthCare.gov — Immigrants",
    description: "Health coverage options for lawfully present immigrants",
    url: "https://www.healthcare.gov/immigrants/",
    category: "education",
    corridors: ["india", "china", "latam"],
    icon: "🏥",
  },

  // ─── Emergency ───
  {
    id: "988",
    title: "988 Suicide & Crisis Lifeline",
    description: "Free 24/7 confidential support, multilingual",
    url: "https://988lifeline.org/",
    category: "emergency",
    corridors: ["india", "china", "latam"],
    icon: "☎️",
  },
  {
    id: "nhth",
    title: "National Human Trafficking Hotline",
    description: "Confidential help for labor exploitation and trafficking, 200+ languages",
    url: "https://humantraffickinghotline.org/",
    category: "emergency",
    corridors: ["india", "china", "latam"],
    icon: "🆘",
  },
  {
    id: "travel-advisories",
    title: "Travel Advisories & Entry Requirements",
    description: "Country conditions that can affect travel and consular processing",
    url: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html",
    category: "emergency",
    corridors: ["india", "china", "latam"],
    icon: "✈️",
  },
];

export function getResourcesByCorridorId(corridorId: string): ResourceLink[] {
  return RESOURCES.filter((r) => r.corridors.includes(corridorId));
}

export function getResourcesByCategory(category: ResourceLink["category"]): ResourceLink[] {
  return RESOURCES.filter((r) => r.category === category);
}

export function searchResources(list: ResourceLink[], query: string): ResourceLink[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((r) =>
    `${r.title} ${r.description} ${r.category}`.toLowerCase().includes(q)
  );
}
