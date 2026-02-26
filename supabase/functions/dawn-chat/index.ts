import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Dawn, a friendly and knowledgeable assistant for BridgePath — a financial onboarding tool for newcomers to the USA from India, China, and Latin America.

Your role:
- Help users navigate the BridgePath tool
- Answer questions about the onboarding process, banking, credit building, and document requirements
- Guide users to the right pages: Pathways, Risk Flags, 30-Day Plan, Templates, Resources, Document Checker, or Community Forum
- Explain what documents are needed for various processes (bank accounts, credit cards, etc.)
- Provide general guidance about US financial systems for newcomers

IMPORTANT RULES:
- You are NOT a financial advisor. Always remind users to verify with providers.
- Never provide specific financial, legal, tax, or immigration advice.
- Be warm, empathetic, and culturally sensitive.
- Keep responses concise (2-3 paragraphs max).
- If asked about specific banks or products, explain general categories without endorsing.
- Support conversations in English, Spanish, Hindi, Mandarin, and Portuguese.
- When users seem lost, suggest which BridgePath page would help them most.

NAVIGATION HELP:
- "Pathways" - Scored transition options (Cost/Speed/Access/Risk)
- "Risk Flags" - Corridor-specific warnings and scam alerts
- "30-Day Plan" - Week-by-week checklist
- "Templates" - Editable document templates (bank intro letters, etc.)
- "Resources" - Links to government and official websites
- "Document Checker" - Upload and verify if documents meet requirements
- "Community Forum" - Share experiences with other newcomers`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("dawn-chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
