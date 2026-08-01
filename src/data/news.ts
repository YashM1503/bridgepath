// Curated pointers to OFFICIAL immigration/visa news sources, plus short
// plain-language summaries of recurring, well-established policy areas.
// Nothing here is legal advice and nothing here replaces the official source.

export interface NewsSource {
  id: string;
  title: string;
  description: string;
  url: string;
  cadence: string;
  tag: "policy" | "visa-bulletin" | "fees" | "travel" | "consumer" | "rules";
  icon: string;
}

export interface Digest {
  id: string;
  headline: string;
  summary: string;
  whyItMatters: string;
  sourceLabel: string;
  sourceUrl: string;
  tag: NewsSource["tag"];
}

export const NEWS_UPDATED = "July 2026";

export const NEWS_SOURCES: NewsSource[] = [
  {
    id: "uscis-newsroom",
    title: "USCIS Newsroom & Alerts",
    description: "Official announcements on forms, filing fees, processing and policy changes.",
    url: "https://www.uscis.gov/newsroom/all-news",
    cadence: "Updated continuously",
    tag: "policy",
    icon: "📰",
  },
  {
    id: "visa-bulletin",
    title: "Visa Bulletin (priority dates)",
    description: "Monthly cut-off dates for family- and employment-based green cards, by country.",
    url: "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html",
    cadence: "New bulletin each month",
    tag: "visa-bulletin",
    icon: "📅",
  },
  {
    id: "federal-register-uscis",
    title: "Federal Register — Immigration rules",
    description: "The legally binding text of proposed and final rules, before the news covers them.",
    url: "https://www.federalregister.gov/agencies/u-s-citizenship-and-immigration-services",
    cadence: "Daily",
    tag: "rules",
    icon: "📜",
  },
  {
    id: "uscis-processing",
    title: "USCIS Case Processing Times",
    description: "Current published processing time for your exact form, category and office.",
    url: "https://egov.uscis.gov/processing-times/",
    cadence: "Updated monthly",
    tag: "policy",
    icon: "⏱️",
  },
  {
    id: "visa-appointment-wait",
    title: "Consular Interview Wait Times",
    description: "Estimated visa appointment wait at each US embassy or consulate.",
    url: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/wait-times.html",
    cadence: "Updated regularly",
    tag: "visa-bulletin",
    icon: "🗓️",
  },
  {
    id: "uscis-fees",
    title: "USCIS Fee Schedule (G-1055)",
    description: "The authoritative, current filing fee for every USCIS form.",
    url: "https://www.uscis.gov/g-1055",
    cadence: "Updated when fees change",
    tag: "fees",
    icon: "💵",
  },
  {
    id: "dos-fees",
    title: "State Dept Visa Fee Schedule",
    description: "Current consular application, issuance and reciprocity fees.",
    url: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/fees/fees-visa-services.html",
    cadence: "Updated when fees change",
    tag: "fees",
    icon: "💳",
  },
  {
    id: "travel-advisories",
    title: "Travel Advisories & Entry Rules",
    description: "Country-by-country advisories that can affect travel and consular processing.",
    url: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html",
    cadence: "Updated as conditions change",
    tag: "travel",
    icon: "✈️",
  },
  {
    id: "cbp-newsroom",
    title: "CBP Newsroom",
    description: "Border entry, inspection and I-94 related announcements.",
    url: "https://www.cbp.gov/newsroom/national-media-release",
    cadence: "Updated continuously",
    tag: "travel",
    icon: "🛃",
  },
  {
    id: "ice-sevp",
    title: "ICE SEVP — Student & Exchange",
    description: "Broadcast messages and guidance for F-1/M-1 students and their schools.",
    url: "https://www.ice.gov/sevis/whats-new",
    cadence: "Updated as issued",
    tag: "policy",
    icon: "🎓",
  },
  {
    id: "cfpb-newsroom",
    title: "CFPB — Consumer Finance",
    description: "Bank, remittance and credit rules that affect newcomers directly.",
    url: "https://www.consumerfinance.gov/about-us/newsroom/",
    cadence: "Updated continuously",
    tag: "consumer",
    icon: "🏦",
  },
  {
    id: "ftc-scams",
    title: "FTC — Immigration Scam Alerts",
    description: "Current scams targeting immigrants, and how to report them.",
    url: "https://consumer.ftc.gov/features/scam-alerts",
    cadence: "Updated continuously",
    tag: "consumer",
    icon: "🚨",
  },
];

export const DIGESTS: Digest[] = [
  {
    id: "check-fees-first",
    headline: "Filing fees change — always price your case from the official schedule",
    summary:
      "USCIS and the State Department revise fees periodically, and forms filed with the wrong fee are commonly rejected and returned.",
    whyItMatters:
      "A rejected filing can push you past a status deadline. Print the fee page on the day you file and keep it with your copies.",
    sourceLabel: "USCIS G-1055 fee schedule",
    sourceUrl: "https://www.uscis.gov/g-1055",
    tag: "fees",
  },
  {
    id: "online-filing",
    headline: "Online filing is often cheaper and gives you a tracked case history",
    summary:
      "Several common forms carry a lower fee when filed through a USCIS online account, and status updates land in one dashboard.",
    whyItMatters:
      "Fewer lost mailings, faster receipt notices, and one place to upload evidence if you get a request for more information.",
    sourceLabel: "USCIS online account",
    sourceUrl: "https://my.uscis.gov/",
    tag: "policy",
  },
  {
    id: "priority-dates",
    headline: "Green-card waits depend on your country of birth, not your citizenship",
    summary:
      "The monthly Visa Bulletin sets cut-off dates per category and per chargeability country; applicants born in India and China face the longest employment-based backlogs.",
    whyItMatters:
      "It determines when you can file, and whether your dependents age out. Check the bulletin the week it is released each month.",
    sourceLabel: "State Dept Visa Bulletin",
    sourceUrl: "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html",
    tag: "visa-bulletin",
  },
  {
    id: "address-change",
    headline: "Most non-citizens must report an address change within 10 days",
    summary:
      "Form AR-11 (or an update in your USCIS online account) is required after most moves, separately from a mail-forwarding request.",
    whyItMatters:
      "Missed notices are treated as delivered. A single missed interview or RFI letter can close a case.",
    sourceLabel: "USCIS — Change of address",
    sourceUrl: "https://www.uscis.gov/addresschange",
    tag: "rules",
  },
  {
    id: "scam-notario",
    headline: "Only attorneys and accredited representatives may advise on immigration",
    summary:
      "'Notario público', consultants and travel agencies cannot legally represent you before USCIS in the United States.",
    whyItMatters:
      "Bad filings from unauthorized preparers are a leading cause of denials — and the fees are rarely recoverable.",
    sourceLabel: "USCIS — Avoid scams",
    sourceUrl: "https://www.uscis.gov/avoid-scams",
    tag: "consumer",
  },
  {
    id: "free-things",
    headline: "SSN, ITIN issuance, I-94 records and credit reports are free",
    summary:
      "Any site charging for these is reselling a free government service, often while harvesting your identity documents.",
    whyItMatters:
      "Handing a passport scan to a lookalike site is the most common early identity-theft vector for newcomers.",
    sourceLabel: "SSA — Get an SSN card",
    sourceUrl: "https://www.ssa.gov/number-card",
    tag: "consumer",
  },
  {
    id: "fbar",
    headline: "Foreign accounts may trigger annual US reporting (FBAR / FATCA)",
    summary:
      "US tax residents with foreign accounts above certain aggregate thresholds file FinCEN 114, sometimes alongside Form 8938.",
    whyItMatters:
      "Penalties are steep and the filing is separate from your tax return. Many newcomers only discover it years later.",
    sourceLabel: "FinCEN — Report of Foreign Bank Accounts",
    sourceUrl: "https://bsaefiling.fincen.treas.gov/",
    tag: "rules",
  },
  {
    id: "processing-times",
    headline: "Use published processing times before assuming your case is stuck",
    summary:
      "USCIS only accepts case inquiries once your case is outside the published normal processing time for your form and office.",
    whyItMatters:
      "Knowing the number saves months of anxiety — and tells you the exact date an inquiry becomes possible.",
    sourceLabel: "USCIS — Check processing times",
    sourceUrl: "https://egov.uscis.gov/processing-times/",
    tag: "policy",
  },
];

export const NEWS_TAGS = [
  { key: "all", label: "All" },
  { key: "policy", label: "Policy & processing" },
  { key: "visa-bulletin", label: "Visa bulletin & waits" },
  { key: "fees", label: "Fees" },
  { key: "rules", label: "Rules & filings" },
  { key: "travel", label: "Travel & entry" },
  { key: "consumer", label: "Money & scams" },
] as const;
