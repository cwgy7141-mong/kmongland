// ============================================================
// Site Content Configuration — 텍스트/데이터 관리
// ============================================================
// 사이트에 표시되는 모든 텍스트를 여기서 수정할 수 있습니다.
// ============================================================

export const SITE_CONFIG = {
  // 브랜드
  brandName: 'k-mong-land',
  copyright: '© 2026 k-mong-land Academy. All rights reserved.',

  // 히어로 섹션
  hero: {
    titleLeft: ['Fluent', 'Korean'],
    titleRight: ['K-Pop', 'Culture'],
    watermark: 'KOREAN',
    description:
      'Master the Korean language with prestige. k-mong-land offers premium, immersive online Korean courses combining elite linguistic pedagogy and cultural depth, designed for global professionals and learners.',
  },

  // 시네마틱 텍스트 섹션
  cinematic: {
    text: 'Speak Korean with absolute confidence. Connect with K-Pop culture, master premium expressions, and transition from a beginner to a fluent communicator.',
    koText: '완벽한 자신감으로 한국어를 구사하세요. K-Pop 문화와 깊이 연결되고, 품격 있는 표현을 익히며 유창한 소통의 단계로 나아갑니다.',
  },

  // 성능 지표 섹션
  metrics: {
    subtitle: 'Global Demand & Growth',
    items: [
      { value: '550k+', label: 'Annual TOPIK Applicants' },
      { value: '256', label: 'Global Sejong Institutes' },
      { value: 'Top 10', label: 'Most Studied Languages' },
    ],
  },

  // 기술 섹션
  technology: {
    title: ['Elite', 'Linguistic Tech'],
    description:
      'Our platform integrates active speech feedback and cultural immersion strategies to make learning fast, intuitive, and long-lasting.',
    features: [
      {
        title: 'Interactive Speech Labs',
        desc: 'Practice real-life conversations with immediate, AI-powered pronunciation grading.',
      },
      {
        title: 'Cultural Immersive Media',
        desc: 'Learn from K-Drama transcripts, K-Pop lyrics, and corporate business scenarios.',
      },
      {
        title: 'Bilingual Mentorship Network',
        desc: 'Work with elite bilingual native speakers who understand your cultural transition.',
      },
    ],
  },

  // 무료 리소스 섹션
  resources: {
    title: 'Free Korean Resources',
    subtitle: 'Kickstart your learning today with our curated free materials.',
    cards: [
      {
        title: 'K-Pop Pronunciation Guide',
        desc: 'Learn the exact speech patterns of K-Pop artists with our syllable pronunciation breakdown sheets.',
        tag: 'PRONUNCIATION',
      },
      {
        title: 'Essential TOPIK Vocabulary List',
        desc: 'Top 500 must-know vocabulary words for TOPIK I & II exam success, curated by lead researchers.',
        tag: 'EXAM PREP',
      },
      {
        title: 'Business Korean Starter Kit',
        desc: 'Master basic honorifics (존댓말) and standard email structures for corporate environments.',
        tag: 'BUSINESS',
      },
    ],
  },

  footer: {
    logoLabel: 'k-mong-land',
    tagline: 'Premium Online Korean Academy',
    quickLinks: [
      { label: 'Tutors', scrollMultiplier: 1 },
      { label: 'Methodology', scrollMultiplier: 2 },
    ],
    downloadLabel: 'Enroll Now',
  },
};

export const TEACHERS = [
  {
    id: 'minji',
    name: 'Min-ji Kim (Jennie)',
    role: 'K-Pop Pronunciation & Modern Slang Specialist',
    bio: 'Former trainee language coach with 5+ years of experience helping global artists perfect their Korean pronunciation. Min-ji blends lyric analysis with active speech feedback.',
    background: 'YG Trainee Language Coach (2018-2022) | Certified Korean Language Teacher (Level 2)',
    tags: ['K-Pop Focus', 'Pronunciation', 'Slang & Idioms', 'Interactive'],
    roomId: 'KmongLandTeacherMinji',
    avatarBg: 'from-purple-500 to-pink-500',
    stats: { students: '1,200', rating: '4.9', hours: '850' },
    hourlyRate: 25,
    isNative: true,
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    reviews: [
      { id: '1', studentName: 'Ashley M.', rating: 5, text: 'Min-ji is absolutely wonderful! Her K-pop lyric exercises make learning pronunciation incredibly fun and natural.', date: '2026-06-15' },
      { id: '2', studentName: 'Carlos T.', rating: 4.8, text: 'Highly recommend if you want to sound like a native. She corrects micro-errors in pronunciation instantly.', date: '2026-06-10' }
    ],
    scheduleSlots: [
      { id: 'm1', day: 'Mon', time: '10:00', booked: false },
      { id: 'm2', day: 'Mon', time: '14:00', booked: false },
      { id: 'm3', day: 'Tue', time: '16:00', booked: false },
      { id: 'm4', day: 'Thu', time: '11:00', booked: false },
      { id: 'm5', day: 'Fri', time: '15:00', booked: false }
    ]
  },
  {
    id: 'joonseo',
    name: 'Joon-seo Park (Leo)',
    role: 'TOPIK Master & Academic Grammar Instructor',
    bio: 'Specializing in systematic grammar blueprints and TOPIK test preparation. Joon-seo helps students build a solid linguistic foundation to transit from intermediate to advanced levels.',
    background: 'Seoul National University (Korean Literature) | 6+ Years TOPIK Specialist',
    tags: ['TOPIK Prep', 'Grammar Master', 'Writing Audits', 'Structured'],
    roomId: 'KmongLandTeacherJoonseo',
    avatarBg: 'from-blue-500 to-indigo-600',
    stats: { students: '980', rating: '5.0', hours: '1,100' },
    hourlyRate: 30,
    isNative: true,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    reviews: [
      { id: '3', studentName: 'Emma R.', rating: 5, text: 'Joon-seo has a very structured method. I passed my TOPIK II level 4 thanks to his writing audits!', date: '2026-06-20' },
      { id: '4', studentName: 'Kenji Y.', rating: 5, text: 'Very precise grammar explanations. Perfect for serious academic learners.', date: '2026-06-18' }
    ],
    scheduleSlots: [
      { id: 'j1', day: 'Mon', time: '11:00', booked: false },
      { id: 'j2', day: 'Wed', time: '14:00', booked: false },
      { id: 'j3', day: 'Wed', time: '16:00', booked: false },
      { id: 'j4', day: 'Thu', time: '15:00', booked: false },
      { id: 'j5', day: 'Fri', time: '10:00', booked: false }
    ]
  },
  {
    id: 'sohee',
    name: 'So-hee Lee (Luna)',
    role: 'Business Korean & Corporate Etiquette Coach',
    bio: 'Learn formal honorifics, corporate speaking standards, and interview strategies. Perfect for international professionals looking to transition smoothly into the Korean business landscape.',
    background: 'Ex-Samsung HR Language Trainer | Ewha Womans University Graduate',
    tags: ['Business Korean', 'Honorifics', 'Interview Prep', 'Corporate'],
    roomId: 'KmongLandTeacherSohee',
    avatarBg: 'from-teal-400 to-emerald-600',
    stats: { students: '750', rating: '4.8', hours: '620' },
    hourlyRate: 35,
    isNative: true,
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    reviews: [
      { id: '5', studentName: 'Sarah K.', rating: 4.8, text: 'Luna is amazing for professional context. Her mock interviews helped me secure a job in Seoul!', date: '2026-06-25' },
      { id: '6', studentName: 'David L.', rating: 4.9, text: 'Excellent corporate language drills. Honorifics make sense to me now.', date: '2026-06-22' }
    ],
    scheduleSlots: [
      { id: 's1', day: 'Tue', time: '10:00', booked: false },
      { id: 's2', day: 'Tue', time: '14:00', booked: false },
      { id: 's3', day: 'Thu', time: '13:00', booked: false },
      { id: 's4', day: 'Thu', time: '16:00', booked: false },
      { id: 's5', day: 'Fri', time: '11:00', booked: false }
    ]
  },
  // Additional Tutors to Test Pagination (Total 12)
  {
    id: 'tutor_4',
    name: 'Ji-won Han',
    role: 'Conversational Fluency Specialist',
    bio: 'Speak Korean like a local. Focuses on daily colloquial expressions and drama script practices.',
    background: 'Yonsei University Korean Language Institute Graduate Specialist',
    tags: ['Slang & Idioms', 'Interactive'],
    roomId: 'TutorJiwon',
    avatarBg: 'from-orange-400 to-red-500',
    stats: { students: '420', rating: '4.7', hours: '310' },
    hourlyRate: 22,
    isNative: true,
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
    reviews: [{ id: 'r4', studentName: 'John D.', rating: 5, text: 'Super friendly and practical!', date: '2026-06-24' }],
    scheduleSlots: [
      { id: 't4_1', day: 'Sat', time: '10:00', booked: false },
      { id: 't4_2', day: 'Sun', time: '14:00', booked: false }
    ]
  },
  {
    id: 'tutor_5',
    name: 'Hyun-woo Kim',
    role: 'Pronunciation & Accent Specialist',
    bio: 'Helping foreign learners eliminate accent barriers with detailed phonetic corrections.',
    background: 'Sogang University Communication Master Graduate',
    tags: ['Pronunciation', 'Grammar Master'],
    roomId: 'TutorHyunwoo',
    avatarBg: 'from-pink-500 to-rose-600',
    stats: { students: '530', rating: '4.9', hours: '450' },
    hourlyRate: 26,
    isNative: true,
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
    reviews: [],
    scheduleSlots: [
      { id: 't5_1', day: 'Mon', time: '18:00', booked: false },
      { id: 't5_2', day: 'Wed', time: '20:00', booked: false }
    ]
  },
  {
    id: 'tutor_6',
    name: 'Su-jin Choi',
    role: 'TOPIK Grammar Coach',
    bio: 'Specialist for intermediate students aiming to achieve TOPIK Level 5 or 6.',
    background: 'Korea University Education Studies Graduate',
    tags: ['TOPIK Prep', 'Grammar Master'],
    roomId: 'TutorSujin',
    avatarBg: 'from-yellow-400 to-amber-600',
    stats: { students: '380', rating: '4.8', hours: '290' },
    hourlyRate: 28,
    isNative: true,
    imageUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=600',
    reviews: [],
    scheduleSlots: [
      { id: 't6_1', day: 'Tue', time: '15:00', booked: false },
      { id: 't6_2', day: 'Fri', time: '16:00', booked: false }
    ]
  },
  {
    id: 'tutor_7',
    name: 'Ye-rin Jung',
    role: 'K-Pop Culture & Slang Tutor',
    bio: 'Deep-dive into contemporary K-Pop lyrics, culture trends, and native slang.',
    background: 'Media & Cultural Studies Specialist, Sogang University',
    tags: ['K-Pop Focus', 'Slang & Idioms'],
    roomId: 'TutorYerin',
    avatarBg: 'from-indigo-400 to-cyan-500',
    stats: { students: '610', rating: '5.0', hours: '520' },
    hourlyRate: 24,
    isNative: true,
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
    reviews: [],
    scheduleSlots: [
      { id: 't7_1', day: 'Wed', time: '10:00', booked: false },
      { id: 't7_2', day: 'Sat', time: '14:00', booked: false }
    ]
  },
  {
    id: 'tutor_8',
    name: 'Alex Johnson',
    role: 'Bilingual Beginner Coach',
    bio: 'Dual native speaker providing comfortable foundational training for complete beginners.',
    background: 'Dual Degree Linguistics, UCLA & Yonsei University',
    tags: ['Grammar Master', 'Interactive'],
    roomId: 'TutorAlex',
    avatarBg: 'from-green-400 to-blue-500',
    stats: { students: '290', rating: '4.6', hours: '210' },
    hourlyRate: 20,
    isNative: false,
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600',
    reviews: [],
    scheduleSlots: [
      { id: 't8_1', day: 'Thu', time: '10:00', booked: false },
      { id: 't8_2', day: 'Fri', time: '14:00', booked: false }
    ]
  },
  {
    id: 'tutor_9',
    name: 'Eun-ji Shin',
    role: 'Writing & Academic Essay Mentor',
    bio: 'Enhance your written Korean skills. Weekly essays review, academic grammar correction.',
    background: 'Kyung Hee University Korean Language Teaching Graduate',
    tags: ['Writing Audits', 'Structured'],
    roomId: 'TutorEunji',
    avatarBg: 'from-red-400 to-pink-500',
    stats: { students: '320', rating: '4.8', hours: '270' },
    hourlyRate: 27,
    isNative: true,
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
    reviews: [],
    scheduleSlots: [
      { id: 't9_1', day: 'Sat', time: '13:00', booked: false },
      { id: 't9_2', day: 'Sun', time: '15:00', booked: false }
    ]
  },
  {
    id: 'tutor_10',
    name: 'Dong-hyun Lee',
    role: 'Corporate Business Coach',
    bio: 'Perfecting business etiquette, report writing, and job interview skills in Korean.',
    background: 'Ex-Hyundai Corporate Global Strategy Trainer',
    tags: ['Business Korean', 'Honorifics'],
    roomId: 'TutorDonghyun',
    avatarBg: 'from-gray-700 to-slate-900',
    stats: { students: '490', rating: '4.9', hours: '390' },
    hourlyRate: 33,
    isNative: true,
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
    reviews: [],
    scheduleSlots: [
      { id: 't10_1', day: 'Tue', time: '19:00', booked: false },
      { id: 't10_2', day: 'Thu', time: '20:00', booked: false }
    ]
  },
  {
    id: 'tutor_11',
    name: 'Hye-jin Song',
    role: 'Casual Speaking Partner',
    bio: 'Improve speaking confidence in real-world contexts. Warm and casual conversation coach.',
    background: 'Ewha Womans University Sociology Graduate Specialist',
    tags: ['Interactive', 'Slang & Idioms'],
    roomId: 'TutorHyejin',
    avatarBg: 'from-fuchsia-400 to-purple-600',
    stats: { students: '650', rating: '4.9', hours: '580' },
    hourlyRate: 23,
    isNative: true,
    imageUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=600',
    reviews: [],
    scheduleSlots: [
      { id: 't11_1', day: 'Mon', time: '16:00', booked: false },
      { id: 't11_2', day: 'Wed', time: '11:00', booked: false }
    ]
  },
  {
    id: 'tutor_12',
    name: 'David Carter',
    role: 'Bilingual Cultural Guide',
    bio: 'Guiding English-speaking learners through basic structure and everyday speaking patterns.',
    background: 'Bilingual Instructor, 4 Years in Seoul Global Centers',
    tags: ['Interactive', 'Pronunciation'],
    roomId: 'TutorDavid',
    avatarBg: 'from-sky-400 to-blue-600',
    stats: { students: '180', rating: '4.5', hours: '120' },
    hourlyRate: 21,
    isNative: false,
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
    reviews: [],
    scheduleSlots: [
      { id: 't12_1', day: 'Sat', time: '16:00', booked: false },
      { id: 't12_2', day: 'Sun', time: '17:00', booked: false }
    ]
  }
];
