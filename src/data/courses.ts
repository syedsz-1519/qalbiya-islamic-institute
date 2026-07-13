import { Course } from '../types';

export const COURSES: Course[] = [
  {
    id: 'pre-diploma-deeniyat',
    title: 'Pre-Diploma in Deeniyat',
    category: 'women',
    flagship: true,
    duration: '1 Year',
    schedule: 'Mon & Wed, 10:00 AM - 11:30 AM',
    instructor: 'Ustadha Fatima Al-Hassan',
    description: 'A comprehensive, systematic foundation in Islamic sciences. This structured program is designed for women seeking to build deep, authentic knowledge of their faith.',
    longDescription: 'The Pre-Diploma in Deeniyat is a premier academic and spiritual program designed specifically for adult women. Over the course of one year, we study the absolute essentials of Islamic creed, practical jurisprudence (Fiqh), the historical context of the Seerah, and spiritual purification (Akhlaq). It provides a structured, supportive environment that fits the demanding schedule of modern life while holding high academic standards.',
    outline: [
      'Aqeedah (Islamic Creed) – Core beliefs and understanding Tawheed',
      'Fiqh of Worship (Taharah, Salah, Sawm, and Zakah)',
      'Seerah (The Prophet’s Life) – Foundations of the prophetic era',
      'Tazkiyah & Akhlaq – Islamic ethics, mindfulness, and purification of the heart',
      'Daily Duas & Hadith – Selected studies of prophetic traditions'
    ],
    benefits: [
      'A structured, semester-based curriculum with assessments',
      'Live interactive Q&A sessions with qualified scholars',
      'Comprehensive study materials and recorded lecture access',
      'An inspiring community of fellow female students'
    ],
    imagePrompt: 'A highly sophisticated editorial layout showing an open Quran with subtle lighting, gold ink calligraphic accents, and a warm cream minimalist background',
    bgGradient: 'from-amber-50 to-orange-100/50 text-amber-900 border-amber-200'
  },
  {
    id: 'tajweed-1on1',
    title: 'Tajweed 1:1 Mentorship',
    category: 'women',
    flagship: false,
    duration: 'Ongoing (Monthly)',
    schedule: 'Flexible (Scheduled individually with your mentor)',
    instructor: 'Ustadha Sarah Mansoor',
    description: 'Personalized, one-on-one sessions with certified Reciters. Perfect for refining your articulation (Makharij) and reading fluency at your own pace.',
    longDescription: 'Our Tajweed 1:1 Mentorship offers a completely custom learning path. Whether you are correcting basic letter sounds or preparing to read with perfect fluency, your dedicated female instructor will provide instant feedback, customized practice goals, and an encouraging environment to beautify your recitation of the Quran.',
    outline: [
      'Makharij al-Huroof (Articulation points of letters)',
      'Sifaat al-Huroof (Characteristics of letters)',
      'Rules of Nun Sakinah and Tanween',
      'Rules of Mim Sakinah and Mudood (Lengthening)',
      'Guided application of rules through selective chapters of the Quran'
    ],
    benefits: [
      '100% personalized attention and individual feedback',
      'Flexible scheduling to fit work, study, or family commitments',
      'Clear tracking of your progress from letter-by-letter to fluent reading',
      'Conducted entirely online in secure, private video classrooms'
    ],
    imagePrompt: 'An elegant composition showing beautiful Arabic script on fine parchment paper with a warm focus, ivory and soft gold tones',
    bgGradient: 'from-emerald-50 to-teal-100/50 text-emerald-900 border-emerald-200',
    isNew: true
  },
  {
    id: 'noorani-qaida-women',
    title: 'Noorani Qaida for Women',
    category: 'women',
    flagship: false,
    duration: '12 Weeks',
    schedule: 'Tue & Thu, 4:00 PM - 5:00 PM',
    instructor: 'Ustadha Maryam Amin',
    description: 'The foundational gate to reading the Quran. Designed for absolute beginners or those wishing to rebuild their reading foundation from the roots up.',
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
    title: 'Seerah of the Prophet ﷺ',
    category: 'women',
    flagship: false,
    duration: '16 Weeks',
    schedule: 'Saturdays, 11:00 AM - 12:30 PM',
    instructor: 'Dr. Zainab Siddiqui',
    description: 'An immersive, heart-centered exploration of the Prophetic life. Learn his character, trials, and wisdom to find peace in your modern life.',
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
      'Interactive cohort discussions on contemporary lessons'
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
    duration: '1 Year (Ages 7-12)',
    schedule: 'Saturdays & Sundays, 10:00 AM - 11:00 AM',
    instructor: 'Ustadha Fatima Al-Hassan & Team',
    description: 'An engaging, fun, and highly interactive program designed to instil an enduring love for Allah, the Prophet ﷺ, and Islamic values in young hearts.',
    longDescription: 'The Juniors Deeniyat Mastercourse is Qalbiya’s flagship children’s program. Utilizing modern gamified learning, engaging stories, hands-on craft projects, and visual slides, we teach the essentials of Islamic faith, character, prayers, and history in a language kids love. We focus on building a positive Muslim identity and showing the beauty of faith.',
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
    title: 'Noorani Qaida for Kids',
    category: 'kids',
    flagship: false,
    duration: '16 Weeks (Ages 5-10)',
    schedule: 'Mon, Wed & Fri, 5:00 PM - 5:45 PM',
    instructor: 'Ustadha Aisha Bilal',
    description: 'A rhythmic, engaging, and guided path to help children master Arabic letter recognition and build a lifelong love for reading the Quran.',
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
      'Extremely small cohorts (maximum 8 kids) to ensure active live reading',
      'Parent dashboard to track and listen to recitations'
    ],
    imagePrompt: 'A vibrant illustration of colorful geometric alphabet blocks in soft warm light, with playful hand-drawn elements on a warm cream canvas',
    bgGradient: 'from-orange-50 to-amber-100/50 text-orange-900 border-orange-200'
  }
];
