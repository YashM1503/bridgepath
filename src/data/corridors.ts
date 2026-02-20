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
      "ITIN processing delays (8–12 weeks for first-time filers)",
      "F-1 students often ineligible for standard checking without SSN",
      "Indian address validation rejected by US banks",
      "FBAR/FATCA reporting obligations on Indian accounts >$10,000",
    ],
    priorityTasks: [
      "Open a no-SSN account (Week 1)",
      "Activate international student health insurance",
      "Apply for secured card for credit building",
      "Notify Indian bank of international travel",
      "Understand FBAR filing if holding Indian assets",
    ],
    scamWarnings: [
      "IRS impersonation scams targeting Indian H-1B holders (phone calls demanding gift cards)",
      "Fake immigration consultant charging for free USCIS forms",
      "Fraudulent 'remittance agents' offering above-market rates",
      "Apartment rental scams requesting wire transfers before viewing",
    ],
    feeWarnings: [
      "International wire fees vary — always compare with SWIFT alternatives",
      "Some banks charge monthly maintenance if minimum balance not met",
      "Credit card foreign transaction fees apply to INR charges",
    ],
    culturalNotes: [
      "US credit system is entirely separate from India's CIBIL",
      "Salary is gross (pre-tax); take-home will be significantly less",
      "Tipping is standard 18–22% at restaurants",
    ],
    supportedVisas: ["F-1", "H-1B", "L-1", "J-1", "O-1", "H-4"],
    remittanceNote: "Wire Transfer, UPI-linked apps, and dedicated India–US services are common corridors. Always verify RBI regulations for large transfers.",
  },

  china: {
    id: "china",
    name: "China",
    flag: "🇨🇳",
    languages: ["English", "Mandarin (Simplified)", "Cantonese"],
    defaultLanguage: "Mandarin (Simplified)",
    commonBlockers: [
      "Chinese ID not accepted at most US banks",
      "Great Firewall may block US banking apps in China",
      "SAFE foreign exchange annual quota ($50,000 USD equivalent) affects large transfers",
      "WeChat Pay / Alipay not directly usable for US bill pay",
      "Language barrier in bank branch interactions",
    ],
    priorityTasks: [
      "Open account with Chinese-language capable branch (Week 1)",
      "Set up VPN before arrival for banking app access",
      "Plan large transfer within SAFE annual quota",
      "Obtain ITIN or wait for SSN for credit building",
      "Register for US tax ID to open brokerage",
    ],
    scamWarnings: [
      "'Pig butchering' crypto investment scams targeting Chinese community",
      "Fake US consulate fee payment websites",
      "Rental scams on WeChat groups targeting newly arrived students",
      "Fraudulent tax preparation services charging for free VITA services",
    ],
    feeWarnings: [
      "Currency exchange rate risk on CNY–USD conversion",
      "SAFE quota limits may require phased transfers",
      "Some US banks flag large incoming international wires",
    ],
    culturalNotes: [
      "US banks do not recognize Chinese Zhima Credit score",
      "In the US, landlords run independent credit checks — negotiate with deposit",
      "Social Security Number (SSN) is the primary US identity document",
    ],
    supportedVisas: ["F-1", "J-1", "H-1B", "L-1", "EB-5", "B-2"],
    remittanceNote: "CNY transfers subject to SAFE quota. Consider timing large transfers across calendar years to use quota efficiently.",
  },

  latam: {
    id: "latam",
    name: "Latin America",
    flag: "🌎",
    languages: ["English", "Spanish", "Portuguese"],
    defaultLanguage: "Spanish",
    commonBlockers: [
      "ITIN required for many without SSN; processing takes months",
      "Language barrier in bank documentation",
      "Mixed immigration status makes account opening harder",
      "Consular ID (Matrícula Consular) accepted at fewer banks",
      "High remittance fees back to home country on some corridors",
    ],
    priorityTasks: [
      "Apply for ITIN immediately (W-7 form via IRS)",
      "Use Spanish-language banks (TD, Wells Fargo, Bank of America have bilingual services)",
      "Open account with Matricula Consular if SSN pending",
      "Secure low-fee remittance app for family support",
      "Explore credit-building through secured card or credit-builder loan",
    ],
    scamWarnings: [
      "Notario fraud — 'notarios' claiming legal authority they do not have",
      "Remittance scams charging excessive fees disguised in exchange rate",
      "Work authorization scams targeting DACA recipients",
      "Fake 'immigration relief' programs collecting upfront fees",
    ],
    feeWarnings: [
      "Remittance fees to LATAM vary widely — compare carefully",
      "Some neighborhood money transfer shops charge above-market rates",
      "Bank wire vs. app services can differ by 3–5% on exchange rates",
    ],
    culturalNotes: [
      "Many LATAM newcomers use ITIN (not SSN) for banking",
      "Consular ID accepted at credit unions and some community banks",
      "Community lending circles (tandas/cundinas) are informal but common",
    ],
    supportedVisas: ["F-1", "J-1", "H-2A", "H-2B", "TN", "DACA", "Asylum", "Other"],
    remittanceNote: "Remittance to Mexico, Colombia, Brazil: use regulated money services businesses. App-based services often offer better rates than wire.",
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
