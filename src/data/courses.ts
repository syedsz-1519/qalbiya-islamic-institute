import { Course } from '../types';

export const COURSES: Course[] = [
  {
    id: 'pre-diploma-deeniyat',
    title: 'Pre-Diploma in Deeniyat',
    category: 'women',
    flagship: true,
    duration: '6 months',
    schedule: 'Group or Personal (1-on-1) — your choice',
    instructor: 'Ms. Mustara, Founder of QALBIYA Islamic Institute',
    description: 'Your complete foundation in Deen.',
    longDescription: 'This is QALBIYA Islamic Institute\'s most complete beginner-to-strong-foundation course — built for the woman who wants to stop learning her deen in scattered pieces and finally learn it as one connected whole. A structured, six-month journey covering everything from correcting your recitation to understanding your beliefs — so you don\'t just follow Islam, you understand it, live it, and feel closer to Allah.',
    outline: [
      'Makhraj (correct pronunciation points)',
      'Basic Tajweed',
      'Hifz-e-Hadith',
      'Daily Duas & Sunnah',
      'Aqaid (core beliefs)',
      'Akhlaq',
      'Namaz & Masail',
      'Asma-ul-Husna'
    ],
    benefits: [
      '📚 Notes provided for key topics, plus your own notes for personal reflection and retention',
      '🧠 Weekly quizzes to reinforce your learning',
      '🗓️ Monthly test at the end of every month to track your progress',
      '📝 Final exam at the end of the course',
      '💬 WhatsApp support outside class hours for questions and guidance',
      '🎓 Certificate on completion'
    ],
    imagePrompt: 'A highly sophisticated editorial layout showing an open Quran with subtle lighting, gold ink calligraphic accents, and a warm cream minimalist background',
    bgGradient: 'from-amber-50 to-orange-100/50 text-amber-900 border-amber-200'
  },
  {
    id: 'tajweed-1on1',
    title: 'Tajweed 1:1 Classes',
    category: 'women',
    flagship: false,
    duration: '5 months',
    schedule: '3 Classes per week (Flexible)',
    instructor: 'Ms. Mustara, Founder of QALBIYA Islamic Institute',
    description: 'Every ayah, focused solely on you.',
    longDescription: 'From Makharij to Sifaat — the complete rules of Tajweed, taught in depth. This isn\'t surface-level correction; it\'s a full, structured mastery of how the Qur\'an is meant to be recited.',
    outline: [
      'Correct Makharij – Points of articulation of letters',
      'Sifaat – Characteristics of letters',
      'Complete Tajweed rules – Basic to advanced rules of recitation',
      'Ongoing correction – Addressing your personal recitation and recurring mistakes'
    ],
    benefits: [
      '📄 Notes/PDFs for every lesson',
      '📝 Personal mistake-tracking list (so you can see your own progress clearly)',
      '💬 WhatsApp support outside class hours — including daily practice via voice messages and homework',
      '🎓 Certificate on completion'
    ],
    imagePrompt: 'An elegant composition showing beautiful Arabic script on fine parchment paper with a warm focus, ivory and soft gold tones',
    bgGradient: 'from-emerald-50 to-teal-100/50 text-emerald-900 border-emerald-200',
    isNew: true
  },
  {
    id: 'noorani-qaida-women',
    title: 'Noorani Qaida Course',
    category: 'women',
    flagship: false,
    duration: '2 months',
    schedule: 'Tue & Thu, 4:00 PM - 5:00 PM',
    instructor: 'Ustadha Maryam Amin',
    description: 'Where your Qur\'an journey begins.',
    longDescription: 'Noorani Qaida is the time-tested framework to learn to read Arabic script. This class is designed with utmost gentleness and patience for women who have never read Arabic before, or who feel unconfident in their word-formation. We start from the single alphabet letters, build up to joined letters, vowels, and final words, ensuring solid phonetic grounding.',
    outline: [
      'The Arabic Alphabet and Pronunciation',
      'Compound Letters and Letter Connections',
      'The Vowels (Harakat) and Lengthening rules',
      'Sukoon, Shaddah, and Maddah rules',
      'Connecting words and reading continuous Quranic phrases'
    ],
    benefits: [
      'Very gentle and slow-paced learning ideal for beginners',
      'Small class size to guarantee every student gets to read live',
      'Practical homework sheets and daily recorded sound bytes for review',
      'Zero prior knowledge of Arabic required'
    ],
    imagePrompt: 'A flatlay showing clean wooden desks, elegant journals, ink pens, and light beige textiles under soft natural morning sunlight',
    bgGradient: 'from-blue-50 to-indigo-100/50 text-blue-900 border-blue-200'
  },
  {
    id: 'seerah-prophet',
    title: 'Seerah of Prophet صلى الله عليه وسلم Course',
    category: 'women',
    flagship: false,
    duration: '2 months',
    schedule: 'Saturdays, 11:00 AM - 12:30 PM',
    instructor: 'Dr. Zainab Siddiqui',
    description: 'Let his character reshape yours.',
    longDescription: 'The Seerah course is an intellectual and spiritual journey through the life of the Prophet Muhammad ﷺ. Rather than just memorizing dates and battles, we analyze his leadership, his dealing with grief and persecution, his beautiful family life, and his absolute reliance on Allah. This course provides direct, actionable wisdom to face contemporary personal and societal challenges.',
    outline: [
      'The Arabian Peninsula before Islam and the Prophet’s early life',
      'The Dawn of Revelation and the early companion circle',
      'The Meccan period: perseverance, boycott, and migration',
      'The Medina period: building a community of justice and love',
      'The Prophetic character: how he loved, pardoned, and led'
    ],
    benefits: [
      'Focuses on modern practical applications of the Seerah',
      'Reflective journaling exercises to build a personal connection',
      'Exclusive reading list and companion study guides',
      'Interactive group discussions on contemporary lessons'
    ],
    imagePrompt: 'An atmospheric watercolor painting of a starry night sky over desert sand dunes under a silver crescent moon, in deep slate and gold accents',
    bgGradient: 'from-purple-50 to-fuchsia-100/50 text-purple-900 border-purple-200',
    isNew: true
  },
  {
    id: 'juniors-deeniyat-mastercourse',
    title: 'Juniors Deeniyat Mastercourse',
    category: 'kids',
    flagship: true,
    duration: '1.5–2 years',
    schedule: '',
    instructor: '',
    description: 'A complete Islamic foundation, built to last a lifetime.',
    longDescription: 'The Juniors Deeniyat Mastercourse is QALBIYA Islamic Institute’s flagship children’s course. Utilizing modern gamified learning, engaging stories, hands-on craft projects, and visual slides, we teach the essentials of Islamic faith, character, prayers, and history in a language kids love. We focus on building a positive Muslim identity and showing the beauty of faith.',
    outline: [
      'My Creator: Understanding Allah through His beautiful names',
      'The Heroes of Islam: Stories of the Prophets and Companions',
      'My Daily Sunnahs: Eating, sleeping, greeting, and beautiful manners',
      'Interactive Salah Academy: Step-by-step Wudu and prayer with meaning',
      'Character Shield (Akhlaq): Honesty, kindness to parents, and sharing'
    ],
    benefits: [
      'Gamified quiz system and dynamic, interactive visual slides',
      'Printable activity sheets, coloring books, and craft templates',
      'Term-based progress reports and celebration certificates',
      'Warm, friendly instructors trained in child pedagogy'
    ],
    imagePrompt: 'A whimsical and modern illustration of children sitting under a giant, magical star-shaped tree reading an open, colorful book, painted in soft pastel colors',
    bgGradient: 'from-pink-50 to-rose-100/50 text-pink-900 border-pink-200'
  },
  {
    id: 'noorani-qaida-kids',
    title: 'Noorani Qaida (Kids\')',
    category: 'kids',
    flagship: false,
    duration: '4–5 months',
    schedule: 'Mon, Wed & Fri, 5:00 PM - 5:45 PM',
    instructor: 'Ustadha Aisha Bilal',
    description: 'The first step to reading Qur\'an.',
    longDescription: 'Learning to read should be an adventure! Our Kids Noorani Qaida course utilizes phonetic rhymes, visual color coding, and gentle encouraging recitation games to guide little ones through the foundation of Arabic reading. We maintain short, high-energy classes to hold children’s attention and keep them excited to learn.',
    outline: [
      'Arabic Alphabet recognition using interactive story characters',
      'Correct articulation (Makhraj) through fun sound-matching games',
      'Connecting letter shapes (Beginning, Middle, and End forms)',
      'Mastering short vowels (Fathah, Kasrah, Dammah) with rhythm',
      'Graduating to reading short Quranic words and simple verses'
    ],
    benefits: [
      'Short 45-minute classes perfectly optimized for child attention spans',
      'Encouraging reward systems, digital stickers, and interactive badges',
      'Extremely small groups (maximum 8 kids) to ensure active live reading',
      'Parent dashboard to track and listen to recitations'
    ],
    imagePrompt: 'A vibrant illustration of colorful geometric alphabet blocks in soft warm light, with playful hand-drawn elements on a warm cream canvas',
    bgGradient: 'from-orange-50 to-amber-100/50 text-orange-900 border-orange-200'
  },
  {
    id: 'tarbiyah-tazkiyah',
    title: 'Tarbiyah Tazkiyah: Spiritual Purification',
    category: 'women',
    flagship: false,
    duration: 'Self-Paced (Complementary)',
    schedule: 'On-Demand (Spiritual Audio Vault)',
    instructor: 'Ms. Mustara, Founder of QALBIYA Islamic Institute',
    description: 'A beautiful complementary course providing structured insights into spiritual discipline, mindfulness in prayers, sincere actions, and curing the ailments of the heart.',
    longDescription: 'Tazkiyah is the sacred Islamic process of purification of the soul. Under the guidance of our respected founder, Ms. Mustara, this complementary course provides structured insights into spiritual discipline, mindfulness in prayers, sincere actions, and curing the ailments of the heart. Gain access to the Spiritual Audio Vault, reflection exercises, and practical journals to cultivate muraqabah and prophetic ethics.',
    outline: [
      'Introduction to Tazkiyah (Purification of the Soul)',
      'Sincerity (Ikhlas) and the Secrets of the Heart',
      'Developing Khushu\' (Humility & Presence) in Prayer',
      'Self-awareness (Muraqabah) and Time Guarding',
      'Overcoming spiritual laziness & cultivating prophetic manners'
    ],
    benefits: [
      '🎧 Instant access to Ms. Mustara\'s spiritual audio vault lectures',
      '📝 Reflective journaling templates to track emotional and spiritual growth',
      '✨ Completely free and complementary audit with zero tuition fees',
      '💬 Access to supportive student forums for community reflections'
    ],
    imagePrompt: 'An aesthetic minimal composition of white lilies, an open journal with fine lines, and warm soft light reflecting a tranquil morning atmosphere',
    bgGradient: 'from-emerald-50 to-emerald-100/30 text-emerald-950 border-emerald-200',
    isFree: true
  },
  {
    id: 'arabic-calligraphy',
    title: 'Classical Arabic Calligraphy',
    category: 'women',
    flagship: false,
    duration: 'Self-Paced (Complementary)',
    schedule: 'On-Demand (Step-by-Step Video Audits)',
    instructor: 'Ustadha Maryam Amin',
    description: 'Learn the sacred Thuluth and Naskh scripts, brush strokes, and classical Arabic calligraphy step-by-step.',
    longDescription: 'Calligraphy is the visual translation of divine words. In this complementary self-paced course, learn the proportions, slant, and measurement guidelines (Nuqat) of classical Thuluth and Naskh scripts, and discover how to write and trace sacred passages with peace and mindfulness.',
    outline: [
      'Mastering the Reed Pen (Qalam) & Ink (Hibr) preparation',
      'The Alif and Basic Proportions in Thuluth Script using Nuqat',
      'Letter connections and compound word formations',
      'Symmetrical layout designs for sacred Quranic verses'
    ],
    benefits: [
      '✏️ Downloadable tracing sheets and classical grids',
      '🎥 Step-by-step visual strokes and ink-loading tutorials',
      '🎨 Learn ink preparation using raw silk fibers (Liqah)',
      '✨ Fully free self-paced curriculum'
    ],
    imagePrompt: 'Close up of a wooden reed pen tracing elegant Arabic calligraphy letters on cream paper with gold ink accents and soft focus',
    bgGradient: 'from-amber-50 to-amber-100/30 text-amber-950 border-amber-200',
    isFree: true
  }
];
