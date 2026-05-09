export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { messages, system, max_tokens } = req.body;

    // Convert Anthropic-format messages → Gemini format
    const geminiParts = [];
    for (const msg of messages) {
      if (typeof msg.content === "string") {
        geminiParts.push({ text: msg.content });
      } else if (Array.isArray(msg.content)) {
        for (const block of msg.content) {
          if (block.type === "text") {
            geminiParts.push({ text: block.text });
          } else if (block.type === "image" && block.source) {
            if (block.source.type === "base64") {
              geminiParts.push({
                inline_data: {
                  mime_type: block.source.media_type || "image/jpeg",
                  data: block.source.data
                }
              });
            } else if (block.source.type === "url") {
              // Fetch the image URL and convert to base64 for Gemini
              try {
                const imgResp = await fetch(block.source.url);
                const imgBuf = await imgResp.arrayBuffer();
                const b64 = Buffer.from(imgBuf).toString("base64");
                const ct = imgResp.headers.get("content-type") || "image/jpeg";
                geminiParts.push({ inline_data: { mime_type: ct, data: b64 } });
              } catch {
                geminiParts.push({ text: `[Image URL: ${block.source.url}]` });
              }
            }
          }
        }
      }
    }

    const geminiBody = {
      contents: [{ role: "user", parts: geminiParts }],
      generationConfig: {
        maxOutputTokens: max_tokens || 2000,
        temperature: 0.1,
        responseMimeType: "application/json"
      }
    };
    if (system) {
      geminiBody.system_instruction = { parts: [{ text: system }] };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiBody)
      }
    );

    const data = await response.json();
    if (data.error) {
      console.error("Gemini API error:", JSON.stringify(data.error));
      return res.status(500).json({ error: data.error.message || "Gemini API error" });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return res.status(200).json({ content: [{ type: "text", text }] });
  } catch (error) {
    return res.status(500).json({ error: "Analysis failed: " + error.message });
  }
}
