import { ScanResult, Signal, SignalSeverity } from '@/types';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';

// 3.5MB raw = ~4.7MB base64 — safely under the 5MB API limit
const MAX_IMAGE_BYTES = 3_500_000;

async function uriToBase64(uri: string): Promise<{ data: string; mediaType: string }> {
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

export async function analyzeImages(
  imageUris: string[],
  contextNote: string
): Promise<ScanResult> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('Missing EXPO_PUBLIC_API_URL in .env');

  const images = await Promise.all(imageUris.map(uriToBase64));

  const response = await fetch(`${apiUrl}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ images, scanType: 'full', contextText: contextNote }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Analysis failed (${response.status}): ${err}`);
  }

  const parsed = await response.json();

  return {
    id: `scan_${Date.now()}`,
    scanType: 'full',
    cautionLevel: parsed.cautionLevel,
    summary: parsed.summary,
    photoSignals: addIds(parsed.photoSignals ?? [], 'photo'),
    profileSignals: addIds(parsed.profileSignals ?? [], 'profile'),
    chatSignals: addIds(parsed.chatSignals ?? [], 'chat'),
    nextSteps: parsed.nextSteps ?? [],
    createdAt: new Date().toISOString(),
  };
}
