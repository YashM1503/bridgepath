import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a document verification assistant for BridgePath. Your job is to check if a user's uploaded document matches what's required for a specific financial process.

You will receive:
1. The PURPOSE the user needs the document for (e.g., "open a bank account", "apply for credit card")
2. The DOCUMENT TYPE the user says they have (e.g., "driver's license", "passport", "visa")
3. Optionally, extracted text from the document

Your response must be a JSON object with these fields:
- "sufficient": boolean - whether this document alone is sufficient
- "explanation": string - clear explanation of why it is or isn't sufficient
- "required_documents": string[] - list of documents actually required for this purpose
- "missing_documents": string[] - what else is needed if not sufficient
- "tips": string[] - helpful tips about the process

IMPORTANT RULES:
- Be accurate about US banking and financial document requirements
- Common requirements for bank accounts: Valid ID (passport, state ID), proof of address, SSN/ITIN (some banks waive), visa documentation
- A driver's license alone is NOT sufficient for opening a bank account as a newcomer (need passport + visa)
- Always mention that requirements vary by institution
- Never provide legal advice`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { purpose, documentType, documentText } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userMessage = `Purpose: ${purpose}\nDocument provided: ${documentType}\n${documentText ? `Document text preview: ${documentText.substring(0, 500)}` : "No text extracted."}`;

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
          { role: "user", content: userMessage },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "check_document",
              description: "Verify if a document is sufficient for a given purpose",
              parameters: {
                type: "object",
                properties: {
                  sufficient: { type: "boolean" },
                  explanation: { type: "string" },
                  required_documents: { type: "array", items: { type: "string" } },
                  missing_documents: { type: "array", items: { type: "string" } },
                  tips: { type: "array", items: { type: "string" } },
                },
                required: ["sufficient", "explanation", "required_documents", "missing_documents", "tips"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "check_document" } },
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Could not analyze document" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("doc-checker error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
