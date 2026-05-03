export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { messages, system, max_tokens } = req.body;
    const parts = [];
    if (system) parts.push({ text: system + "\n\n" });
    for (const msg of messages) {
      if (typeof msg.content === "string") {
        parts.push({ text: msg.content });
      } else if (Array.isArray(msg.content)) {
        for (const block of msg.content) {
          if (block.type === "text") {
            parts.push({ text: block.text });
          } else if (block.type === "image" && block.source) {
            if (block.source.type === "base64") {
              parts.push({ inline_data: { mime_type: block.source.media_type || "image/jpeg", data: block.source.data } });
            } else if (block.source.type === "url") {
              try {
                const imgRes = await fetch(block.source.url);
                const arrBuf = await imgRes.arrayBuffer();
                const b64 = Buffer.from(arrBuf).toString("base64");
                const mime = imgRes.headers.get("content-type") || "image/jpeg";
                parts.push({ inline_data: { mime_type: mime, data: b64 } });
              } catch { parts.push({ text: "[Image could not be loaded]" }); }
            }
          }
        }
      }
    }
    const geminiBody = {
      contents: [{ parts }],
      generationConfig: { maxOutputTokens: max_tokens || 1500, temperature: 0.1 }
    };
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(geminiBody) }
    );
    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return res.status(200).json({ content: [{ type: "text", text }] });
  } catch (error) {
    return res.status(500).json({ error: "Analysis failed: " + error.message });
  }
}
