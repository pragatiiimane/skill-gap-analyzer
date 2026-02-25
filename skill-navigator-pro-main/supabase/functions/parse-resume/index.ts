import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function sanitizeText(text: string): string {
  return text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "")
    .replace(/[^\x20-\x7E\xA0-\u00FF\u0100-\uFFFF\n\r\t]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isReadableText(text: string): boolean {
  if (!text || text.length < 20) return false;
  // Check if at least 70% of chars are printable ASCII/common Unicode
  const printable = text.match(/[a-zA-Z0-9\s,.;:!?@#$%&*()\-_+='"\/]/g) || [];
  return printable.length / text.length > 0.7;
}

function extractTextFromPDF(bytes: Uint8Array): string {
  const text = new TextDecoder("latin1").decode(bytes);
  const extracted: string[] = [];

  // Extract text between BT and ET markers
  const textObjects = text.match(/BT[\s\S]*?ET/g) || [];
  for (const obj of textObjects) {
    const strings = obj.match(/\(([^)]*)\)/g) || [];
    for (const s of strings) {
      const clean = s.slice(1, -1)
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "")
        .replace(/\\\\/g, "\\")
        .replace(/\\([()])/g, "$1");
      if (clean.trim() && isReadableText(clean)) extracted.push(clean);
    }
  }

  const result = sanitizeText(extracted.join(" "));
  return isReadableText(result) ? result : "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith(".pdf") && !file.name.endsWith(".docx")) {
      return new Response(JSON.stringify({ error: "Only PDF and DOCX files are supported" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "File size must be under 10MB" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const bytes = new Uint8Array(await file.arrayBuffer());
    let extractedText = "";

    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      extractedText = extractTextFromPDF(bytes);
    } else {
      const rawText = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
      const xmlText = rawText.match(/<w:t[^>]*>([^<]+)<\/w:t>/g) || [];
      extractedText = sanitizeText(xmlText.map(t => t.replace(/<[^>]+>/g, "")).join(" "));
    }

    // Always try AI extraction if basic parsing didn't yield good results
    if (!isReadableText(extractedText) || extractedText.length < 50) {
      try {
        const apiKey = Deno.env.get("AI_API_KEY");
        const aiApiUrl = Deno.env.get("AI_API_URL") || "http://localhost:8081/v1/chat/completions";
        if (aiApiUrl) {
          // Convert to base64 in chunks to avoid stack overflow
          let base64 = "";
          const chunkSize = 8192;
          const limitedBytes = bytes.slice(0, 100000);
          for (let i = 0; i < limitedBytes.length; i += chunkSize) {
            const chunk = limitedBytes.slice(i, i + chunkSize);
            base64 += btoa(String.fromCharCode(...chunk));
          }

          const headers: Record<string, string> = { "Content-Type": "application/json" };
          if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

          const aiResponse = await fetch(aiApiUrl, {
            method: "POST",
            headers,
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [
                { role: "system", content: "You are a document text extractor. Extract ALL readable text from the given resume/document. Return ONLY the extracted text content, preserving the structure. No commentary." },
                { role: "user", content: `Extract all text from this base64-encoded ${file.name.endsWith(".pdf") ? "PDF" : "DOCX"} resume:\n${base64}` },
              ],
              max_tokens: 4000,
            }),
          });
          const aiData = await aiResponse.json();
          const aiText = aiData.choices?.[0]?.message?.content || "";
          if (aiText && isReadableText(aiText)) {
            extractedText = sanitizeText(aiText);
          }
        }
      } catch {
        // AI extraction failed, continue with what we have
      }
    }

    // Final sanitization
    extractedText = sanitizeText(extractedText);

    // Upload to storage
    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    await supabase.storage.from("resumes").upload(filePath, bytes, {
      contentType: file.type,
    });

    return new Response(
      JSON.stringify({
        text: extractedText.substring(0, 15000),
        fileName: file.name,
        filePath,
        charCount: extractedText.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to parse document", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
