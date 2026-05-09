import { CONTEXT_QUESTIONS } from '@/data/mockResults';
import { CautionLevel, ScanResult, ScanType, Signal, SignalSeverity } from '@/types';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Swap this one line to change models:
// const MODEL = 'openai/gpt-4o';
// const MODEL = 'google/gemini-2.5-pro';
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

// 3.5MB raw = ~4.7MB base64 — safely under the 5MB API limit
const MAX_IMAGE_BYTES = 3_500_000;

async function uriToBase64(uri: string): Promise<{ data: string; mediaType: string }> {
  // Resize to max 1080px wide and compress as JPEG so screenshots always fit
  const compressed = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1080 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );

  const info = await FileSystem.getInfoAsync(compressed.uri);
  if (info.exists && (info as any).size > MAX_IMAGE_BYTES) {
    const mb = ((info as any).size / 1_000_000).toFixed(1);
    throw new Error(`Image is still ${mb}MB after compression — try a shorter screenshot.`);
  }

  const data = await FileSystem.readAsStringAsync(compressed.uri, { encoding: 'base64' });
  return { data, mediaType: 'image/jpeg' };
}

function addIds(signals: Omit<Signal, 'id'>[], prefix: string): Signal[] {
  return signals.map((s, i) => ({ ...s, id: `${prefix}_${i}`, severity: s.severity as SignalSeverity }));
}

// Returns 0–1 AI-generated confidence score. Returns 0 on any failure so the
// scan still runs without crashing.
async function sightengineAiScore(imageUri: string): Promise<number> {
  const apiUser = process.env.EXPO_PUBLIC_SIGHTENGINE_API_USER;
  const apiSecret = process.env.EXPO_PUBLIC_SIGHTENGINE_API_SECRET;
  if (!apiUser || !apiSecret) return 0;

  try {
    const form = new FormData();
    form.append('media', { uri: imageUri, type: 'image/jpeg', name: 'photo.jpg' } as any);
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

export async function analyzeImages(
  imageUris: string[],
  scanType: ScanType,
  contextAnswers: Record<string, boolean | null>
): Promise<ScanResult> {
  const apiKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('Missing EXPO_PUBLIC_OPENROUTER_API_KEY in .env');

  // Run Sightengine on all images in parallel alongside base64 encoding.
  // Chat-only scans skip AI detection since they have no profile photos.
  const [images, aiScores] = await Promise.all([
    Promise.all(imageUris.map(uriToBase64)),
    scanType !== 'chat'
      ? Promise.all(imageUris.map(sightengineAiScore))
      : Promise.resolve([] as number[]),
  ]);

  const maxAiScore = aiScores.length > 0 ? Math.max(...aiScores) : 0;

  const answeredContext = CONTEXT_QUESTIONS
    .map(q => {
      const a = contextAnswers[q.id];
      if (a === null || a === undefined) return null;
      return `- ${q.text}: ${a ? 'YES' : 'NO'}`;
    })
    .filter(Boolean)
    .join('\n');

  const focusHint =
    scanType === 'profile' ? 'Focus on photo authenticity, profile consistency, and bio red flags.' :
    scanType === 'chat' ? 'Focus on manipulation patterns, financial requests, emotional pressure, and inconsistencies.' :
    'Provide a comprehensive analysis of both profile and conversation.';

  const userText = [
    `Analyze these ${scanType === 'full' ? 'profile and chat' : scanType} screenshots for dating safety concerns.`,
    focusHint,
    scanType !== 'chat' ? `\nExternal AI detection result: ${aiScoreContext(maxAiScore)}` : '',
    answeredContext ? `\nUser context:\n${answeredContext}` : '',
  ].filter(Boolean).join('\n');

  // OpenAI-compatible image content blocks
  const imageBlocks = images.map(img => ({
    type: 'image_url' as const,
    image_url: { url: `data:${img.mediaType};base64,${img.data}` },
  }));

  const response = await fetch(API_URL, {
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
        {
          role: 'user',
          content: [
            ...imageBlocks,
            { type: 'text', text: userText },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content;

  // Strip markdown code fences if the model wraps JSON in ```json ... ```
  const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const parsed = JSON.parse(clean);

  return {
    id: `scan_${Date.now()}`,
    scanType,
    cautionLevel: parsed.cautionLevel as CautionLevel,
    summary: parsed.summary,
    photoSignals: addIds(parsed.photoSignals ?? [], 'photo'),
    profileSignals: addIds(parsed.profileSignals ?? [], 'profile'),
    chatSignals: addIds(parsed.chatSignals ?? [], 'chat'),
    nextSteps: parsed.nextSteps ?? [],
    createdAt: new Date().toISOString(),
  };
}
