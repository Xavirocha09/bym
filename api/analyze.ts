import type { VercelRequest, VercelResponse } from '@vercel/node';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'anthropic/claude-opus-4-5';

const SYSTEM_PROMPT = `You are a dating safety analyst specializing in detecting deception, manipulation, and AI-generated content in dating profiles and conversations.

LANGUAGE RULES:
- Never say "this is fake" or "this is a scammer" — use: "patterns consistent with...", "signals that may indicate...", "warrants serious attention"
- Be direct and specific about what you observe, not vague
- NEVER mention any external tools, services, classifiers, or APIs by name in your output — describe findings in plain language only (e.g. "pixel-level analysis indicates...", "image authenticity signals suggest...")

AI IMAGE DETECTION — IMPORTANT:
- A pixel-level AI image analysis has already run on the photo and will provide a confidence score in the user message.
- ALWAYS trust that score over your own visual assessment. Modern AI images are visually indistinguishable — the analysis uses noise-pattern detection that you cannot replicate.
- If the score is provided and >= 70%: flag as HIGH severity, cautionLevel minimum elevated.
- If the score is 40–69%: flag as MEDIUM severity, cautionLevel minimum moderate.
- If the score is 20–39%: flag as LOW severity.
- If no score is provided, use your visual judgment as a fallback only.

SEVERITY RULES (strictly follow these):
- AI-generated photo (classifier >= 70%) → photoSignals severity: HIGH, cautionLevel minimum: elevated
- AI-generated photo (classifier 40–69%) → photoSignals severity: MEDIUM, cautionLevel minimum: moderate
- Stock photo / reverse-image-search indicator → HIGH, minimum: elevated
- Financial request in chat → HIGH, minimum: elevated
- Refuses video call after extended contact → MEDIUM, minimum: moderate
- Love bombing / unusually fast emotional escalation → MEDIUM
- Profile inconsistencies (age/location mismatch, vague bio) → LOW to MEDIUM
- Minor stylistic observations with no safety implication → info

CAUTION LEVEL CALIBRATION:
- low: everything appears authentic, no meaningful signals detected
- moderate: 1-2 minor signals, proceed with normal awareness
- elevated: any single HIGH severity signal, or 3+ medium signals — significant caution warranted
- high: multiple HIGH signals, or any combination suggesting deliberate deception

Respond with ONLY valid JSON, no markdown, no explanation:
{
  "cautionLevel": "low" | "moderate" | "elevated" | "high",
  "summary": "2-3 sentences. Be specific about what you found. Use cautious language.",
  "photoSignals": [{ "title": "...", "description": "...", "severity": "info" | "low" | "medium" | "high" }],
  "profileSignals": [{ "title": "...", "description": "...", "severity": "info" | "low" | "medium" | "high" }],
  "chatSignals": [{ "title": "...", "description": "...", "severity": "info" | "low" | "medium" | "high" }],
  "nextSteps": ["specific actionable recommendation", ...]
}

Return empty arrays [] for categories not applicable to the scan type. nextSteps: 2-4 items. Be specific — not generic advice.`;

async function sightengineScore(base64: string): Promise<number> {
  const apiUser = process.env.EXPO_SIGHTENGINE_API_USER;
  const apiSecret = process.env.EXPO_SIGHTENGINE_API_SECRET;
  if (!apiUser || !apiSecret) return 0;

  try {
    const buffer = Buffer.from(base64, 'base64');
    const blob = new Blob([buffer], { type: 'image/jpeg' });

    const form = new FormData();
    form.append('media', blob, 'photo.jpg');
    form.append('models', 'genai');
    form.append('api_user', apiUser);
    form.append('api_secret', apiSecret);

    const res = await fetch('https://api.sightengine.com/1.0/check.json', {
      method: 'POST',
      body: form,
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data?.type?.ai_generated ?? 0;
  } catch {
    return 0;
  }
}

function aiScoreContext(score: number): string {
  if (score >= 0.7) return `Pixel-level image analysis: ${Math.round(score * 100)}% confidence — AI-GENERATED. Treat as HIGH severity photo signal.`;
  if (score >= 0.4) return `Pixel-level image analysis: ${Math.round(score * 100)}% confidence — likely AI-generated. Treat as MEDIUM severity photo signal.`;
  if (score >= 0.2) return `Pixel-level image analysis: ${Math.round(score * 100)}% confidence — possibly AI-generated. Treat as LOW severity photo signal.`;
  return `Pixel-level image analysis: ${Math.round(score * 100)}% confidence — photo appears authentic.`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.EXPO_OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Server misconfigured' });

  const { images, scanType, contextText } = req.body as {
    images: { data: string; mediaType: string }[];
    scanType: string;
    contextText: string;
  };

  if (!images?.length || !scanType) {
    return res.status(400).json({ error: 'Missing images or scanType' });
  }

  const aiScores = scanType !== 'chat'
    ? await Promise.all(images.map(img => sightengineScore(img.data)))
    : [];
  const maxAiScore = aiScores.length > 0 ? Math.max(...aiScores) : 0;

  const focusHint =
    scanType === 'profile' ? 'Focus on photo authenticity, profile consistency, and bio red flags.' :
    scanType === 'chat' ? 'Focus on manipulation patterns, financial requests, emotional pressure, and inconsistencies.' :
    'Analyze all provided screenshots comprehensively. Content may include profile photos, bio/about sections, and/or chat conversations — analyze whatever is present and relevant.';

  const userText = [
    `Analyze these ${scanType === 'full' ? 'profile and chat' : scanType} screenshots for dating safety concerns.`,
    focusHint,
    scanType !== 'chat' ? `\nExternal AI detection result: ${aiScoreContext(maxAiScore)}` : '',
    contextText ? `\nUser context:\n${contextText}` : '',
  ].filter(Boolean).join('\n');

  const imageBlocks = images.map(img => ({
    type: 'image_url' as const,
    image_url: { url: `data:${img.mediaType};base64,${img.data}` },
  }));

  const upstream = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://beforeyoumeet.app',
      'X-Title': 'BeforeYouMeet',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: [...imageBlocks, { type: 'text', text: userText }] },
      ],
    }),
  });

  if (!upstream.ok) {
    const err = await upstream.text();
    return res.status(502).json({ error: `Upstream error ${upstream.status}: ${err}` });
  }

  const data = await upstream.json();
  const text = data.choices[0].message.content;
  const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(clean);
  } catch {
    return res.status(502).json({ error: 'Invalid response from model' });
  }

  return res.json({
    cautionLevel: parsed.cautionLevel,
    summary: parsed.summary,
    photoSignals: parsed.photoSignals ?? [],
    profileSignals: parsed.profileSignals ?? [],
    chatSignals: parsed.chatSignals ?? [],
    nextSteps: parsed.nextSteps ?? [],
  });
}
