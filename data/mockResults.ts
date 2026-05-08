import { ScanResult, ScanType, Signal } from '@/types';

function uuid(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

const moderatePhotoSignals: Signal[] = [
  {
    id: 'mp1',
    title: 'Heavy Image Processing',
    description: 'The profile photo shows signs of significant post-processing, which may indicate the use of AI enhancement tools or heavy filters.',
    severity: 'medium',
  },
  {
    id: 'mp2',
    title: 'Limited Photo Variety',
    description: 'Only one or two photos available, taken from similar angles. Authentic profiles typically include a range of settings and contexts.',
    severity: 'low',
  },
  {
    id: 'mp3',
    title: 'Background Consistency',
    description: 'Backgrounds appear consistent with authentic personal photography. No significant anomalies detected.',
    severity: 'info',
  },
];

const moderateProfileSignals: Signal[] = [
  {
    id: 'mp4',
    title: 'Vague Personal Details',
    description: 'The bio contains minimal specific information. Authentic profiles typically include personal context and verifiable details.',
    severity: 'medium',
  },
  {
    id: 'mp5',
    title: 'High-Status Professional Claims',
    description: 'Claims of a high-status profession without verifiable supporting details — a pattern present in a notable share of romance scam profiles.',
    severity: 'medium',
  },
  {
    id: 'mp6',
    title: 'Location Details',
    description: 'Listed location may not fully align with other contextual details in the profile. Worth asking clarifying questions.',
    severity: 'low',
  },
];

const moderateChatSignals: Signal[] = [
  {
    id: 'mc1',
    title: 'Accelerated Intimacy',
    description: 'Conversations may be moving toward emotional closeness faster than typical organic relationship development.',
    severity: 'medium',
  },
  {
    id: 'mc2',
    title: 'Platform Stability',
    description: 'No obvious pressure to move off-platform detected — a positive signal.',
    severity: 'info',
  },
];

const elevatedPhotoSignals: Signal[] = [
  {
    id: 'ep1',
    title: 'AI Generation Indicators',
    description: 'Profile images show characteristics consistent with AI-generated photography, including unusual facial symmetry and background rendering artifacts.',
    severity: 'high',
  },
  {
    id: 'ep2',
    title: 'Reverse Image Risk',
    description: 'Image style suggests possible reuse from other sources. A reverse image search is strongly recommended.',
    severity: 'high',
  },
  {
    id: 'ep3',
    title: 'Lighting Inconsistency',
    description: 'Lighting and shadow patterns across photos are inconsistent in a way that may indicate compositing or generation.',
    severity: 'medium',
  },
];

const elevatedProfileSignals: Signal[] = [
  {
    id: 'ep4',
    title: 'High-Status Claims Without Evidence',
    description: 'Profile claims a high-income profession with no verifiable details. This pattern appears frequently in documented romance scam profiles.',
    severity: 'high',
  },
  {
    id: 'ep5',
    title: 'Emotional Sympathy Narrative',
    description: 'Background story includes elements (recently widowed, single parent) commonly used to build rapid emotional sympathy.',
    severity: 'medium',
  },
  {
    id: 'ep6',
    title: 'Geographic Inconsistency',
    description: 'Claims to be local but contextual details suggest a significantly different location.',
    severity: 'medium',
  },
];

const elevatedChatSignals: Signal[] = [
  {
    id: 'ec1',
    title: 'Love Bombing Pattern',
    description: 'Extremely intense and rapid expressions of affection very early in conversation — a documented emotional manipulation tactic.',
    severity: 'high',
  },
  {
    id: 'ec2',
    title: 'Video Call Avoidance',
    description: 'Repeated deflection or excuses when video calling is suggested, including technical issues or scheduling conflicts.',
    severity: 'high',
  },
  {
    id: 'ec3',
    title: 'Off-Platform Pressure',
    description: 'Urgency to move communication to personal text, email, or WhatsApp very early in the relationship.',
    severity: 'medium',
  },
];

const lowPhotoSignals: Signal[] = [
  {
    id: 'lp1',
    title: 'Natural Image Quality',
    description: 'Photos appear naturally taken with varied lighting, angles, and settings consistent with authentic personal photography.',
    severity: 'info',
  },
  {
    id: 'lp2',
    title: 'Good Photo Variety',
    description: 'Multiple photos showing different contexts and settings — characteristic of an authentic profile.',
    severity: 'info',
  },
];

const lowProfileSignals: Signal[] = [
  {
    id: 'lp3',
    title: 'Specific Personal Details',
    description: 'The bio contains specific, verifiable information characteristic of authentic profiles.',
    severity: 'info',
  },
  {
    id: 'lp4',
    title: 'Consistent Information',
    description: 'Details across the profile appear internally consistent and coherent.',
    severity: 'info',
  },
];

const lowChatSignals: Signal[] = [
  {
    id: 'lc1',
    title: 'Natural Communication Pace',
    description: 'Conversation pace appears natural and appropriate for this stage of connection.',
    severity: 'info',
  },
];

const moderateNextSteps = [
  'Request a short, spontaneous video call before investing more emotionally',
  'Verify professional claims through LinkedIn or mutual connections',
  'Keep all conversations on the dating platform for now',
  'Avoid sharing personal financial information or your home address',
  'Consider running a reverse image search on profile photos',
  'Trust your intuition — if something feels off, it\'s worth pausing',
];

const elevatedNextSteps = [
  'Strongly consider pausing engagement until a live video call is completed',
  'Run a reverse image search using Google Images or TinEye',
  'Share profile screenshots with a trusted friend for a second opinion',
  'Never send money, gift cards, or cryptocurrency regardless of the reason given',
  'Do not share your home address, workplace, or daily schedule',
  'If pressured for financial help, this is a serious red flag — disengage safely',
  'Block and report on the platform if you feel unsafe',
];

const lowNextSteps = [
  'Meet in a public place for your first in-person meeting',
  'Let a trusted friend or family member know your plans',
  'Keep financial conversations off-limits until trust is well established',
  'Continue at a pace that feels comfortable to you',
];

function buildResult(
  scanType: ScanType,
  cautionLevel: 'low' | 'moderate' | 'elevated',
  photoSignals: Signal[],
  profileSignals: Signal[],
  chatSignals: Signal[],
  summary: string,
  nextSteps: string[]
): ScanResult {
  return {
    id: uuid(),
    scanType,
    cautionLevel,
    summary,
    photoSignals: scanType !== 'chat' ? photoSignals : [],
    profileSignals: scanType !== 'chat' ? profileSignals : [],
    chatSignals: scanType !== 'profile' ? chatSignals : [],
    nextSteps,
    createdAt: new Date().toISOString(),
  };
}

export function generateMockResult(
  scanType: ScanType,
  contextAnswers: Record<string, boolean | null>
): ScanResult {
  const yesCount = Object.values(contextAnswers).filter(Boolean).length;

  if (yesCount >= 3) {
    return buildResult(
      scanType,
      'elevated',
      elevatedPhotoSignals,
      elevatedProfileSignals,
      elevatedChatSignals,
      'Several patterns in this profile raise meaningful questions. Proceed with significant care and verify key claims before investing emotionally or meeting in person.',
      elevatedNextSteps
    );
  }

  if (yesCount >= 1) {
    return buildResult(
      scanType,
      'moderate',
      moderatePhotoSignals,
      moderateProfileSignals,
      moderateChatSignals,
      'Some patterns in this profile warrant careful attention. This does not confirm deceptive intent, but a few signals merit consideration before proceeding.',
      moderateNextSteps
    );
  }

  return buildResult(
    scanType,
    'low',
    lowPhotoSignals,
    lowProfileSignals,
    lowChatSignals,
    'This profile shows few signals of concern based on the information provided. Routine caution is always advisable when meeting new people online.',
    lowNextSteps
  );
}

export const CONTEXT_QUESTIONS = [
  {
    id: 'q1',
    text: 'Have they refused or avoided video calls?',
    description: 'Repeated camera issues, scheduling conflicts, or flat refusals when video is suggested.',
  },
  {
    id: 'q2',
    text: 'Have they asked for money or cryptocurrency?',
    description: 'Any financial request, including gifts, loans, or investment opportunities.',
  },
  {
    id: 'q3',
    text: 'Are they moving very fast emotionally?',
    description: '"Soulmate" language, deep attachment declarations, or intense affection very early on.',
  },
  {
    id: 'q4',
    text: 'Are they pushing to move off the platform?',
    description: 'Urgency to switch to personal email, WhatsApp, or text very early in the relationship.',
  },
  {
    id: 'q5',
    text: 'Do they avoid specific details about their life?',
    description: 'Vague answers about work, location, or inconsistent background stories.',
  },
];

export const SAFETY_TIPS = [
  'Always meet for the first time in a busy public place.',
  'Never send money to someone you haven\'t met in person.',
  'Tell a friend where you\'re going before a first date.',
  'Trust your gut — discomfort is information.',
  'Keep conversations on the platform until trust is established.',
  'A spontaneous video call can verify someone is who they claim to be.',
  'Reverse image search profile photos to check for reuse.',
  'Never share your home address early in a connection.',
];
