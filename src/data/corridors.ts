export type CorridorId = "india" | "china" | "latam";

export interface CorridorPack {
  id: CorridorId;
  name: string;
  flag: string;
  languages: string[];
  defaultLanguage: string;
  commonBlockers: string[];
  priorityTasks: string[];
  scamWarnings: string[];
  feeWarnings: string[];
  culturalNotes: string[];
  supportedVisas: string[];
  remittanceNote: string;
}

export const CORRIDORS: Record<CorridorId, CorridorPack> = {
  india: {
    id: "india",
    name: "India",
    flag: "🇮🇳",
    languages: ["English", "Hindi", "Telugu", "Tamil", "Kannada", "Gujarati"],
    defaultLanguage: "English",
    commonBlockers: [
      "No US credit history (CIBIL score does not transfer)",
      "ITIN processing delays (9–14 weeks in 2026 for first-time W-7 filers)",
      "F-1 students often ineligible for standard checking without SSN — most major banks now offer no-SSN student accounts using passport + I-20",
      "Indian address validation frequently rejected by US banks (use university or employer address for initial applications)",
      "FBAR/FATCA reporting required on Indian accounts aggregating >$10,000 at any point in the year (FinCEN 114, due April 15 with automatic extension to Oct 15)",
      "RBI LRS annual remittance cap remains $250,000 per person; TCS of 20% applies on outbound remittances above ₹7 lakh under LRS (non-education/medical)",
    ],
    priorityTasks: [
      "Open a no-SSN newcomer account (Week 1) — HDFC/ICICI US, Chase, BofA, Zolve, and Niyo now offer digital onboarding with passport + I-20/I-797",
      "Activate international student or employer-sponsored health insurance before arrival",
      "Apply for a secured or newcomer credit card (Deserve, Zolve, Capital One, Discover Secured) to start CIBIL-independent US credit",
      "Notify Indian bank of US move and convert resident account to NRO/NRE within 6 months (FEMA requirement)",
      "Understand FBAR + Schedule B filing if holding Indian bank/mutual fund/PPF assets",
    ],
    scamWarnings: [
      "IRS impersonation scams targeting Indian H-1B holders (phone calls demanding gift cards, crypto, or wire transfers)",
      "Fake immigration consultants charging for free USCIS forms and 'premium processing' guarantees",
      "Fraudulent remittance agents on WhatsApp/Telegram offering above-market INR–USD rates",
      "Apartment rental scams on Facebook Marketplace requesting Zelle/wire before viewing",
      "Fake 'H-1B lottery help' and 'green card investment' schemes surged in 2025–2026 following USCIS beneficiary-centric selection changes",
    ],
    feeWarnings: [
      "International wire fees typically $25–$50 outgoing; SWIFT alternatives (Wise, Remitly, Xoom) usually cheaper",
      "Some US banks charge monthly maintenance if minimum balance not met — newcomer accounts often waive for first 12 months",
      "Credit card foreign transaction fees (usually 3%) apply to INR charges — use a no-FTF card for India trips",
      "India's 20% TCS on LRS remittances is a prepaid tax credit, not a fee — reclaim it when filing ITR in India",
    ],
    culturalNotes: [
      "US credit system (FICO/VantageScore) is entirely separate from India's CIBIL — you start from zero",
      "Salary is quoted gross (pre-tax); take-home is typically 60–75% after federal, state, FICA, and benefits",
      "Tipping is standard 18–22% at sit-down restaurants; 15% on delivery; $1–$2 per bag for hotel staff",
    ],
    supportedVisas: ["F-1", "H-1B", "H-1B1", "L-1", "J-1", "O-1", "H-4", "EAD"],
    remittanceNote: "Wire transfer, UPI-linked cross-border apps (Wise, Remitly, Xoom, Instarem), and dedicated India–US neobanks (Zolve, Niyo) are common corridors. Verify RBI/LRS limits ($250K/year) and 20% TCS threshold for large transfers.",
  },

  china: {
    id: "china",
    name: "China",
    flag: "🇨🇳",
    languages: ["English", "Mandarin (Simplified)", "Cantonese"],
    defaultLanguage: "Mandarin (Simplified)",
    commonBlockers: [
      "Chinese passport accepted, but Chinese national ID (身份证) not accepted at US banks",
      "Great Firewall blocks most US banking apps and 2FA services in China — set up a VPN before departure",
      "SAFE foreign exchange annual quota remains $50,000 USD equivalent per person; large tuition/living transfers often require phased planning",
      "WeChat Pay / Alipay not accepted for US bill pay; some US merchants accept Alipay+ tourist checkout only",
      "Language barrier at in-branch interactions outside major metros — East West Bank, Cathay Bank, HSBC, and Chase branches in CA/NY/TX typically offer Mandarin service",
      "Since 2024, US Treasury outbound-investment rules restrict certain US–China tech/AI investments (does not affect personal banking, but relevant for founders)",
    ],
    priorityTasks: [
      "Open account with a Mandarin-capable branch or bank (East West, Cathay, HSBC Premier, Chase) in Week 1",
      "Install and test a reliable VPN + hardware 2FA key (YubiKey) before leaving China",
      "Plan tuition/living transfers within SAFE $50K quota — split across calendar years if needed",
      "Apply for SSN (workers/J-1) or ITIN (F-1 dependents, investors) as soon as eligible",
      "Register for a US tax ID before opening a brokerage or crypto account",
    ],
    scamWarnings: [
      "'Pig butchering' (杀猪盘) romance-and-crypto investment scams remain the #1 fraud loss category for Chinese-speaking US residents (FBI IC3 2025 report)",
      "Fake US consulate / USCIS fee payment websites cloned in Simplified Chinese",
      "Rental scams in WeChat groups (小红书/微信群) targeting newly arrived students — never pay deposit before in-person or verified video tour",
      "Fraudulent tax preparation services charging for free VITA services",
      "Fake 'police / embassy' calls claiming the victim is implicated in a mainland crime (公安诈骗) — always hang up and call the consulate directly",
    ],
    feeWarnings: [
      "CNY–USD exchange rate risk; onshore vs offshore (CNH) spreads can differ meaningfully",
      "SAFE $50K quota limits may force phased transfers; some banks in China add compliance review on tuition wires >$10K",
      "US banks may flag or hold large incoming international wires for BSA/AML review (typically 1–5 business days)",
    ],
    culturalNotes: [
      "US banks do not recognize China's Zhima Credit (芝麻信用) or PBoC credit report",
      "US landlords run independent credit checks — offer larger deposit or a co-signer if you have no US credit file",
      "Social Security Number (SSN) is the primary US identity anchor; guard it carefully and never share over unsolicited calls",
    ],
    supportedVisas: ["F-1", "J-1", "H-1B", "L-1", "EB-5", "EB-2 NIW", "B-1/B-2"],
    remittanceNote: "CNY outbound transfers subject to SAFE $50K/person annual quota. Consider timing large transfers across calendar years (Dec + Jan) to use two years of quota efficiently. Family members' quotas cannot legally be pooled.",
  },

  latam: {
    id: "latam",
    name: "Latin America",
    flag: "🌎",
    languages: ["English", "Spanish", "Portuguese"],
    defaultLanguage: "Spanish",
    commonBlockers: [
      "ITIN required for many without SSN; 2026 IRS processing runs 9–14 weeks (longer during Jan–Apr tax season)",
      "Language barrier in bank documentation — TD, Wells Fargo, BofA, Chase, and most credit unions in TX/CA/FL/NY offer full Spanish service",
      "Mixed-status households complicate joint account opening; some banks accept ITIN + Matrícula Consular",
      "Matrícula Consular (Mexico), DNI, or passport accepted at a growing but still limited set of banks and credit unions",
      "Remittance fees on smaller corridors (Venezuela, Cuba, Nicaragua) remain higher than Mexico/Colombia/Brazil",
      "CBP One / parole-based entrants may face additional documentation questions when opening accounts — bring I-94 and any EAD/parole notice",
    ],
    priorityTasks: [
      "Apply for ITIN immediately via IRS Form W-7 with a Certified Acceptance Agent (CAA) to avoid mailing your passport",
      "Use Spanish- or Portuguese-language banks (TD, Wells Fargo, BofA, Chase, Popular, and community CDFIs)",
      "Open account with Matrícula Consular, CURP, or passport if SSN/ITIN still pending",
      "Compare remittance apps (Remitly, Wise, Xoom, WorldRemit, Western Union Digital) for your specific corridor",
      "Build credit via secured card, credit-builder loan (Self, Kikoff), or reported rent (Boom, Piñata)",
      "If eligible, apply for EAD (Form I-765) as soon as work authorization category permits",
    ],
    scamWarnings: [
      "Notario fraud — 'notarios públicos' in the US do NOT have the legal authority of a Latin American notario; only licensed attorneys or accredited BIA reps can give immigration advice",
      "Remittance scams hiding fees inside the exchange rate — always compare the amount received, not the headline fee",
      "Work authorization and DACA-renewal scams charging for free USCIS forms",
      "Fake 'immigration relief' and 'humanitarian parole' programs collecting upfront fees, especially targeting Venezuelan, Cuban, Haitian, and Nicaraguan (CHNV-affected) communities",
      "Fraudulent 'tax refund advance' offers from unlicensed preparers during Jan–Apr",
    ],
    feeWarnings: [
      "Remittance fees to LATAM vary widely — Mexico/Colombia/Brazil corridors are competitive; Cuba/Venezuela/Nicaragua often 2–3× more expensive",
      "Neighborhood money transfer shops frequently charge above-market rates hidden in the FX spread",
      "Bank wires vs. app services can differ 3–6% on exchange rates for the same corridor",
    ],
    culturalNotes: [
      "Many LATAM newcomers use ITIN (not SSN) for banking, tax filing, and even mortgages (ITIN mortgages are widely available in 2026)",
      "Consular ID (Matrícula Consular, DNI, Cédula) accepted at credit unions and many community banks",
      "Community lending circles (tandas, cundinas, sanes, juntas) are informal but common — they don't build US credit unless reported through a formal fintech (e.g., Esusu, Mission Asset Fund)",
    ],
    supportedVisas: ["F-1", "J-1", "H-2A", "H-2B", "TN (Mexico)", "E-1/E-2", "DACA", "TPS", "Asylum pending", "Parole (CHNV/Ukraine)", "Other"],
    remittanceNote: "Remittances to Mexico, Colombia, Brazil, Guatemala, and El Salvador: use regulated money services businesses (MSBs). App-based services (Remitly, Wise, Xoom, WorldRemit) typically beat wire and storefront rates. Always confirm the amount received in local currency before sending.",
  },
};

export function getCorridorByCountry(country: string): CorridorId {
  const map: Record<string, CorridorId> = {
    india: "india",
    china: "china",
    mexico: "latam",
    colombia: "latam",
    brazil: "latam",
  };
  return map[country.toLowerCase()] ?? "latam";
}
