import type { IntakeForm } from "@/schemas/intake";

export interface DemoProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  tagline: string;
  origin: string;
  story: string;
  formData: IntakeForm;
}

export const DEMO_PROFILES: DemoProfile[] = [
  {
    id: "lina",
    name: "Lina",
    age: 26,
    avatar: "👩🏽‍💼",
    tagline: "Professional from Colombia",
    origin: "Bogotá, Colombia",
    story: "Lina, a 26-year-old professional from Colombia, just landed from Bogotá. She's fluent in Spanish but unsure about US bureaucracy. She needs to open a bank account, sort health insurance, and find affordable mobile service — all while starting a new job.",
    formData: {
      originCountry: "colombia",
      destinationZip: "33101",
      status: "worker",
      visaType: "H-1B",
      ssnStatus: "applied_ssn",
      payrollStartDate: "2026-03-15",
      savingsBand: "5k_20k",
      homeCurrency: "COP",
      hasHousing: true,
      hasPhone: false,
      feeSensitivity: "moderate",
      languagePreference: "spanish",
      sendMoneyHome: true,
      primaryGoal: "all",
    },
  },
  {
    id: "rahul",
    name: "Rahul",
    age: 18,
    avatar: "👨🏽‍🎓",
    tagline: "Student from India",
    origin: "New Delhi, India",
    story: "Rahul, an 18-year-old from India, just arrived from New Delhi for his undergraduate degree. He speaks Hindi and English, but is navigating US banking for the first time. He needs a bank account, a phone plan, and to understand how credit works in the US.",
    formData: {
      originCountry: "india",
      destinationZip: "02139",
      status: "student",
      visaType: "F-1",
      ssnStatus: "none",
      savingsBand: "1k_5k",
      homeCurrency: "INR",
      hasHousing: true,
      hasPhone: false,
      feeSensitivity: "very_sensitive",
      languagePreference: "english",
      sendMoneyHome: false,
      primaryGoal: "bank_asap",
    },
  },
];
