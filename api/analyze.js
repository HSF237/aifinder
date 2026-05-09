export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { messages, system, max_tokens } = req.body;

    // Use Anthropic Claude directly — best vision accuracy for AI detection
    const anthropicBody = {
      model: "claude-haiku-4-5-20251001",
      max_tokens: max_tokens || 2000,
      messages: messages,
    };
    if (system) anthropicBody.system = system;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(anthropicBody)
    });

    const data = await response.json();
    if (data.error) {
      console.error("Anthropic API error:", data.error);
      return res.status(500).json({ error: data.error.message || "API error" });
    }

    // Return in same format frontend expects
    const text = data.content?.[0]?.text || "";
    return res.status(200).json({ content: [{ type: "text", text }] });
  } catch (error) {
    return res.status(500).json({ error: "Analysis failed: " + error.message });
  }
}
