// Vercel serverless proxy → DeepSeek.
// Holds ONE DeepSeek key server-side (env var DEEPSEEK_API_KEY) so the whole
// app runs on one key without ever exposing it to the browser or the APK.
//
// Set the key in Vercel: Project → Settings → Environment Variables →
//   DEEPSEEK_API_KEY = sk-...   (then redeploy)

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

module.exports = async (req, res) => {
  // Basic CORS (harmless for same-origin web; native RN ignores it)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }

  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) {
    res.status(500).json({ error: 'Server is missing DEEPSEEK_API_KEY. Add it in Vercel env vars.' });
    return;
  }

  // Light abuse guard: block calls from other websites' browsers.
  // (Native apps and curl send no Origin, so they pass — this only stops
  // casual cross-site web abuse, not a determined attacker.)
  const origin = req.headers.origin;
  if (origin && !/^https?:\/\/(localhost(:\d+)?|[^/]+\.vercel\.app)$/.test(origin)) {
    res.status(403).json({ error: 'Forbidden origin' });
    return;
  }

  try {
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    const { system, messages } = body || {};

    const finalMessages = system
      ? [{ role: 'system', content: system }, ...(messages || [])]
      : (messages || []);

    const r = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: 'deepseek-chat', max_tokens: 400, messages: finalMessages }),
    });

    const data = await r.json();
    if (!r.ok) {
      res.status(r.status).json({ error: 'DeepSeek error', detail: data });
      return;
    }
    res.status(200).json({ content: data.choices?.[0]?.message?.content ?? '' });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};
