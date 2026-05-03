export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { messages, system, max_tokens } = req.body;
    const groqMessages = [];
    if (system) groqMessages.push({ role: "system", content: system });
    for (const msg of messages) {
      if (typeof msg.content === "string") {
        groqMessages.push({ role: msg.role, content: msg.content });
      } else if (Array.isArray(msg.content)) {
        const parts = [];
        for (const block of msg.content) {
          if (block.type === "text") {
            parts.push({ type: "text", text: block.text });
          } else if (block.type === "image" && block.source) {
            if (block.source.type === "base64") {
              parts.push({ type: "image_url", image_url: { url: "data:" + (block.source.media_type || "image/jpeg") + ";base64," + block.source.data } });
            } else if (block.source.type === "url") {
              parts.push({ type: "image_url", image_url: { url: block.source.url } });
            }
          }
        }
        groqMessages.push({ role: msg.role, content: parts });
      }
    }
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + process.env.GROQ_API_KEY },
      body: JSON.stringify({ model: "meta-llama/llama-4-scout-17b-16e-instruct", messages: groqMessages, max_tokens: max_tokens || 1500, temperature: 0.1 })
    });
    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const text = data.choices?.[0]?.message?.content || "";
    return res.status(200).json({ content: [{ type: "text", text }] });
  } catch (error) {
    return res.status(500).json({ error: "Analysis failed: " + error.message });
  }
}
