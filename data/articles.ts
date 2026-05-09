import { Colors } from '@/constants/colors';

export interface ArticleSection {
  heading: string;
  body: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  sf: string;
  readMinutes: number;
  summary: string;
  sections: ArticleSection[];
  takeaways: string[];
}

export const ARTICLES: Article[] = [
  {
    id: 'ai-photos',
    title: 'How to Spot an AI-Generated Photo',
    category: 'Photo Analysis',
    categoryColor: Colors.indigo,
    sf: 'eye.fill',
    readMinutes: 3,
    summary: 'AI image generators have become convincingly good — but they still leave traces. Here is what to look for.',
    sections: [
      {
        heading: 'Why this matters',
        body: 'AI-generated profile photos are now a standard tool in romance scams and catfishing. The generators (Midjourney, DALL-E, Stable Diffusion) produce faces that look hyper-real at a glance, but break down on close inspection.',
      },
      {
        heading: 'Skin and texture',
        body: 'Real skin has pores, uneven tone, and subtle imperfections. AI skin tends to look airbrushed to an impossible degree — no pores, uniform smoothness, a slight "painted" quality. Zoom in on the forehead, cheeks, and nose.',
      },
      {
        heading: 'Background and edges',
        body: 'AI struggles with the boundary between a person and their background. Look for: hair strands that fade unnaturally into the background, soft or warped edges around the shoulders, and backgrounds that look too clean or slightly blurred in inconsistent ways.',
      },
      {
        heading: 'Eyes and jewelry',
        body: 'Eyes are a giveaway — look for catchlights (the reflection of a light source) that appear duplicated, irises that are asymmetric, or a slightly "painted on" quality. Earrings and glasses are notoriously difficult for AI — one earring may be different from the other, or glasses may have distorted frames.',
      },
      {
        heading: 'Hands and teeth',
        body: 'AI frequently generates hands with fused or extra fingers, odd proportions, or knuckles in the wrong place. Teeth often look too uniform — perfectly straight and same-sized with no slight variation, or slightly "melted" at the edges where they meet the gums.',
      },
      {
        heading: 'The overall feeling',
        body: 'Trust the "uncanny valley" response. AI images often feel slightly too perfect — symmetrical face, ideal lighting, ideal background, ideal angle. Real photos have a human randomness to them. If everything looks like a professional studio shot with no plausible explanation, that is a signal.',
      },
    ],
    takeaways: [
      'Zoom in on skin texture — real skin has pores and imperfections',
      'Check jewelry: earrings and glasses should match perfectly on both sides',
      'Look at the hair-to-background edge for unnatural fading',
      'Count fingers in any hand photo',
      'Too perfect is itself a red flag — real photos have randomness',
    ],
  },
  {
    id: 'romance-scam',
    title: 'The Romance Scam Playbook',
    category: 'Scam Patterns',
    categoryColor: Colors.danger,
    sf: 'theatermasks.fill',
    readMinutes: 4,
    summary: 'Romance scams follow a predictable script. Knowing the stages makes them much easier to recognize before real damage is done.',
    sections: [
      {
        heading: 'The scale of the problem',
        body: 'Romance scams cost people over $1.3 billion in 2022 in the US alone — more than any other consumer fraud category. The average victim loses $10,000. The emotional damage is often worse than the financial loss.',
      },
      {
        heading: 'Stage 1 — Building trust (weeks to months)',
        body: 'The scammer creates a believable persona: usually an attractive professional (military, doctor, engineer working abroad) with a compelling backstory. They invest significant time in daily messages, video calls (using deepfakes or pre-recorded clips), and emotional bonding. They mirror your interests and values. This stage is genuine effort — they are building an emotional investment in you.',
      },
      {
        heading: 'Stage 2 — The crisis',
        body: 'Once trust is established, a sudden crisis appears: a medical emergency, a legal problem, a business deal gone wrong, equipment stolen. The crisis is always urgent and always has a money-shaped solution. The ask is framed as temporary — "I will pay you back as soon as I get home."',
      },
      {
        heading: 'Stage 3 — Escalation',
        body: 'If the first payment is made, more crises follow. Each one larger. Excuses multiply for why they cannot meet in person or do a real-time video call. When victims express doubt, scammers deploy guilt ("I thought you loved me"), urgency, or brief reconciliation before the next ask.',
      },
      {
        heading: 'The common personas',
        body: 'Military (deployed overseas, explains no in-person visits), oil rig workers or offshore engineers, doctors with "Doctors Without Borders," widowed entrepreneurs, successful investors. These profiles are chosen because they provide ready-made excuses for distance, unusual hours, and financial need.',
      },
      {
        heading: 'Why intelligent people fall for it',
        body: 'This is not about intelligence — it is about loneliness, hope, and sophisticated social engineering. Scammers are professionals who run multiple targets simultaneously, using scripts refined over years. The emotional investment is real even if the person is not.',
      },
    ],
    takeaways: [
      'Any request for money before meeting in person is a major red flag',
      'Military/doctor/engineer abroad personas are the most common covers',
      'Urgency and crisis framing are core manipulation techniques',
      'Excuses for never video calling live (camera broken, connection issues) are a warning sign',
      'The emotional pain of being scammed is real — seek support if this has happened to you',
    ],
  },
  {
    id: 'love-bombing',
    title: 'Love Bombing vs Genuine Interest',
    category: 'Emotional Safety',
    categoryColor: Colors.warning,
    sf: 'heart.fill',
    readMinutes: 3,
    summary: 'Intense early affection can feel like a fairytale. It can also be a calculated tactic. Here is how to tell the difference.',
    sections: [
      {
        heading: 'What love bombing is',
        body: 'Love bombing is an overwhelming show of affection and attention in the early stages of a relationship — constant messages, lavish compliments, declarations of love within days, making you feel like the most special person they have ever met. It is designed to create emotional dependency before you have had time to evaluate the relationship rationally.',
      },
      {
        heading: 'How it differs from genuine enthusiasm',
        body: 'Genuine interest respects your pace. Someone who genuinely likes you is excited but also attentive to whether you are comfortable. Love bombing ignores your pace entirely — it escalates regardless of your responses, pushes past stated boundaries, and creates a sense of pressure disguised as romance.',
      },
      {
        heading: 'The key signs',
        body: 'Declarations of love or soulmate language within the first week. Pressure to define the relationship immediately. Anger or hurt feelings when you need space. Gifts or grand gestures before you know each other. The feeling that you "owe" them reciprocal intensity. Making future plans (moving in, travel) extremely early.',
      },
      {
        heading: 'Why it works',
        body: 'Love bombing exploits normal human needs — to feel special, chosen, and loved. When it is happening, it feels extraordinary. The intensity is mistaken for depth. By the time the pattern shifts (often to control or withdrawal), there is already emotional investment that makes it hard to leave.',
      },
      {
        heading: 'In the context of online dating',
        body: 'Love bombing is particularly common in online scams because scammers can simulate intense emotional connection cheaply and quickly. But it also happens in genuine relationships where the other person has controlling tendencies. Either way, the right move is the same: slow down, pay attention to pace, notice if they respect your boundaries.',
      },
    ],
    takeaways: [
      'Genuine interest respects your pace — love bombing escalates regardless of it',
      'Soulmate or "I\'ve never felt this way" language in week one is a warning sign',
      'Notice whether they accept it gracefully when you need space',
      'Grand gestures early on create a sense of obligation — that is the point',
      'Slowing down is always safe — someone with good intentions will understand',
    ],
  },
  {
    id: 'pig-butchering',
    title: 'Pig Butchering: The Long-Game Scam',
    category: 'Financial Safety',
    categoryColor: Colors.teal.primary,
    sf: 'chart.line.uptrend.xyaxis',
    readMinutes: 4,
    summary: 'A scam that starts as a romance and ends as a crypto investment. One of the fastest-growing and most devastating fraud types today.',
    sections: [
      {
        heading: 'The name',
        body: '"Pig butchering" (shā zhū pán in Chinese) refers to the process of fattening a pig before slaughter — the scammer patiently builds a relationship and trust before extracting money. These are sophisticated, long-running operations, often run by organized crime.',
      },
      {
        heading: 'How it starts',
        body: 'Usually a "wrong number" text, a random match on a dating app, or a LinkedIn connection from an attractive stranger. They are friendly, interesting, and patient. There is no immediate pitch. Weeks of conversation build genuine connection before the topic of investment ever comes up.',
      },
      {
        heading: 'The investment introduction',
        body: 'Eventually the scammer mentions they have been making money through cryptocurrency trading, often using a platform their "uncle" manages or a special strategy. They offer to show you how. Early "investments" show real returns — you can withdraw small amounts to build confidence. The platform is fake, the returns are fabricated.',
      },
      {
        heading: 'The harvest',
        body: 'Once significant funds are deposited, the platform suddenly shows a problem: a tax issue, a freeze, a "VIP upgrade" fee required to withdraw. Every solution requires more money. Eventually the platform goes dark and the scammer disappears. Victims often lose their entire savings.',
      },
      {
        heading: 'Why it is so effective',
        body: 'By the time the investment is pitched, there is real emotional connection. The victim is not evaluating a cold investment pitch — they are trusting someone they care about. The fake platform looks professional. Early withdrawals work. The scam is designed by professionals who understand psychology.',
      },
      {
        heading: 'Red flags specific to this scam',
        body: 'Any romantic contact who introduces investment opportunities early. Platforms you cannot find independent reviews of. Returns that seem unusually consistent or high. Fees or taxes required to withdraw your own money. Urgency around a "limited window" to invest.',
      },
    ],
    takeaways: [
      'Any romantic interest who introduces crypto/investment opportunities is a major red flag',
      'Working withdrawals early on are part of the scam — they build confidence',
      'Fees to "unlock" your own money are always fraud',
      'If you cannot find the platform independently, it is fake',
      'These are professional operations — do not feel embarrassed if you encountered one',
    ],
  },
  {
    id: 'verify-identity',
    title: 'How to Verify Someone Is Who They Say They Are',
    category: 'Identity Checks',
    categoryColor: Colors.teal.light,
    sf: 'person.badge.shield.checkmark.fill',
    readMinutes: 3,
    summary: 'A practical toolkit for confirming someone\'s identity before you meet — without being accusatory about it.',
    sections: [
      {
        heading: 'Why verification matters',
        body: 'Catfishing and impersonation are more common than most people realize. Someone can maintain a convincing false identity for months over text. A few simple checks, done naturally, can save you significant time, emotional energy, and potentially money.',
      },
      {
        heading: 'Reverse image search',
        body: 'Save their profile photo and run it through Google Images or TinEye. If the photo appears under a different name or on a stock photo site, that is definitive. If it appears nowhere at all — which is increasingly common with AI-generated images — that is also a signal, since most real people have some online presence.',
      },
      {
        heading: 'Live video call',
        body: 'A live, unscripted video call is the most reliable verification. Ask them to wave, hold up a specific object, or do something spontaneous. Pre-recorded videos and deepfakes cannot respond to real-time requests. If they consistently avoid or reschedule video calls, treat it as a serious warning sign.',
      },
      {
        heading: 'Cross-reference social accounts',
        body: 'A real person leaves a digital trail that is consistent over time. Look for: LinkedIn matching their claimed profession, Instagram or Facebook with photos from multiple years and normal social interactions (comments from friends), and consistent details across platforms. Scammer accounts often have thin or inconsistent histories.',
      },
      {
        heading: 'Ask natural questions that are hard to fake',
        body: 'If they claim to live in a specific city, ask casual questions about it — local neighborhoods, recent events, sports teams. Someone who actually lives there answers naturally. Someone who is lying either hedges or over-researches. You can also ask about their workplace in ways that could be verified with a quick LinkedIn search.',
      },
      {
        heading: 'Trust the pace of verification',
        body: 'You do not need to interrogate someone. Simply move toward in-person meeting at a reasonable pace. A genuine person will be happy to meet. Endless deferrals, even with plausible excuses, are a pattern worth noticing.',
      },
    ],
    takeaways: [
      'Reverse image search every profile photo before investing emotionally',
      'A live, spontaneous video call is the gold standard for verification',
      'Check that social accounts have consistent histories across multiple years',
      'Ask casual, specific questions about their claimed city or workplace',
      'Consistent excuses for never meeting in person are a pattern, not a coincidence',
    ],
  },
  {
    id: 'red-flags-chat',
    title: 'Red Flags in Conversation',
    category: 'Chat Patterns',
    categoryColor: Colors.indigo,
    sf: 'bubble.left.and.exclamationmark.bubble.right.fill',
    readMinutes: 3,
    summary: 'What to watch for in messages — from subtle inconsistencies to clear manipulation tactics.',
    sections: [
      {
        heading: 'Scripted or templated feel',
        body: 'Scam operations often use scripts. Messages may feel slightly off — overly formal, unusually poetic, or paced in a way that does not match a real conversation flow. Compliments are generic ("you are so beautiful and kind") rather than specific to things you have said. Responses to your questions may not quite address what you asked.',
      },
      {
        heading: 'Inconsistencies over time',
        body: 'Real people are consistent. Scammers managing multiple targets lose track of details. Pay attention to: age, job details, where they grew up, family structure. If something they say contradicts something from an earlier conversation, note it and probe gently.',
      },
      {
        heading: 'Moving off-platform quickly',
        body: 'A push to move from a dating app to WhatsApp, Telegram, or personal email very early is a red flag. Dating apps have fraud detection and moderation. Moving off-platform removes those protections — and the record of the conversation.',
      },
      {
        heading: 'Urgency and emotional pressure',
        body: 'Creating urgency is a core manipulation technique. It bypasses rational evaluation. Watch for: artificial deadlines ("I need to know by tonight"), emotional pressure ("I thought you trusted me"), guilt framing ("after everything I have shared with you"), and sudden crises that require immediate decisions.',
      },
      {
        heading: 'Isolation tactics',
        body: 'Gradually discouraging you from discussing the relationship with friends or family. Framing your support network as jealous, unsupportive, or not understanding what you have. This is about reducing outside perspective that might challenge the narrative.',
      },
      {
        heading: 'The trajectory test',
        body: 'Step back and look at the overall arc. Is this person moving toward real-world connection (meeting, calls, shared activities) or has the relationship stayed in a comfortable digital space for months? Genuine connections naturally move toward reality. Scams and unhealthy dynamics stay in the zone they can control.',
      },
    ],
    takeaways: [
      'Generic compliments and scripted feel suggest a copy-paste operation',
      'Track factual inconsistencies — real people do not contradict themselves on basics',
      'Moving off-platform quickly removes protections — slow this down',
      'Urgency and guilt are manipulation tools — real decisions can take time',
      'Healthy relationships move toward reality; problematic ones stay digital indefinitely',
    ],
  },
];
