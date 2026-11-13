import type {
  AppNotification,
  BoardId,
  Chapter,
  LiveClassSession,
  PyqPaper,
  StudyTask,
  SubjectId,
  TestSeries
} from '../types/education';

export const BOARDS: {
  id: BoardId;
  nameEn: string;
  nameHi: string;
  patternNoteEn: string;
  patternNoteHi: string;
}[] = [
  {
    id: 'CBSE',
    nameEn: 'CBSE Board',
    nameHi: 'सीबीएसई बोर्ड',
    patternNoteEn: 'NCERT 2026-27 · 50% Competency & Case-Based + 20 MCQs',
    patternNoteHi: 'NCERT 2026-27 · 50% दक्षता-आधारित व केस-स्टडी + 20 MCQ'
  },
  {
    id: 'BIHAR',
    nameEn: 'Bihar Board (BSEB)',
    nameHi: 'बिहार बोर्ड (BSEB)',
    patternNoteEn: 'BSEB Matric 2026-27 · 100 Objective Options (Attempt 50)',
    patternNoteHi: 'BSEB मैट्रिक 2026-27 · 100 वस्तुनिष्ठ प्रश्न (50 हल करें)'
  },
  {
    id: 'UP',
    nameEn: 'UP Board (UPMSP)',
    nameHi: 'यूपी बोर्ड (UPMSP)',
    patternNoteEn: 'UPMSP 2026-27 · 20 OMR Objective + 50 Marks Descriptive',
    patternNoteHi: 'UPMSP 2026-27 · 20 OMR वस्तुनिष्ठ + 50 अंक वर्णनात्मक'
  },
  {
    id: 'MP',
    nameEn: 'MP Board (MPBSE)',
    nameHi: 'एमपी बोर्ड (MPBSE)',
    patternNoteEn: 'MPBSE Blueprint 2026-27 · 30 Objective + Analytical Questions',
    patternNoteHi: 'MPBSE ब्लूप्रिंट 2026-27 · 30 वस्तुनिष्ठ + विश्लेषणात्मक प्रश्न'
  },
  {
    id: 'ICSE',
    nameEn: 'ICSE Board (CISCE)',
    nameHi: 'आईसीएसई बोर्ड (CISCE)',
    patternNoteEn: 'CISCE 2026-27 · Section A Compulsory + Section B Analytical',
    patternNoteHi: 'CISCE 2026-27 · खंड A अनिवार्य + खंड B विश्लेषणात्मक'
  }
];

export const SUBJECTS: {
  id: SubjectId;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  image?: string;
}[] = [
  {
    id: 'MATH',
    titleEn: 'Mathematics',
    titleHi: 'गणित',
    subtitleEn: 'Real Numbers, Quadratics, Trigonometry, Circles',
    subtitleHi: 'वास्तविक संख्याएँ, द्विघात समीकरण, त्रिकोणमिति, वृत्त',
    image: '/src/assets/images/subject_mathematics_geometry_1794561103077.jpg'
  },
  {
    id: 'SCIENCE',
    titleEn: 'Science',
    titleHi: 'विज्ञान',
    subtitleEn: 'Chemical Reactions, Life Processes, Optics, Electricity',
    subtitleHi: 'रासायनिक अभिक्रियाएँ, जैव प्रक्रम, प्रकाशिकी, विद्युत',
    image: '/src/assets/images/subject_science_lab_1794561103275.jpg'
  },
  {
    id: 'SST',
    titleEn: 'Social Science',
    titleHi: 'सामाजिक विज्ञान',
    subtitleEn: 'History, Geography, Political Science, Economics',
    subtitleHi: 'इतिहास, भूगोल, राजनीति विज्ञान, अर्थशास्त्र',
    image: '/src/assets/images/subject_social_history_1794561104026.jpg'
  },
  {
    id: 'HINDI',
    titleEn: 'Hindi',
    titleHi: 'हिन्दी',
    subtitleEn: 'Kshitij, Kritika, Godhuli, Grammar & Essay',
    subtitleHi: 'क्षितिज, कृतिका, गोधूलि, व्याकरण एवं निबंध'
  },
  {
    id: 'ENGLISH',
    titleEn: 'English',
    titleHi: 'अंग्रेज़ी',
    subtitleEn: 'First Flight, Footprints, Grammar & Comprehension',
    subtitleHi: 'फर्स्ट फ्लाइट, फुटप्रिंट्स, ग्रामर एवं अपठित गद्यांश'
  },
  {
    id: 'SANSKRIT',
    titleEn: 'Sanskrit',
    titleHi: 'संस्कृत',
    subtitleEn: 'Shemushi, Piyusham, Sandhi, Samas & Translation',
    subtitleHi: 'शेमुषी, पीयूषम्, संधि, समास एवं अनुवाद'
  }
];

const SAMPLE_VIDEO_1 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
const SAMPLE_VIDEO_2 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';

interface ChapterSeed {
  subject: SubjectId;
  chapterNumber: number;
  titleEn: string;
  titleHi: string;
  summaryEn: string;
  summaryHi: string;
  keyFormulas: string[];
  isPremium: boolean;
  videoDurationMin: number;
  icseTitleEn?: string;
  icseTitleHi?: string;
  biharTitleEn?: string;
  biharTitleHi?: string;
  importantQuestionsEn: string[];
  importantQuestionsHi: string[];
  mcqs: Chapter['mcqs'];
  shortAnswers: Chapter['shortAnswers'];
  longAnswers: Chapter['longAnswers'];
}

const CORE_CHAPTER_SEEDS: ChapterSeed[] = [
  {
    subject: 'MATH',
    chapterNumber: 1,
    titleEn: 'Real Numbers',
    titleHi: 'वास्तविक संख्याएँ',
    icseTitleEn: 'GST & Commercial Arithmetic',
    icseTitleHi: 'जीएसटी एवं वाणिज्यिक अंकगणित',
    summaryEn:
      'Covers the Fundamental Theorem of Arithmetic, prime factorisation to determine HCF and LCM, the relation HCF(a,b) × LCM(a,b) = a × b, and formal contradiction proofs for irrationality of √2, √3, and √5.',
    summaryHi:
      'अंकगणित की आधारभूत प्रमेय, अभाज्य गुणनखंड द्वारा HCF और LCM ज्ञात करना, संबंध HCF(a,b) × LCM(a,b) = a × b तथा √2, √3 व √5 की अपरिमेयता सिद्ध करना शामिल है।',
    keyFormulas: [
      'HCF(a, b) × LCM(a, b) = a × b',
      'Composite Number = Product of Primes (unique up to order)',
      'If p divides a², then p divides a (where p is prime)'
    ],
    isPremium: false,
    videoDurationMin: 28,
    importantQuestionsEn: [
      'Prove that √5 is an irrational number.',
      'Find the HCF and LCM of 96 and 404 by prime factorisation method.',
      'Explain why 7 × 11 × 13 + 13 is a composite number.'
    ],
    importantQuestionsHi: [
      'सिद्ध कीजिए कि √5 एक अपरिमेय संख्या है।',
      'अभाज्य गुणनखंड विधि से 96 और 404 का HCF और LCM ज्ञात कीजिए।',
      'व्याख्या कीजिए कि 7 × 11 × 13 + 13 एक भाज्य संख्या क्यों है।'
    ],
    mcqs: [
      {
        id: 'm1_q1',
        questionEn: 'If HCF(26, 91) = 13, what is LCM(26, 91)?',
        questionHi: 'यदि HCF(26, 91) = 13 है, तो LCM(26, 91) क्या होगा?',
        optionsEn: ['182', '169', '236', '91'],
        optionsHi: ['182', '169', '236', '91'],
        correctIndex: 0,
        explanationEn: 'HCF × LCM = 26 × 91 => 13 × LCM = 2366 => LCM = 182.',
        explanationHi: 'HCF × LCM = 26 × 91 => 13 × LCM = 2366 => LCM = 182.',
        topicTag: 'HCF & LCM'
      },
      {
        id: 'm1_q2',
        questionEn: 'What is the exponent of 2 in the prime factorisation of 144?',
        questionHi: '144 के अभाज्य गुणनखंड में 2 की घात क्या है?',
        optionsEn: ['2', '3', '4', '6'],
        optionsHi: ['2', '3', '4', '6'],
        correctIndex: 2,
        explanationEn: '144 = 16 × 9 = 2⁴ × 3², so the exponent of 2 is 4.',
        explanationHi: '144 = 16 × 9 = 2⁴ × 3², अतः 2 की घात 4 है।',
        topicTag: 'Prime Factorisation'
      }
    ],
    shortAnswers: [
      {
        id: 'm1_sa1',
        questionEn: 'Check whether 6ⁿ can end with the digit 0 for any natural number n.',
        questionHi: 'जाँच कीजिए कि क्या किसी प्राकृत संख्या n के लिए 6ⁿ अंक 0 पर समाप्त हो सकता है।',
        answerEn:
          'If 6ⁿ ends with 0, it must be divisible by 5. However, 6ⁿ = (2 × 3)ⁿ contains only primes 2 and 3. By uniqueness of the Fundamental Theorem of Arithmetic, 5 is not a factor, so 6ⁿ never ends with 0.',
        answerHi:
          'यदि 6ⁿ अंक 0 पर समाप्त होता, तो वह 5 से विभाज्य होता। परंतु 6ⁿ = (2 × 3)ⁿ में केवल 2 और 3 अभाज्य गुणनखंड हैं। अतः 6ⁿ कभी 0 पर समाप्त नहीं हो सकता।',
        marks: 2
      }
    ],
    longAnswers: [
      {
        id: 'm1_la1',
        questionEn: 'Prove that 3 + 2√5 is irrational.',
        questionHi: 'सिद्ध कीजिए कि 3 + 2√5 एक अपरिमेय संख्या है।',
        answerEn:
          'Assume 3 + 2√5 = a/b where a, b are coprime integers (b ≠ 0). Rearranging gives √5 = (a - 3b) / 2b. Since a and b are integers, (a - 3b) / 2b is rational, implying √5 is rational, which contradicts the known fact that √5 is irrational. Therefore, 3 + 2√5 is irrational.',
        answerHi:
          'माना 3 + 2√5 = a/b जहाँ a, b सह-अभाज्य पूर्णांक हैं (b ≠ 0)। इससे √5 = (a - 3b)/2b प्राप्त होता है, जो एक परिमेय संख्या है। यह इस तथ्य का विरोधाभास है कि √5 अपरिमेय है। अतः 3 + 2√5 अपरिमेय है।',
        marks: 5
      }
    ]
  },
  {
    subject: 'MATH',
    chapterNumber: 2,
    titleEn: 'Quadratic Equations',
    titleHi: 'द्विघात समीकरण',
    summaryEn:
      'Standard form ax² + bx + c = 0 (a ≠ 0), finding roots by factorisation and the Quadratic Formula, and analysing nature of roots using the discriminant D = b² - 4ac.',
    summaryHi:
      'मानक रूप ax² + bx + c = 0 (a ≠ 0), गुणनखंड एवं द्विघाती सूत्र द्वारा मूल ज्ञात करना तथा विविक्तकर D = b² - 4ac से मूलों की प्रकृति समझना।',
    keyFormulas: [
      'x = (-b ± √(b² - 4ac)) / 2a',
      'D = b² - 4ac',
      'D > 0: two distinct real roots · D = 0: two equal roots · D < 0: no real roots'
    ],
    isPremium: false,
    videoDurationMin: 34,
    importantQuestionsEn: [
      'Find the value of k for which 2x² + kx + 3 = 0 has two equal real roots.',
      'Solve x² - 3x - 10 = 0 by factorisation.'
    ],
    importantQuestionsHi: [
      'k का मान ज्ञात कीजिए जिसके लिए 2x² + kx + 3 = 0 के दो बराबर वास्तविक मूल हों।',
      'गुणनखंड विधि से x² - 3x - 10 = 0 को हल कीजिए।'
    ],
    mcqs: [
      {
        id: 'm2_q1',
        questionEn: 'What is the discriminant of 2x² - 4x + 3 = 0?',
        questionHi: 'समीकरण 2x² - 4x + 3 = 0 का विविक्तकर (D) क्या है?',
        optionsEn: ['-8', '8', '40', '0'],
        optionsHi: ['-8', '8', '40', '0'],
        correctIndex: 0,
        explanationEn: 'D = (-4)² - 4(2)(3) = 16 - 24 = -8 (no real roots).',
        explanationHi: 'D = (-4)² - 4(2)(3) = 16 - 24 = -8 (कोई वास्तविक मूल नहीं)।',
        topicTag: 'Discriminant & Roots'
      }
    ],
    shortAnswers: [
      {
        id: 'm2_sa1',
        questionEn: 'Find two consecutive positive integers whose squares sum to 365.',
        questionHi: 'दो क्रमागत धनात्मक पूर्णांक ज्ञात कीजिए जिनके वर्गों का योग 365 हो।',
        answerEn: 'Let integers be x and x+1. x² + (x+1)² = 365 => 2x² + 2x - 364 = 0 => x² + x - 182 = 0 => (x+14)(x-13)=0 => x = 13. Integers are 13 and 14.',
        answerHi: 'माना पूर्णांक x व x+1 हैं। x² + (x+1)² = 365 => x² + x - 182 = 0 => x = 13। अतः पूर्णांक 13 और 14 हैं।',
        marks: 3
      }
    ],
    longAnswers: []
  },
  {
    subject: 'MATH',
    chapterNumber: 3,
    titleEn: 'Introduction to Trigonometry',
    titleHi: 'त्रिकोणमिति का परिचय',
    summaryEn:
      'Trigonometric ratios of acute angles in a right triangle, standard values at 0°, 30°, 45°, 60°, 90°, and fundamental identities including sin²θ + cos²θ = 1.',
    summaryHi:
      'समकोण त्रिभुज में न्यूनकोणों के त्रिकोणमितीय अनुपात, 0°, 30°, 45°, 60°, 90° के मान तथा सर्वसमिका sin²θ + cos²θ = 1 का अनुप्रयोग।',
    keyFormulas: [
      'sin²θ + cos²θ = 1',
      '1 + tan²θ = sec²θ',
      '1 + cot²θ = cosec²θ'
    ],
    isPremium: true,
    videoDurationMin: 40,
    importantQuestionsEn: [
      'If sin A = 3/4, calculate cos A and tan A.',
      'Prove that (sin θ - 2sin³θ) / (2cos³θ - cos θ) = tan θ.'
    ],
    importantQuestionsHi: [
      'यदि sin A = 3/4 हो, तो cos A और tan A का मान ज्ञात कीजिए।',
      'सिद्ध कीजिए कि (sin θ - 2sin³θ) / (2cos³θ - cos θ) = tan θ.'
    ],
    mcqs: [
      {
        id: 'm3_q1',
        questionEn: 'The value of (1 - tan²45°) / (1 + tan²45°) is:',
        questionHi: '(1 - tan²45°) / (1 + tan²45°) का मान है:',
        optionsEn: ['tan 90°', '1', 'sin 45°', '0'],
        optionsHi: ['tan 90°', '1', 'sin 45°', '0'],
        correctIndex: 3,
        explanationEn: 'Since tan 45° = 1, (1 - 1) / (1 + 1) = 0 / 2 = 0.',
        explanationHi: 'चूँकि tan 45° = 1, (1 - 1) / (1 + 1) = 0 / 2 = 0.',
        topicTag: 'Trigonometric Ratios'
      }
    ],
    shortAnswers: [],
    longAnswers: []
  },
  {
    subject: 'SCIENCE',
    chapterNumber: 1,
    titleEn: 'Chemical Reactions and Equations',
    titleHi: 'रासायनिक अभिक्रियाएँ एवं समीकरण',
    summaryEn:
      'Balancing chemical equations via law of conservation of mass, types of reactions (combination, decomposition, displacement, double displacement, redox), corrosion, and rancidity.',
    summaryHi:
      'द्रव्यमान संरक्षण के नियम से समीकरण संतुलित करना, अभिक्रियाओं के प्रकार (संयोजन, वियोजन, विस्थापन, द्विविस्थापन, रेडॉक्स), संक्षारण एवं विकृतगंधिता।',
    keyFormulas: [
      '2Mg + O₂ → 2MgO',
      'CaCO₃ (heat) → CaO + CO₂',
      'Fe + CuSO₄ → FeSO₄ + Cu'
    ],
    isPremium: false,
    videoDurationMin: 31,
    importantQuestionsEn: [
      'Why should a magnesium ribbon be cleaned before burning in air?',
      'What is a balanced chemical equation and why must chemical equations be balanced?'
    ],
    importantQuestionsHi: [
      'वायु में जलाने से पहले मैग्नीशियम रिबन को साफ क्यों किया जाता है?',
      'संतुलित रासायनिक समीकरण क्या है और इसे संतुलित करना क्यों आवश्यक है?'
    ],
    mcqs: [
      {
        id: 's1_q1',
        questionEn: 'Fe₂O₃ + 2Al → Al₂O₃ + 2Fe is an example of which reaction?',
        questionHi: 'Fe₂O₃ + 2Al → Al₂O₃ + 2Fe किस प्रकार की अभिक्रिया का उदाहरण है?',
        optionsEn: [
          'Combination reaction',
          'Double displacement reaction',
          'Decomposition reaction',
          'Displacement reaction'
        ],
        optionsHi: [
          'संयोजन अभिक्रिया',
          'द्विविस्थापन अभिक्रिया',
          'वियोजन अभिक्रिया',
          'विस्थापन अभिक्रिया'
        ],
        correctIndex: 3,
        explanationEn: 'More reactive Aluminium displaces Iron from Iron(III) oxide.',
        explanationHi: 'अधिक अभिक्रियाशील एल्युमिनियम, आयरन ऑक्साइड से आयरन को विस्थापित करता है।',
        topicTag: 'Types of Chemical Reactions'
      }
    ],
    shortAnswers: [
      {
        id: 's1_sa1',
        questionEn: 'Why is respiration considered an exothermic reaction?',
        questionHi: 'श्वसन को ऊष्माक्षेपी अभिक्रिया क्यों कहते हैं?',
        answerEn:
          'During respiration, glucose combines with oxygen in cells to release energy along with carbon dioxide and water: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy.',
        answerHi:
          'श्वसन के दौरान कोशिकाओं में ग्लूकोज़ ऑक्सीजन से संयोग कर ऊर्जा मुक्त करता है, इसलिए यह ऊष्माक्षेपी अभिक्रिया है।',
        marks: 2
      }
    ],
    longAnswers: [
      {
        id: 's1_la1',
        questionEn: 'Explain Oxidation and Reduction (Redox) with a balanced equation.',
        questionHi: 'उपचयन तथा अपचयन (रेडॉक्स) अभिक्रिया को उदाहरण सहित समझाइए।',
        answerEn:
          'Gain of oxygen or loss of hydrogen is oxidation; loss of oxygen or gain of hydrogen is reduction. In CuO + H₂ → Cu + H₂O, CuO is reduced to Cu while H₂ is oxidised to H₂O.',
        answerHi:
          'ऑक्सीजन की वृद्धि उपचयन और ऑक्सीजन का ह्रास अपचयन है। CuO + H₂ → Cu + H₂O में CuO का Cu में अपचयन और H₂ का H₂O में उपचयन होता है।',
        marks: 5
      }
    ]
  },
  {
    subject: 'SCIENCE',
    chapterNumber: 2,
    titleEn: 'Light — Reflection and Refraction',
    titleHi: 'प्रकाश — परावर्तन तथा अपवर्तन',
    summaryEn:
      'Laws of reflection, image formation by spherical mirrors, mirror formula 1/v + 1/u = 1/f, Snell’s law of refraction, refractive index, convex/concave lens formula, and power in dioptres.',
    summaryHi:
      'परावर्तन के नियम, गोलीय दर्पणों द्वारा प्रतिबिंब, दर्पण सूत्र 1/v + 1/u = 1/f, स्नेल का अपवर्तन नियम, लेंस सूत्र तथा लेंस की क्षमता (डाइऑप्टर)।',
    keyFormulas: [
      '1/f = 1/v + 1/u (Mirror) · m = -v/u',
      '1/f = 1/v - 1/u (Lens) · m = v/u',
      'Power P = 1 / f(in metres) Dioptre'
    ],
    isPremium: false,
    videoDurationMin: 36,
    importantQuestionsEn: [
      'Define 1 Dioptre of power of a lens.',
      'Draw ray diagram when an object is placed between F and 2F of a convex lens.'
    ],
    importantQuestionsHi: [
      'लेंस की 1 डाइऑप्टर क्षमता को परिभाषित कीजिए।',
      'उत्तल लेंस में जब वस्तु F और 2F के बीच हो, तो किरण आरेख बनाइए।'
    ],
    mcqs: [
      {
        id: 's2_q1',
        questionEn: 'Which mirror is used as a rear-view mirror in vehicles?',
        questionHi: 'वाहनों में पश्च-दृश्य दर्पण के रूप में किस दर्पण का उपयोग होता है?',
        optionsEn: ['Concave mirror', 'Convex mirror', 'Plane mirror', 'Parabolic mirror'],
        optionsHi: ['अवतल दर्पण', 'उत्तल दर्पण', 'समतल दर्पण', 'परवलयिक दर्पण'],
        correctIndex: 1,
        explanationEn: 'A convex mirror always forms an erect, diminished image with a wider field of view.',
        explanationHi: 'उत्तल दर्पण सदैव सीधा, छोटा प्रतिबिंब और विस्तृत दृष्टि क्षेत्र प्रदान करता है।',
        topicTag: 'Spherical Mirrors'
      }
    ],
    shortAnswers: [],
    longAnswers: []
  },
  {
    subject: 'SCIENCE',
    chapterNumber: 3,
    titleEn: 'Electricity & Ohm’s Law',
    titleHi: 'विद्युत एवं ओम का नियम',
    summaryEn:
      'Electric current, potential difference, Ohm’s law V = IR, resistivity, series and parallel combinations of resistors, Joule’s heating law H = I²Rt, and electric power.',
    summaryHi:
      'विद्युत धारा, विभवांतर, ओम का नियम V = IR, प्रतिरोधकता, श्रेणी एवं पार्श्वक्रम संयोजन, जूल का तापन नियम H = I²Rt तथा विद्युत शक्ति।',
    keyFormulas: [
      'V = I × R',
      'R_series = R₁ + R₂ · 1/R_parallel = 1/R₁ + 1/R₂',
      'P = V × I = I²R · H = I²Rt'
    ],
    isPremium: true,
    videoDurationMin: 38,
    importantQuestionsEn: ['State Ohm’s Law and draw V-I graph.', 'Why are household circuits connected in parallel?'],
    importantQuestionsHi: ['ओम का नियम लिखिए और V-I ग्राफ बनाइए।', 'घरेलू विद्युत परिपथ पार्श्वक्रम में क्यों जोड़े जाते हैं?'],
    mcqs: [
      {
        id: 's3_q1',
        questionEn: 'What is the SI unit of electrical resistivity?',
        questionHi: 'विद्युत प्रतिरोधकता का SI मात्रक क्या है?',
        optionsEn: ['Ohm', 'Ohm-metre', 'Volt', 'Watt'],
        optionsHi: ['ओम', 'ओम-मीटर', 'वोल्ट', 'वाट'],
        correctIndex: 1,
        explanationEn: 'Resistivity ρ = R·A / l has units (Ω · m²) / m = Ω·m.',
        explanationHi: 'प्रतिरोधकता ρ = R·A / l का मात्रक ओम-मीटर (Ω·m) है।',
        topicTag: 'Ohm Law & Resistivity'
      }
    ],
    shortAnswers: [],
    longAnswers: []
  },
  {
    subject: 'SST',
    chapterNumber: 1,
    titleEn: 'Nationalism in India',
    titleHi: 'भारत में राष्ट्रवाद',
    summaryEn:
      'Impact of World War I, Satyagraha movements (Champaran, Kheda, Ahmedabad), Non-Cooperation Movement, Salt March & Civil Disobedience, and sense of collective belonging.',
    summaryHi:
      'प्रथम विश्व युद्ध का प्रभाव, सत्याग्रह आंदोलन (चंपारण, खेड़ा, अहमदाबाद), असहयोग आंदोलन, दांडी मार्च व सविनय अवज्ञा आंदोलन तथा सामूहिक अपनेपन का भाव।',
    keyFormulas: [
      '1917: Champaran Satyagraha',
      '1920-22: Non-Cooperation Movement',
      '1930: Dandi Salt March & Civil Disobedience'
    ],
    isPremium: false,
    videoDurationMin: 29,
    importantQuestionsEn: [
      'Why did Gandhiji decide to withdraw the Non-Cooperation Movement in 1922?',
      'Explain the significance of the Salt March.'
    ],
    importantQuestionsHi: [
      'गाँधीजी ने 1922 में असहयोग आंदोलन वापस लेने का निर्णय क्यों लिया?',
      'नमक यात्रा (दांडी मार्च) के महत्व को स्पष्ट कीजिए।'
    ],
    mcqs: [
      {
        id: 'sst1_q1',
        questionEn: 'In which year did Mahatma Gandhi lead the Salt March to Dandi?',
        questionHi: 'महात्मा गाँधी ने दांडी के लिए नमक यात्रा किस वर्ष प्रारंभ की?',
        optionsEn: ['1920', '1927', '1930', '1942'],
        optionsHi: ['1920', '1927', '1930', '1942'],
        correctIndex: 2,
        explanationEn: 'Gandhiji started the 240-mile Dandi March on 12 March 1930.',
        explanationHi: 'गाँधीजी ने 12 मार्च 1930 को दांडी मार्च प्रारंभ किया।',
        topicTag: 'Nationalism in India'
      }
    ],
    shortAnswers: [],
    longAnswers: []
  },
  {
    subject: 'SST',
    chapterNumber: 2,
    titleEn: 'Power Sharing & Federalism',
    titleHi: 'सत्ता की साझेदारी एवं संघवाद',
    summaryEn:
      'Case studies of Belgium and Sri Lanka, horizontal vs vertical power sharing, Union/State/Concurrent lists, and linguistic states & decentralisation in India.',
    summaryHi:
      'बेल्जियम व श्रीलंका के उदाहरण, क्षैतिज एवं ऊर्ध्वाधर सत्ता वितरण, संघ/राज्य/समवर्ती सूचियाँ तथा भारत में विकेंद्रीकरण।',
    keyFormulas: [
      'Horizontal: Legislature · Executive · Judiciary',
      'Vertical: Union · State · Local Panchayati Raj'
    ],
    isPremium: false,
    videoDurationMin: 24,
    importantQuestionsEn: ['Differentiate between horizontal and vertical power sharing.'],
    importantQuestionsHi: ['सत्ता के क्षैतिज और ऊर्ध्वाधर वितरण में अंतर स्पष्ट कीजिए।'],
    mcqs: [],
    shortAnswers: [],
    longAnswers: []
  },
  {
    subject: 'HINDI',
    chapterNumber: 1,
    titleEn: 'Surdas ke Pad & Ram-Lakshman Samvad',
    titleHi: 'सूरदास के पद एवं राम-लक्ष्मण-परशुराम संवाद',
    biharTitleEn: 'Shram Vibhajan aur Jati Pratha (Godhuli)',
    biharTitleHi: 'श्रम विभाजन और जाति प्रथा (गोधूलि)',
    summaryEn:
      'Bhramargeet verses by Surdas expressing Gopiyon ka Prem, alongside Tulsidas’s Ramcharitmanas excerpt and board grammar (Ras, Alankar, Vachya).',
    summaryHi:
      'सूरदास के भ्रमरगीत के चार पद, गोपियों की विरह-व्यथा तथा व्याकरण में रस, अलंकार व वाच्य का विस्तृत विश्लेषण।',
    keyFormulas: ['रस · अलंकार · वाच्य परिवर्तन · पद-परिचय'],
    isPremium: false,
    videoDurationMin: 22,
    importantQuestionsEn: ['Explain why the Gopis compared Uddhav to a lotus leaf in water.'],
    importantQuestionsHi: ['गोपियों ने उद्धव को भाग्यवान क्यों कहा है? व्यंग्य स्पष्ट कीजिए।'],
    mcqs: [
      {
        id: 'h1_q1',
        questionEn: 'Who composed the Bhramargeet verses included in Class 10 Hindi?',
        questionHi: 'कक्षा 10 हिन्दी में संकलित भ्रमरगीत के पदों के रचयिता कौन हैं?',
        optionsEn: ['Tulsidas', 'Surdas', 'Kabir', 'Jaishankar Prasad'],
        optionsHi: ['तुलसीदास', 'सूरदास', 'कबीर', 'जयशंकर प्रसाद'],
        correctIndex: 1,
        explanationEn: 'Surdas composed Sur-Sagar from which Bhramargeet verses are taken.',
        explanationHi: 'सूरदास के सूरसागर के भ्रमरगीत प्रसंग से ये पद लिए गए हैं।',
        topicTag: 'Hindi Literature'
      }
    ],
    shortAnswers: [],
    longAnswers: []
  },
  {
    subject: 'ENGLISH',
    chapterNumber: 1,
    titleEn: 'A Letter to God & Nelson Mandela',
    titleHi: 'अ लेटर टू गॉड एवं नेल्सन मंडेला',
    summaryEn:
      'Lencho’s unwavering faith in G.L. Fuentes’s story, irony at the post office, plus Nelson Mandela’s Long Walk to Freedom and Tenses/Modals grammar.',
    summaryHi:
      'लेंचो की अटूट आस्था, पोस्ट ऑफिस का व्यंग्यात्मक प्रसंग, नेल्सन मंडेला का संघर्ष तथा टेंस व मॉडल्स ग्रामर अभ्यास।',
    keyFormulas: ['Theme: Faith & Irony', 'Grammar: Reported Speech · Modals · Determiners'],
    isPremium: false,
    videoDurationMin: 25,
    importantQuestionsEn: ['Why did Lencho call the post office employees a bunch of crooks?'],
    importantQuestionsHi: ['लेंचो ने डाकघर के कर्मचारियों को बेईमानों का समूह क्यों कहा?'],
    mcqs: [
      {
        id: 'e1_q1',
        questionEn: 'How much money did Lencho ask for in his letter to God?',
        questionHi: 'लेंचो ने ईश्वर को लिखे पत्र में कितने पेसो की मांग की थी?',
        optionsEn: ['50 pesos', '70 pesos', '100 pesos', '120 pesos'],
        optionsHi: ['50 पेसो', '70 पेसो', '100 पेसो', '120 पेसो'],
        correctIndex: 2,
        explanationEn: 'Lencho asked God for 100 pesos to sow his field again and live until the harvest.',
        explanationHi: 'लेंचो ने फसल दोबारा बोने के लिए 100 पेसो की मांग की थी।',
        topicTag: 'English Prose'
      }
    ],
    shortAnswers: [],
    longAnswers: []
  },
  {
    subject: 'SANSKRIT',
    chapterNumber: 1,
    titleEn: 'Shuchiparyavaranam & Buddhibalavati Sada',
    titleHi: 'शुचिपर्यावरणम् एवं बुद्धिर्बलवती सदा',
    biharTitleEn: 'Mangalam (Piyusham Bhag-2)',
    biharTitleHi: 'मंगलम् (पीयूषम् भाग-2)',
    summaryEn:
      'Environmental harmony verses from Haridatta Sharma’s Lasallatika, Sandhi (Swar, Vyanjan, Visarga), Samas, and Sanskrit letter/translation practice.',
    summaryHi:
      'हरिदत्त शर्मा द्वारा रचित पर्यावरण शुद्धि पर आधारित पाठ, स्वर/व्यंजन/विसर्ग संधि, समास तथा संस्कृत अनुवाद अभ्यास।',
    keyFormulas: ['दीर्घ · गुण · वृद्धि · यण् संधि', 'तत्पुरुष · द्विगु · द्वन्द्व समास'],
    isPremium: false,
    videoDurationMin: 20,
    importantQuestionsEn: ['Write the Sandhi-Vichhed of पर्यावरणम् and दुर्वहम्.'],
    importantQuestionsHi: ['पर्यावरणम् और दुर्वहम् का संधि-विच्छेद लिखिए।'],
    mcqs: [
      {
        id: 'sk1_q1',
        questionEn: 'What is the correct Sandhi-Vichhed of पर्यावरणम्?',
        questionHi: 'पर्यावरणम् का सही संधि-विच्छेद क्या है?',
        optionsEn: ['परि + आवरणम्', 'पर + आवरणम्', 'पया + वरणम्', 'पर्या + वरणम्'],
        optionsHi: ['परि + आवरणम्', 'पर + आवरणम्', 'पया + वरणम्', 'पर्या + वरणम्'],
        correctIndex: 0,
        explanationEn: 'इ + आ = या (यण् संधि): परि + आवरणम् = पर्यावरणम्।',
        explanationHi: 'इ + आ = या (यण् संधि) से परि + आवरणम् = पर्यावरणम् बनता है।',
        topicTag: 'Sanskrit Sandhi'
      }
    ],
    shortAnswers: [],
    longAnswers: []
  }
];

export function buildBoardChapters(): Chapter[] {
  const result: Chapter[] = [];
  BOARDS.forEach((board) => {
    CORE_CHAPTER_SEEDS.forEach((seed, idx) => {
      const titleEn =
        board.id === 'ICSE' && seed.icseTitleEn
          ? seed.icseTitleEn
          : board.id === 'BIHAR' && seed.biharTitleEn
            ? seed.biharTitleEn
            : seed.titleEn;
      const titleHi =
        board.id === 'ICSE' && seed.icseTitleHi
          ? seed.icseTitleHi
          : board.id === 'BIHAR' && seed.biharTitleHi
            ? seed.biharTitleHi
            : seed.titleHi;

      result.push({
        id: `${board.id.toLowerCase()}_${seed.subject.toLowerCase()}_ch${seed.chapterNumber}`,
        board: board.id,
        subject: seed.subject,
        chapterNumber: seed.chapterNumber,
        titleEn,
        titleHi,
        summaryEn: `${seed.summaryEn} Aligned with ${board.nameEn} Class 10 (2026-27).`,
        summaryHi: `${seed.summaryHi} (${board.nameHi} कक्षा 10 पाठ्यक्रम 2026-27 के अनुसार)।`,
        keyFormulas: seed.keyFormulas,
        isPremium: seed.isPremium,
        videoTitleEn: `Ch ${seed.chapterNumber}: ${titleEn} — Complete Concept & Board Questions`,
        videoTitleHi: `अध्याय ${seed.chapterNumber}: ${titleHi} — संपूर्ण व्याख्या व बोर्ड प्रश्न`,
        videoUrl: idx % 2 === 0 ? SAMPLE_VIDEO_1 : SAMPLE_VIDEO_2,
        videoDurationMin: seed.videoDurationMin,
        videoTopics: [
          { timeLabel: '00:00', seconds: 0, titleEn: 'Core Introduction', titleHi: 'मूल परिचय' },
          { timeLabel: '08:30', seconds: 510, titleEn: 'Formulas & Theorems', titleHi: 'सूत्र एवं प्रमेय' },
          { timeLabel: '18:00', seconds: 1080, titleEn: 'Board Exam Solved Questions', titleHi: 'बोर्ड परीक्षा हल प्रश्न' }
        ],
        pdfTitleEn: `${board.id}_Class10_${titleEn.replace(/\s+/g, '_')}_Notes.pdf`,
        pdfTitleHi: `${board.id}_कक्षा10_${titleHi}_नोट्स.pdf`,
        importantQuestionsEn: seed.importantQuestionsEn,
        importantQuestionsHi: seed.importantQuestionsHi,
        mcqs: seed.mcqs,
        shortAnswers: seed.shortAnswers,
        longAnswers: seed.longAnswers
      });
    });
  });
  return result;
}

export const INITIAL_CHAPTERS: Chapter[] = buildBoardChapters();

export const INITIAL_TESTS: TestSeries[] = [
  {
    id: 'test_chapter_math_1',
    board: 'CBSE',
    category: 'CHAPTER',
    subject: 'MATH',
    titleEn: 'Real Numbers — Chapter Mastery Test',
    titleHi: 'वास्तविक संख्याएँ — अध्याय टेस्ट',
    durationMinutes: 10,
    isPremium: false,
    questions: [
      {
        id: 'tc_1',
        questionEn: 'If HCF(26, 91) = 13, find LCM(26, 91).',
        questionHi: 'यदि HCF(26, 91) = 13 हो, तो LCM(26, 91) ज्ञात करें।',
        optionsEn: ['182', '169', '236', '91'],
        optionsHi: ['182', '169', '236', '91'],
        correctIndex: 0,
        explanationEn: 'Product of two numbers = HCF × LCM => 26 × 91 = 13 × LCM => LCM = 182.',
        explanationHi: 'दोनों संख्याओं का गुणनफल = HCF × LCM => 26 × 91 = 13 × LCM => LCM = 182.',
        topicTag: 'HCF & LCM'
      },
      {
        id: 'tc_2',
        questionEn: 'Which of the following is an irrational number?',
        questionHi: 'निम्नलिखित में से कौन एक अपरिमेय संख्या है?',
        optionsEn: ['√16', '22/7', '√5', '0.375'],
        optionsHi: ['√16', '22/7', '√5', '0.375'],
        correctIndex: 2,
        explanationEn: '5 is not a perfect square, so √5 cannot be expressed as p/q.',
        explanationHi: '5 पूर्ण वर्ग नहीं है, इसलिए √5 एक अपरिमेय संख्या है।',
        topicTag: 'Irrational Numbers'
      },
      {
        id: 'tc_3',
        questionEn: 'The prime factorisation of 156 is:',
        questionHi: '156 का अभाज्य गुणनखंड है:',
        optionsEn: ['2² × 3 × 13', '2 × 3² × 13', '2² × 3² × 7', '2 × 3 × 19'],
        optionsHi: ['2² × 3 × 13', '2 × 3² × 13', '2² × 3² × 7', '2 × 3 × 19'],
        correctIndex: 0,
        explanationEn: '156 = 4 × 3 × 13 = 2² × 3 × 13.',
        explanationHi: '156 = 4 × 3 × 13 = 2² × 3 × 13.',
        topicTag: 'Prime Factorisation'
      }
    ]
  },
  {
    id: 'test_subject_science',
    board: 'CBSE',
    category: 'SUBJECT',
    subject: 'SCIENCE',
    titleEn: 'Science — Physics & Chemistry Combined Test',
    titleHi: 'विज्ञान — भौतिकी एवं रसायन संयुक्त टेस्ट',
    durationMinutes: 15,
    isPremium: false,
    questions: [
      {
        id: 'ts_1',
        questionEn: 'Which mirror is used by dentists to see an enlarged image of teeth?',
        questionHi: 'दंत चिकित्सक दाँतों का बड़ा प्रतिबिंब देखने के लिए किस दर्पण का उपयोग करते हैं?',
        optionsEn: ['Convex mirror', 'Concave mirror', 'Plane mirror', 'Cylindrical mirror'],
        optionsHi: ['उत्तल दर्पण', 'अवतल दर्पण', 'समतल दर्पण', 'बेलनाकार दर्पण'],
        correctIndex: 1,
        explanationEn: 'When the tooth is within the focus of a concave mirror, a virtual, erect, and magnified image is formed.',
        explanationHi: 'फोकस के भीतर रखने पर अवतल दर्पण सीधा और बड़ा प्रतिबिंब बनाता है।',
        topicTag: 'Spherical Mirrors'
      },
      {
        id: 'ts_2',
        questionEn: 'What is the pH of pure water at 25°C?',
        questionHi: '25°C पर शुद्ध जल का pH मान कितना होता है?',
        optionsEn: ['0', '5', '7', '14'],
        optionsHi: ['0', '5', '7', '14'],
        correctIndex: 2,
        explanationEn: 'Pure water is neutral with pH = 7.',
        explanationHi: 'शुद्ध जल उदासीन होता है, जिसका pH = 7 होता है।',
        topicTag: 'Acids Bases & Salts'
      },
      {
        id: 'ts_3',
        questionEn: 'Explain why copper cannot displace zinc from zinc sulphate solution (Descriptive check).',
        questionHi: 'स्पष्ट कीजिए कि कॉपर, जिंक सल्फेट विलयन से जिंक को विस्थापित क्यों नहीं कर सकता?',
        optionsEn: [
          'Copper is less reactive than Zinc in the reactivity series',
          'Copper is more reactive than Zinc',
          'Zinc is a non-metal',
          'Reaction requires sunlight'
        ],
        optionsHi: [
          'सक्रियता श्रेणी में कॉपर, जिंक से कम अभिक्रियाशील है',
          'कॉपर, जिंक से अधिक अभिक्रियाशील है',
          'जिंक अधातु है',
          'अभिक्रिया के लिए सूर्य के प्रकाश की आवश्यकता है'
        ],
        correctIndex: 0,
        explanationEn: 'In the metal reactivity series, Zn lies above Cu, so Cu cannot displace Zn.',
        explanationHi: 'सक्रियता श्रेणी में जिंक, कॉपर से ऊपर स्थित है।',
        topicTag: 'Types of Chemical Reactions',
        questionType: 'DESCRIPTIVE',
        modelAnswerEn: 'Because copper is placed below zinc in the reactivity series and is less reactive than zinc.',
        modelAnswerHi: 'क्योंकि सक्रियता श्रेणी में कॉपर, जिंक से नीचे है और कम अभिक्रियाशील है।'
      }
    ]
  },
  {
    id: 'test_weekly_all',
    board: 'BIHAR',
    category: 'WEEKLY',
    subject: 'ALL',
    titleEn: 'Weekly Scholarship Sprint — Maths & Science',
    titleHi: 'साप्ताहिक स्कॉलरशिप स्प्रिंट — गणित एवं विज्ञान',
    durationMinutes: 15,
    isPremium: false,
    questions: [
      {
        id: 'tw_1',
        questionEn: 'What is the discriminant of 2x² - 4x + 3 = 0?',
        questionHi: '2x² - 4x + 3 = 0 का विविक्तकर क्या है?',
        optionsEn: ['-8', '8', '4', '16'],
        optionsHi: ['-8', '8', '4', '16'],
        correctIndex: 0,
        explanationEn: 'D = (-4)² - 4(2)(3) = 16 - 24 = -8.',
        explanationHi: 'D = (-4)² - 4(2)(3) = 16 - 24 = -8.',
        topicTag: 'Discriminant & Roots'
      },
      {
        id: 'tw_2',
        questionEn: 'SI unit of electric power is:',
        questionHi: 'विद्युत शक्ति का SI मात्रक है:',
        optionsEn: ['Volt', 'Ampere', 'Watt', 'Joule'],
        optionsHi: ['वोल्ट', 'एम्पियर', 'वाट', 'जूल'],
        correctIndex: 2,
        explanationEn: 'Power = Work/Time = Joule/sec = Watt.',
        explanationHi: 'विद्युत शक्ति का SI मात्रक वाट (Watt) है।',
        topicTag: 'Ohm Law & Resistivity'
      }
    ]
  },
  {
    id: 'test_monthly_up',
    board: 'UP',
    category: 'MONTHLY',
    subject: 'ALL',
    titleEn: 'Monthly OMR Assessment — 2026-27 Pattern',
    titleHi: 'मासिक OMR मूल्यांकन — 2026-27 पैटर्न',
    durationMinutes: 20,
    isPremium: true,
    questions: [
      {
        id: 'tm_1',
        questionEn: 'Who led the Champaran Satyagraha in 1917?',
        questionHi: '1917 में चंपारण सत्याग्रह का नेतृत्व किसने किया?',
        optionsEn: ['Subhas Chandra Bose', 'Mahatma Gandhi', 'Jawaharlal Nehru', 'Sardar Patel'],
        optionsHi: ['सुभाष चंद्र बोस', 'महात्मा गाँधी', 'जवाहरलाल नेहरू', 'सरदार पटेल'],
        correctIndex: 1,
        explanationEn: 'Mahatma Gandhi led the indigo farmers of Champaran in 1917.',
        explanationHi: '1917 में महात्मा गाँधी ने चंपारण के नील किसानों के लिए सत्याग्रह किया।',
        topicTag: 'Nationalism in India'
      },
      {
        id: 'tm_2',
        questionEn: 'sin²30° + cos²30° equals:',
        questionHi: 'sin²30° + cos²30° का मान बराबर है:',
        optionsEn: ['0', '1/2', '1', '√3/2'],
        optionsHi: ['0', '1/2', '1', '√3/2'],
        correctIndex: 2,
        explanationEn: 'By fundamental identity, sin²θ + cos²θ = 1 for all θ.',
        explanationHi: 'त्रिकोणमितीय सर्वसमिका के अनुसार sin²θ + cos²θ = 1 होता है।',
        topicTag: 'Trigonometric Ratios'
      }
    ]
  },
  {
    id: 'test_full_syllabus',
    board: 'CBSE',
    category: 'FULL',
    subject: 'ALL',
    titleEn: 'Full Syllabus Grand Test — Class 10 All Subjects',
    titleHi: 'पूर्ण पाठ्यक्रम ग्रैंड टेस्ट — कक्षा 10 सभी विषय',
    durationMinutes: 30,
    isPremium: true,
    questions: [
      {
        id: 'tf_1',
        questionEn: 'What is the correct Sandhi-Vichhed of पर्यावरणम्?',
        questionHi: 'पर्यावरणम् का सही संधि-विच्छेद है:',
        optionsEn: ['परि + आवरणम्', 'पर + आवरणम्', 'पया + वरणम्', 'पर्या + आवरणम्'],
        optionsHi: ['परि + आवरणम्', 'पर + आवरणम्', 'पया + वरणम्', 'पर्या + आवरणम्'],
        correctIndex: 0,
        explanationEn: 'यण् संधि: इ + आ = या => परि + आवरणम्।',
        explanationHi: 'यण् संधि: इ + आ = या => परि + आवरणम्।',
        topicTag: 'Sanskrit Sandhi'
      },
      {
        id: 'tf_2',
        questionEn: 'Power of a convex lens of focal length +50 cm is:',
        questionHi: '+50 सेमी फोकस दूरी वाले उत्तल लेंस की क्षमता होगी:',
        optionsEn: ['+0.5 D', '+2.0 D', '-2.0 D', '+5.0 D'],
        optionsHi: ['+0.5 D', '+2.0 D', '-2.0 D', '+5.0 D'],
        correctIndex: 1,
        explanationEn: 'f = +0.5 m => P = 1 / 0.5 = +2.0 D.',
        explanationHi: 'f = +0.5 m => P = 1 / 0.5 = +2.0 D.',
        topicTag: 'Spherical Mirrors'
      }
    ]
  },
  {
    id: 'test_board_mock',
    board: 'CBSE',
    category: 'BOARD_MOCK',
    subject: 'ALL',
    titleEn: 'Board Exam 2026-27 Official Mock Paper 1',
    titleHi: 'बोर्ड परीक्षा 2026-27 आधिकारिक मॉडल पेपर 1',
    durationMinutes: 45,
    isPremium: false,
    questions: [
      {
        id: 'bm_1',
        questionEn: 'A polynomial of degree 2 is called a:',
        questionHi: 'घात 2 के बहुपद को क्या कहते हैं?',
        optionsEn: ['Linear polynomial', 'Quadratic polynomial', 'Cubic polynomial', 'Zero polynomial'],
        optionsHi: ['रैखिक बहुपद', 'द्विघात बहुपद', 'त्रिघात बहुपद', 'शून्य बहुपद'],
        correctIndex: 1,
        explanationEn: 'A polynomial of degree 2 is a quadratic polynomial (ax² + bx + c).',
        explanationHi: 'घात 2 वाले बहुपद को द्विघात बहुपद कहते हैं।',
        topicTag: 'Discriminant & Roots'
      },
      {
        id: 'bm_2',
        questionEn: 'During respiration, pyruvate breaks down into CO₂, water and energy in:',
        questionHi: 'श्वसन में पायरुवेट का विखंडन CO₂, जल और ऊर्जा में कहाँ होता है?',
        optionsEn: ['Cytoplasm', 'Mitochondria', 'Chloroplast', 'Nucleus'],
        optionsHi: ['कोशिकाद्रव्य', 'माइटोकॉन्ड्रिया', 'हरितलवक', 'केंद्रक'],
        correctIndex: 1,
        explanationEn: 'Aerobic breakdown of pyruvate takes place inside the mitochondria.',
        explanationHi: 'ऑक्सी श्वसन में पायरुवेट का विखंडन माइटोकॉन्ड्रिया में होता है।',
        topicTag: 'Life Processes'
      },
      {
        id: 'bm_3',
        questionEn: 'How many pesos did Lencho receive in the reply?',
        questionHi: 'लेंचो को उत्तर में कितने पेसो प्राप्त हुए?',
        optionsEn: ['100 pesos', '70 pesos', '50 pesos', '30 pesos'],
        optionsHi: ['100 पेसो', '70 पेसो', '50 पेसो', '30 पेसो'],
        correctIndex: 1,
        explanationEn: 'The postmaster collected 70 pesos with the help of colleagues and friends.',
        explanationHi: 'पोस्टमास्टर ने सहकर्मियों की मदद से 70 पेसो एकत्र किए थे।',
        topicTag: 'English Prose'
      }
    ]
  }
];

export const INITIAL_SCHEDULE: StudyTask[] = [
  {
    id: 'st_1',
    timeSlot: '06:30 AM',
    titleEn: 'Mathematics — Real Numbers Theorem Practice',
    titleHi: 'गणित — वास्तविक संख्याएँ प्रमेय अभ्यास',
    subject: 'MATH',
    isDone: true
  },
  {
    id: 'st_2',
    timeSlot: '04:00 PM',
    titleEn: 'Science — Chemical Equations Balancing',
    titleHi: 'विज्ञान — रासायनिक समीकरण संतुलन',
    subject: 'SCIENCE',
    isDone: false
  },
  {
    id: 'st_3',
    timeSlot: '06:30 PM',
    titleEn: 'Social Science — Nationalism in India Timeline',
    titleHi: 'सामाजिक विज्ञान — भारत में राष्ट्रवाद समय-रेखा',
    subject: 'SST',
    isDone: false
  },
  {
    id: 'st_4',
    timeSlot: '08:30 PM',
    titleEn: 'Daily 15-Min Board MCQ Sprint',
    titleHi: 'दैनिक 15-मिनट बोर्ड MCQ अभ्यास',
    subject: 'HINDI',
    isDone: false
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_2026_1',
    titleEn: '2026-27 Board Exam Sample Blueprints Live',
    titleHi: '2026-27 बोर्ड परीक्षा सैंपल ब्लूप्रिंट जारी',
    bodyEn: 'CBSE, Bihar, UP, MP & ICSE Class 10 updated sample papers and chapter notes are now active.',
    bodyHi: 'CBSE, बिहार, यूपी, एमपी एवं ICSE कक्षा 10 के नए मॉडल पेपर और नोट्स अब उपलब्ध हैं।',
    board: 'ALL',
    createdAt: '2026-11-12T09:00:00Z'
  },
  {
    id: 'notif_2026_2',
    titleEn: 'Live Doubt Clearing Session Today at 7:00 PM',
    titleHi: 'आज शाम 7:00 बजे लाइव डाउट क्लियरिंग क्लास',
    bodyEn: 'Join Trigonometry & Quadratic Equations marathon with solved previous year board questions.',
    bodyHi: 'त्रिकोणमिति और द्विघात समीकरण की लाइव मैराथन क्लास में जुड़ें।',
    board: 'ALL',
    createdAt: '2026-11-12T14:30:00Z'
  }
];

export const LIVE_CLASSES: LiveClassSession[] = [
  {
    id: 'live_1',
    board: 'ALL',
    subject: 'MATH',
    titleEn: 'Trigonometry Identities & Board 4-Mark Proofs',
    titleHi: 'त्रिकोणमिति सर्वसमिकाएँ एवं बोर्ड 4-अंकीय प्रश्न',
    teacher: 'Prof. R.K. Sharma',
    scheduleTime: 'Live Now · 7:00 PM IST',
    isLiveNow: true
  },
  {
    id: 'live_2',
    board: 'ALL',
    subject: 'SCIENCE',
    titleEn: 'Light Ray Diagrams & Numerical Masterclass',
    titleHi: 'प्रकाश किरण आरेख एवं आंकिक प्रश्न मास्टरक्लास',
    teacher: 'Dr. Ananya Verma',
    scheduleTime: 'Tomorrow · 5:30 PM IST',
    isLiveNow: false
  }
];

export const PYQ_PAPERS: PyqPaper[] = [
  {
    id: 'pyq_cbse_math_2026',
    board: 'CBSE',
    subject: 'MATH',
    year: 2026,
    titleEn: 'CBSE Class 10 Mathematics Standard 2026 Solved Paper',
    titleHi: 'CBSE कक्षा 10 गणित मानक 2026 हल प्रश्न-पत्र',
    isPremium: true,
    questionsCount: 38
  },
  {
    id: 'pyq_cbse_sci_2025',
    board: 'CBSE',
    subject: 'SCIENCE',
    year: 2025,
    titleEn: 'CBSE Class 10 Science 2025 Official Marking Scheme',
    titleHi: 'CBSE कक्षा 10 विज्ञान 2025 आधिकारिक उत्तर कुंजी',
    isPremium: true,
    questionsCount: 39
  },
  {
    id: 'pyq_bihar_math_2026',
    board: 'BIHAR',
    subject: 'MATH',
    year: 2026,
    titleEn: 'BSEB Matric Mathematics 2026 First Sitting Paper',
    titleHi: 'बिहार बोर्ड मैट्रिक गणित 2026 प्रथम पाली प्रश्न-पत्र',
    isPremium: true,
    questionsCount: 138
  },
  {
    id: 'pyq_up_sci_2026',
    board: 'UP',
    subject: 'SCIENCE',
    year: 2026,
    titleEn: 'UPMSP Class 10 Science 2026 Set 824(EK) Solved',
    titleHi: 'यूपी बोर्ड कक्षा 10 विज्ञान 2026 सेट 824(EK) हल सहित',
    isPremium: true,
    questionsCount: 31
  },
  {
    id: 'pyq_mp_sst_2025',
    board: 'MP',
    subject: 'SST',
    year: 2025,
    titleEn: 'MPBSE Class 10 Social Science 2025 Solved Paper',
    titleHi: 'एमपी बोर्ड कक्षा 10 सामाजिक विज्ञान 2025 हल प्रश्न-पत्र',
    isPremium: true,
    questionsCount: 23
  },
  {
    id: 'pyq_icse_math_2026',
    board: 'ICSE',
    subject: 'MATH',
    year: 2026,
    titleEn: 'CISCE ICSE Class 10 Mathematics 2026 Specimen & PYQ',
    titleHi: 'ICSE कक्षा 10 गणित 2026 स्पेसिमेन एवं पिछले वर्ष का पेपर',
    isPremium: true,
    questionsCount: 10
  }
];
