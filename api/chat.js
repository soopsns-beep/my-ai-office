// Vercel 서버 함수: 에이전트가 Claude AI로 대답하게 해줘요.
// Vercel 환경변수에 ANTHROPIC_API_KEY 가 없으면 사무실은 '데모 답변'으로 동작해요.
module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(200).json({ reply: null, fallback: true });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const system = String(body.system || "").slice(0, 1500);
    const messages = (Array.isArray(body.messages) ? body.messages : [])
      .slice(-10)
      .filter(m => m && (m.role === "user" || m.role === "assistant"))
      .map(m => ({ role: m.role, content: String(m.content).slice(0, 1000) }));
    if (!messages.length || messages[0].role !== "user") messages.unshift({ role: "user", content: "안녕!" });

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5",
        max_tokens: 300,
        system,
        messages,
      }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(200).json({ reply: null, error: data?.error?.message || "API error" });
    const reply = (data.content || []).filter(c => c.type === "text").map(c => c.text).join("").trim();
    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(200).json({ reply: null, error: String(e) });
  }
};
