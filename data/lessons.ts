import { Colors } from '@/constants/colors';

export type InfoStep = {
  type: 'info';
  sf?: string;
  heading: string;
  body: string;
};

export type QuizStep = {
  type: 'quiz';
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

export type LessonStep = InfoStep | QuizStep;

export interface Lesson {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  sf: string;
  xp: number;
  summary: string;
  steps: LessonStep[];
}

export const LESSONS: Lesson[] = [
  {
    id: 'ai-photos',
    title: 'How to Spot an AI-Generated Photo',
    category: 'Photo Analysis',
    categoryColor: Colors.indigo,
    sf: 'eye.fill',
    xp: 50,
    summary: 'AI image generators have become convincingly good — but they still leave traces you can train yourself to spot.',
    steps: [
      {
        type: 'info',
        sf: 'sparkles',
        heading: 'Why this matters',
        body: 'AI-generated profile photos are now a standard tool in romance scams. The generators produce faces that look hyper-real at a glance — but they break down on close inspection. Knowing what to look for changes everything.',
      },
      {
        type: 'info',
        sf: 'face.dashed',
        heading: 'Skin texture',
        body: 'Real skin has pores, uneven tone, and subtle imperfections. AI skin looks airbrushed to an impossible degree — no pores, uniform smoothness, a slight "painted" quality. Zoom into the forehead and cheeks.',
      },
      {
        type: 'info',
        sf: 'wind',
        heading: 'Hair and background edges',
        body: 'AI struggles with the boundary between a person and their background. Look for hair strands that fade unnaturally into the background, soft warping around the shoulders, or backgrounds that seem too clean or inconsistently blurred.',
      },
      {
        type: 'quiz',
        question: 'Which is the most reliable giveaway of AI-generated skin?',
        options: [
          'Dark circles under the eyes',
          'No visible pores or skin texture',
          'Overly tan complexion',
          'Slight redness around the nose',
        ],
        correct: 1,
        explanation: 'AI skin is almost always too smooth. Real skin, even at its best, has visible pores and subtle texture variations — especially around the nose and cheeks.',
      },
      {
        type: 'info',
        sf: 'eye',
        heading: 'Eyes and jewelry',
        body: 'AI eyes often have duplicated catchlights (light reflections) or slightly asymmetric irises. Earrings and glasses are notoriously difficult — one earring may look completely different from the other, or glasses may have distorted frames.',
      },
      {
        type: 'info',
        sf: 'hand.raised.fill',
        heading: 'Hands and teeth',
        body: 'Hands are a classic AI tell — merged fingers, extra fingers, or knuckles in the wrong place. Teeth often look too uniform: perfectly straight, same size, with a slightly melted quality where they meet the gumline.',
      },
      {
        type: 'quiz',
        question: 'A profile photo looks flawless, but zooming in shows the earrings look completely different from each other. What does this suggest?',
        options: [
          'They have asymmetric piercings — fairly common',
          'The photo was taken from an angle',
          'The photo may be AI-generated',
          'Heavy filter was applied',
        ],
        correct: 2,
        explanation: 'Asymmetric jewelry is a classic AI tell. Generators struggle to keep both sides of accessories consistent — real photos don\'t have this problem.',
      },
      {
        type: 'info',
        sf: 'checkmark.shield',
        heading: 'The "uncanny valley" feeling',
        body: 'Trust your instinct when something feels off. AI images are often too perfect: ideal lighting, ideal symmetry, ideal background. Real photos have randomness and imperfection. If everything looks like a professional shoot with no plausible explanation, that\'s a signal.',
      },
      {
        type: 'quiz',
        question: 'Which combination is the strongest indicator of an AI-generated photo?',
        options: [
          'Sunglasses + outdoor background',
          'Perfect skin + mismatched earrings + hair fading into background',
          'Heavy filter + low resolution',
          'Professional lighting + clean background',
        ],
        correct: 1,
        explanation: 'No single sign is conclusive, but the combination of impossible skin, asymmetric jewelry, and unnatural background edges together strongly points to AI generation.',
      },
    ],
  },
  {
    id: 'romance-scam',
    title: 'The Romance Scam Playbook',
    category: 'Scam Patterns',
    categoryColor: Colors.danger,
    sf: 'theatermasks.fill',
    xp: 80,
    summary: 'Romance scams follow a predictable script. Knowing the stages makes them much easier to recognize before real damage is done.',
    steps: [
      {
        type: 'info',
        sf: 'chart.bar.fill',
        heading: 'The scale of the problem',
        body: 'Romance scams cost over $1.3 billion in 2022 in the US alone — more than any other consumer fraud. The average victim loses $10,000. These aren\'t random attacks; they follow a professional, repeatable script.',
      },
      {
        type: 'info',
        sf: 'person.fill',
        heading: 'Stage 1 — Building trust',
        body: 'The scammer creates a believable persona: usually attractive and professional — military, doctor, or engineer working abroad. They invest weeks in daily messages, emotional bonding, and mirroring your values. This stage is intentional effort designed to create real feelings.',
      },
      {
        type: 'info',
        sf: 'exclamationmark.triangle.fill',
        heading: 'Stage 2 — The crisis',
        body: 'Once trust is established, a sudden emergency appears: a medical crisis, a legal problem, a business deal gone wrong. The solution is always money-shaped and framed as temporary: "I\'ll pay you back as soon as I get home."',
      },
      {
        type: 'quiz',
        question: 'What is the typical sequence of events in a romance scam?',
        options: [
          'Quick financial request, then emotional connection',
          'Weeks of genuine connection, then a sudden crisis, then a money request',
          'Meeting in person, then drifting to long distance',
          'Investment pitch, then romantic interest',
        ],
        correct: 1,
        explanation: 'The trust-building phase is essential — it\'s what makes the crisis feel real and the request feel reasonable. The long setup is the point.',
      },
      {
        type: 'info',
        sf: 'briefcase.fill',
        heading: 'The common personas',
        body: 'Military deployed overseas explains why they can\'t visit. Doctors with NGOs explain irregular hours. Widowed entrepreneurs explain both wealth and vulnerability. These personas are chosen specifically because they justify distance and financial need.',
      },
      {
        type: 'quiz',
        question: 'Which persona is most commonly used in romance scams?',
        options: [
          'Local teacher or nurse',
          'Celebrity or public figure',
          'Military deployed overseas or engineer working abroad',
          'Retired professional',
        ],
        correct: 2,
        explanation: 'Military and overseas professionals are the dominant personas because they provide a ready-made excuse for never meeting in person and for financial emergencies "far from home."',
      },
      {
        type: 'info',
        sf: 'arrow.up.circle.fill',
        heading: 'Stage 3 — Escalation',
        body: 'After the first payment, more crises follow — each one larger. When victims express doubt, scammers deploy guilt ("I thought you loved me") or brief reconciliation before the next ask. This cycle can continue for months.',
      },
      {
        type: 'info',
        sf: 'brain.fill',
        heading: 'Why intelligent people fall for it',
        body: 'This is not about intelligence — it\'s about loneliness, hope, and professional social engineering. Scammers run multiple targets simultaneously using scripts refined over years. The emotional investment is real even when the person isn\'t.',
      },
      {
        type: 'quiz',
        question: 'Someone you\'ve been talking to for 6 weeks has a sudden medical emergency and asks you to wire $2,000, promising to repay you when they visit. What\'s the most likely explanation?',
        options: [
          'They\'re in genuine trouble and reached out to someone they trust',
          'This is a classic romance scam crisis stage',
          'They\'re testing how generous you are',
          'They\'re too embarrassed to ask their own family',
        ],
        correct: 1,
        explanation: 'The combination of 6 weeks of connection + sudden crisis + money request + a repayment promise is the textbook Stage 2 pattern. The timing is not a coincidence.',
      },
      {
        type: 'quiz',
        question: 'When a romance scam victim starts to express doubt, what tactic do scammers most commonly use?',
        options: [
          'They immediately confess and apologize',
          'They stop contact permanently',
          'Guilt ("I thought you trusted me") or brief reconciliation before the next ask',
          'They send more photos as proof of identity',
        ],
        correct: 2,
        explanation: 'Guilt and brief reconciliation ("everything is fine again") reset the victim\'s emotional state and rebuild trust before the next request. It\'s a deliberate cycle.',
      },
    ],
  },
  {
    id: 'love-bombing',
    title: 'Love Bombing vs Genuine Interest',
    category: 'Emotional Safety',
    categoryColor: Colors.warning,
    sf: 'heart.fill',
    xp: 50,
    summary: 'Intense early affection can feel like a fairytale. It can also be a calculated tactic. Here\'s how to tell the difference.',
    steps: [
      {
        type: 'info',
        sf: 'heart.fill',
        heading: 'What love bombing is',
        body: 'Love bombing is an overwhelming show of affection in the early stages: constant messages, lavish compliments, declarations of love within days, making you feel like the most special person they\'ve ever met. It feels like a fairytale — intentionally.',
      },
      {
        type: 'info',
        sf: 'lock.fill',
        heading: 'The real purpose',
        body: 'The goal isn\'t romance — it\'s dependency. By flooding you with attention before you\'ve had time to evaluate the relationship rationally, love bombing creates emotional investment that\'s hard to step back from.',
      },
      {
        type: 'quiz',
        question: 'What is the primary purpose of love bombing?',
        options: [
          'To express genuinely strong feelings that developed quickly',
          'To create emotional dependency before the relationship can be evaluated',
          'To compete with other potential matches',
          'To make up for a difficult personality',
        ],
        correct: 1,
        explanation: 'Love bombing is about creating attachment before you have enough information to make a clear-eyed decision about the relationship. Speed is the strategy.',
      },
      {
        type: 'info',
        sf: 'arrow.left.and.right',
        heading: 'Genuine interest vs love bombing',
        body: 'Genuine enthusiasm respects your pace and comfort. Love bombing ignores your pace entirely — it escalates regardless of your responses, pushes past stated boundaries, and creates pressure disguised as passion.',
      },
      {
        type: 'info',
        sf: 'list.bullet',
        heading: 'The key signs',
        body: 'Soulmate language in the first week. Anger or withdrawal when you need space. Future plans (moving in, travel) made very early. Feeling that you "owe" them reciprocal intensity. Any boundary you set is met with hurt rather than understanding.',
      },
      {
        type: 'quiz',
        question: 'You matched with someone two weeks ago. They say they\'ve never felt this way about anyone and suggest you move in together. When you say you\'re not ready, they become hurt and distant. What does this describe?',
        options: [
          'Genuine intense chemistry that developed fast',
          'Love bombing with boundary-testing',
          'Normal enthusiasm at the start of dating',
          'Attachment anxiety — common and manageable',
        ],
        correct: 1,
        explanation: 'The combination of extreme early declarations + a negative reaction to a reasonable boundary is the clearest pattern. Genuine enthusiasm accepts "not yet" gracefully.',
      },
      {
        type: 'info',
        sf: 'network',
        heading: 'Online dating and scams',
        body: 'Love bombing is especially common in online scams because scammers can simulate intense emotional connection cheaply and quickly. But it also happens in genuine relationships with controlling tendencies. Either way, the right move is the same: slow down.',
      },
      {
        type: 'quiz',
        question: 'What\'s the clearest signal that distinguishes love bombing from genuine enthusiasm?',
        options: [
          'How often they message you',
          'Whether they accept it gracefully when you need space',
          'How attractive they are',
          'Whether they remember small details about you',
        ],
        correct: 1,
        explanation: 'The response to your needs is the tell. Someone who genuinely cares about you will understand when you need space. Someone who is love bombing you will treat it as a threat.',
      },
    ],
  },
  {
    id: 'pig-butchering',
    title: 'Pig Butchering: The Long-Game Scam',
    category: 'Financial Safety',
    categoryColor: Colors.teal.primary,
    sf: 'chart.line.uptrend.xyaxis',
    xp: 70,
    summary: 'A scam that starts as a romance and ends as a crypto investment disaster. One of the fastest-growing fraud types today.',
    steps: [
      {
        type: 'info',
        sf: 'clock.fill',
        heading: 'The name',
        body: '"Pig butchering" refers to fattening a pig before slaughter. The scammer patiently builds a relationship over weeks or months before extracting money — usually through a fake crypto investment platform. These are professional, organized operations.',
      },
      {
        type: 'info',
        sf: 'message.fill',
        heading: 'How it starts',
        body: 'Usually a "wrong number" text, a random match, or a LinkedIn connection. They\'re friendly, interesting, and patient — no immediate pitch. Weeks of genuine-feeling conversation build real connection before investments ever come up.',
      },
      {
        type: 'info',
        sf: 'chart.pie.fill',
        heading: 'The investment introduction',
        body: 'Eventually the scammer mentions they\'ve made money through crypto, often using a platform their "uncle" manages. They offer to show you how. Early investments show real returns — you can even withdraw small amounts to build confidence. The platform is fake. The returns are fabricated.',
      },
      {
        type: 'quiz',
        question: 'In a pig butchering scam, why does the victim usually receive real returns and withdrawals early on?',
        options: [
          'The platform is actually legitimate at first',
          'It\'s a mistake by the scammers',
          'To build confidence before the large harvest',
          'To comply with financial regulations',
        ],
        correct: 2,
        explanation: 'Allowing early withdrawals is deliberate. It proves the platform is "real," encourages the victim to invest more, and builds trust before the large extraction.',
      },
      {
        type: 'info',
        sf: 'xmark.circle.fill',
        heading: 'The harvest',
        body: 'Once significant funds are deposited, the platform shows a problem: a tax freeze, a "VIP upgrade" fee, a compliance hold. Every solution requires more money. Then the platform goes dark and the scammer disappears. Victims often lose their entire savings.',
      },
      {
        type: 'info',
        sf: 'heart.slash.fill',
        heading: 'Why it\'s so devastating',
        body: 'By the time the investment is pitched, there\'s genuine emotional connection. The victim isn\'t evaluating a cold pitch — they\'re trusting someone they care about. The financial and emotional loss together can be catastrophic.',
      },
      {
        type: 'quiz',
        question: 'You\'ve been talking to someone online for 3 months — it feels real. They mention their uncle\'s crypto platform and offer to help you invest. What should you do first?',
        options: [
          'Start with a small amount to test the platform',
          'Search for independent reviews of the platform name before doing anything',
          'Trust them — you\'ve built a real relationship',
          'Invest — all crypto is high risk but this is legitimate',
        ],
        correct: 1,
        explanation: 'Independent verification comes before any action. If you can\'t find the platform through a search, or find it only on sites that look suspicious, stop entirely.',
      },
      {
        type: 'quiz',
        question: 'Which is the most definitive red flag of a pig butchering scam?',
        options: [
          'The person is very attractive',
          'You\'re required to pay a fee to withdraw your own money',
          'They live in a different country',
          'They talk about money a lot',
        ],
        correct: 1,
        explanation: 'Legitimate platforms never require a fee to release your own funds. Any "withdrawal fee," "tax hold," or "VIP upgrade" required before you can access your money is fraud — always.',
      },
    ],
  },
  {
    id: 'verify-identity',
    title: 'How to Verify Someone Is Real',
    category: 'Identity Checks',
    categoryColor: Colors.teal.light,
    sf: 'person.badge.shield.checkmark.fill',
    xp: 50,
    summary: 'A practical toolkit for confirming someone\'s identity before you meet — without being accusatory about it.',
    steps: [
      {
        type: 'info',
        sf: 'magnifyingglass',
        heading: 'Why it matters',
        body: 'Someone can maintain a convincing false identity for months over text. A few simple checks — done naturally in conversation — can save you significant time, emotional energy, and potentially money.',
      },
      {
        type: 'info',
        sf: 'photo.fill',
        heading: 'Reverse image search',
        body: 'Save their profile photo and run it through Google Images. If it appears under a different name or on a stock photo site, that\'s definitive. If it appears nowhere at all, that\'s also worth noting — most real people have some online presence.',
      },
      {
        type: 'quiz',
        question: 'You reverse image search a profile photo and find it on a stock photo website under a different name. What does this mean?',
        options: [
          'They might use professional photos — fairly common',
          'They are definitively using a stolen or false photo',
          'Their photo was used without their permission',
          'This is normal for people who value privacy',
        ],
        correct: 1,
        explanation: 'A profile photo that appears on a stock image site under a different name is conclusive — the person is not who they claim to be. This is the clearest possible red flag.',
      },
      {
        type: 'info',
        sf: 'video.fill',
        heading: 'Live video call',
        body: 'Ask them to do something spontaneous on a live call — wave, hold up an object you name in the moment, show you their coffee. Pre-recorded videos and deepfakes cannot respond to real-time requests. Consistent avoidance of video calls is a serious warning sign.',
      },
      {
        type: 'info',
        sf: 'app.badge.fill',
        heading: 'Cross-reference social accounts',
        body: 'A real person has a consistent digital trail: LinkedIn matching their claimed profession, Instagram or Facebook with photos spanning multiple years and genuine interactions from real friends. Scammer accounts are often thin, suspiciously polished, or inconsistent across platforms.',
      },
      {
        type: 'quiz',
        question: 'After 8 weeks, someone has consistently rescheduled every video call, always citing technical problems. How should you interpret this?',
        options: [
          'They have genuinely bad internet — it happens',
          'They\'re camera-shy — some people are',
          'This is a significant red flag that should be addressed directly',
          'They probably just prefer voice calls',
        ],
        correct: 2,
        explanation: 'One or two reschedules is normal. A consistent pattern of excuses over 8 weeks is not a coincidence — it\'s the behavior of someone who cannot video call because they are not who they claim to be.',
      },
      {
        type: 'info',
        sf: 'questionmark.bubble.fill',
        heading: 'Ask verifiable questions naturally',
        body: 'If they claim to live in a specific city, ask casual questions about local neighborhoods, sports teams, or recent events. Someone who actually lives there answers naturally. Someone fabricating a persona either hedges or over-researches the details.',
      },
      {
        type: 'quiz',
        question: 'What\'s the most reliable method for verifying someone\'s real identity online?',
        options: [
          'Asking them directly and sincerely',
          'Checking how many followers they have',
          'A live, unscripted video call with a spontaneous request',
          'Extended text-based conversation over several weeks',
        ],
        correct: 2,
        explanation: 'Only a live, unscripted video call with something spontaneous (a physical action they couldn\'t have pre-recorded) can reliably confirm someone is who they claim to be.',
      },
    ],
  },
  {
    id: 'red-flags-chat',
    title: 'Red Flags in Conversation',
    category: 'Chat Patterns',
    categoryColor: Colors.indigo,
    sf: 'bubble.left.and.exclamationmark.bubble.right.fill',
    xp: 70,
    summary: 'What to watch for in messages — from subtle inconsistencies to clear manipulation tactics.',
    steps: [
      {
        type: 'info',
        sf: 'text.quote',
        heading: 'Scripted or templated feel',
        body: 'Scam operations use scripts. Messages may feel slightly off: overly formal, unusually poetic, or paced awkwardly. Compliments are generic ("you are so beautiful and kind") rather than specific to things you\'ve actually said. Responses sometimes don\'t quite address what you asked.',
      },
      {
        type: 'info',
        sf: 'arrow.triangle.2.circlepath',
        heading: 'Inconsistencies over time',
        body: 'Real people are consistent. Scammers managing multiple targets lose track of details. Pay close attention to: their age, job, where they grew up, family structure. If something contradicts an earlier conversation, note it and probe gently.',
      },
      {
        type: 'quiz',
        question: 'Someone mentions their hometown is Chicago — but three weeks ago they said they grew up in Seattle. What\'s the right move?',
        options: [
          'Ignore it — people make mistakes and misremember',
          'End contact immediately — it\'s obviously a scam',
          'Note it and bring it up naturally to see how they respond',
          'Ask all their mutual contacts about it',
        ],
        correct: 2,
        explanation: 'One inconsistency is worth noting and gently probing. A genuine person will have a simple explanation. Someone running a script will get defensive, deflect, or contradict themselves further.',
      },
      {
        type: 'info',
        sf: 'arrow.right.circle.fill',
        heading: 'Moving off-platform quickly',
        body: 'A push to move from a dating app to WhatsApp or Telegram very early is a red flag. Dating apps have fraud detection and moderation. Moving off-platform removes those protections — and the record of the conversation.',
      },
      {
        type: 'quiz',
        question: 'After just two days of chatting, someone asks to move your conversation to WhatsApp because "the app notifications are annoying." Is this a concern?',
        options: [
          'No — WhatsApp is more convenient for everyone',
          'It depends entirely on whether you like them',
          'Yes — moving off-platform this early is a common scam tactic',
          'Only if they\'ve said something else suspicious',
        ],
        correct: 2,
        explanation: 'Moving off-platform removes fraud detection and moderation. While some legitimate people prefer other apps, the combination of very early + strong push is a documented pattern in scam operations.',
      },
      {
        type: 'info',
        sf: 'bolt.fill',
        heading: 'Urgency and emotional pressure',
        body: 'Creating urgency bypasses rational evaluation. Watch for: artificial deadlines ("I need to know by tonight"), guilt ("I thought you trusted me"), sudden crises requiring immediate decisions, and pressure that escalates when you try to slow down.',
      },
      {
        type: 'info',
        sf: 'arrow.up.right.circle.fill',
        heading: 'The trajectory test',
        body: 'Step back and look at the overall arc. Is this person moving toward real-world connection — meeting, calls, shared activities? Or has the relationship stayed comfortably digital for months? Genuine connections naturally move toward reality. Scams stay in the space they can control.',
      },
      {
        type: 'quiz',
        question: 'After 3 months of daily messages, someone has given 5 different reasons why they can\'t video call and 4 reasons why meeting isn\'t possible yet. How should you read this?',
        options: [
          'They\'re genuinely very busy — life gets complicated',
          'They might be very shy or have social anxiety',
          'The pattern of excuses is itself a serious warning sign',
          'Long distance relationships are just difficult like this',
        ],
        correct: 2,
        explanation: 'Individual excuses can be legitimate. A sustained pattern of reasons why real-world connection is always blocked — over months — is the behavior of someone who cannot or will not meet because they are not who they claim to be.',
      },
      {
        type: 'quiz',
        question: 'Which message is most consistent with a scripted scam operation?',
        options: [
          '"Sorry late reply, been at my sister\'s birthday!"',
          '"Your smile is like sunshine and you have the most beautiful soul"',
          '"Ugh did you see that game last night??"',
          '"Can\'t talk rn, dealing with work drama lol"',
        ],
        correct: 1,
        explanation: 'Generic, poetic compliments that could apply to anyone are a hallmark of scripted messages. Genuine people reference specific things about you and sound like real, slightly imperfect humans.',
      },
    ],
  },
];
