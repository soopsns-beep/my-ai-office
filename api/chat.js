// Vercel 서버 함수: 에이전트가 Claude AI로 대답하게 해줘요.
// - Vercel 환경변수 ANTHROPIC_API_KEY 가 없으면 사무실은 '데모 답변'으로 동작해요.
// - 모델은 키로 쓸 수 있는 목록에서 자동으로 골라요 (Haiku 우선).
//   직접 정하고 싶으면 환경변수 ANTHROPIC_MODEL 에 모델 이름을 넣어요.
// - 브라우저에서 /api/chat 주소로 들어가면 연결 상태를 점검할 수 있어요.

const API = "https://api.anthropic.com/v1";
let cachedModel = null;

function headers(key) {
  return { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" };
}

async function pickModel(key) {
  if (process.env.ANTHROPIC_MODEL) return process.env.ANTHROPIC_MODEL.trim();
  if (cachedModel) return cachedModel;
  const r = await fetch(`${API}/models?limit=100`, { headers: headers(key) });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.error?.message || `모델 목록을 못 가져왔어요 (HTTP ${r.status})`);
  const ids = (data.data || []).map(m => m.id);
  if (!ids.length) throw new Error("이 키로 쓸 수 있는 모델이 없어요");
  cachedModel = ids.find(id => id.includes("haiku")) || ids.find(id => id.includes("sonnet")) || ids[0];
  return cachedModel;
}

async function callClaude(key, system, messages) {
  const model = await pickModel(key);
  const r = await fetch(`${API}/messages`, {
    method: "POST",
    headers: headers(key),
    body: JSON.stringify({ model, max_tokens: 300, system, messages }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    if (r.status === 404) cachedModel = null;
    throw new Error(`${data?.error?.message || "API 오류"} (HTTP ${r.status}, 모델: ${model})`);
  }
  const reply = (data.content || []).filter(c => c.type === "text").map(c => c.text).join("").trim();
  return { reply, model };
}

module.exports = async (req, res) => {
  const key = (process.env.ANTHROPIC_API_KEY || "").trim();

  // 점검용: 브라우저에서 /api/chat 열기
  if (req.method === "GET") {
    if (!key) return res.status(200).json({ 서버함수: "정상", API키: "❌ 없음 → Vercel 환경변수에 ANTHROPIC_API_KEY 를 넣고 Redeploy 하세요" });
    try {
      const { reply, model } = await callClaude(key, "한 단어로만 답해.", [{ role: "user", content: "안녕" }]);
      return res.status(200).json({ 서버함수: "정상", API키: "✅ 있음", 모델: model, 테스트답변: reply, 결과: "🎉 AI 연결 성공!" });
    } catch (e) {
      return res.status(200).json({ 서버함수: "정상", API키: "✅ 있음", 결과: "❌ 연결 실패", 오류: String(e.message || e) });
    }
  }

  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  if (!key) return res.status(200).json({ reply: null, fallback: true, error: "API 키가 없어요 (Vercel 환경변수 ANTHROPIC_API_KEY)" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const system = String(body.system || "").slice(0, 1500);
    const messages = (Array.isArray(body.messages) ? body.messages : [])
      .slice(-10)
      .filter(m => m && (m.role === "user" || m.role === "assistant"))
      .map(m => ({ role: m.role, content: String(m.content).slice(0, 1000) }));
    while (messages.length && messages[0].role !== "user") messages.shift();
    if (!messages.length) messages.push({ role: "user", content: "안녕!" });

    const { reply } = await callClaude(key, system, messages);
    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(200).json({ reply: null, error: String(e.message || e) });
  }
};
