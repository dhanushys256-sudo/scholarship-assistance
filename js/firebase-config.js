// =============================================
//  FIREBASE CONFIGURATION
//  Use your real project config from Firebase Console.
//  If the values are still placeholders, the app stays
//  in demo mode and does not crash.
// =============================================

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyPLACEHOLDER-REPLACE-WITH-YOUR-KEY",
  authDomain: "scholarship-assist.firebaseapp.com",
  projectId: "scholarship-assist",
  storageBucket: "scholarship-assist.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefgh12345678"
};

const getFirebaseConfig = () => {
  const runtimeConfig = (typeof window !== 'undefined' && window.__FIREBASE_CONFIG__) || {};
  return {
    ...DEFAULT_FIREBASE_CONFIG,
    ...runtimeConfig
  };
};

const isFirebaseConfigPlaceholder = (value) => {
  if (typeof value !== 'string') return true;
  const cleaned = value.trim();
  return cleaned.length < 10 || cleaned.includes('PLACEHOLDER') || cleaned.includes('YOUR-KEY') || cleaned.includes('REPLACE-WITH');
};

const isFirebaseConfigReady = (config) => {
  return !isFirebaseConfigPlaceholder(config.apiKey)
    && !isFirebaseConfigPlaceholder(config.projectId)
    && !isFirebaseConfigPlaceholder(config.appId);
};

const firebaseConfig = getFirebaseConfig();

const loadScript = (src) => new Promise((resolve, reject) => {
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) {
    if (existing.dataset.loaded === 'true') {
      resolve();
      return;
    }
    existing.addEventListener('load', () => resolve(), { once: true });
    existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
    return;
  }

  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.onload = () => {
    script.dataset.loaded = 'true';
    resolve();
  };
  script.onerror = () => reject(new Error(`Failed to load ${src}`));
  document.head.appendChild(script);
});

const ensureFirebaseSDK = async () => {
  if (typeof window === 'undefined') return;
  if (window.firebase) return;

  const sdkVersion = '10.14.1';
  const scripts = [
    `https://www.gstatic.com/firebasejs/${sdkVersion}/firebase-app-compat.js`,
    `https://www.gstatic.com/firebasejs/${sdkVersion}/firebase-auth-compat.js`,
    `https://www.gstatic.com/firebasejs/${sdkVersion}/firebase-firestore-compat.js`,
    `https://www.gstatic.com/firebasejs/${sdkVersion}/firebase-storage-compat.js`
  ];

  for (const src of scripts) {
    await loadScript(src);
  }
};

// ─── Mock Data (used when Firebase is not connected) ───
const MOCK_SCHOLARSHIPS = [
  {
    id: "sch001",
    title: "National Merit Scholarship",
    organization: "Government of India",
    orgEmoji: "🏛️",
    orgColor: "#1A1A2E",
    amount: 75000,
    amountDisplay: "₹75,000/year",
    category: "Merit",
    level: ["undergraduate", "postgraduate"],
    deadline: "2026-10-31",
    deadlineDisplay: "Oct 31, 2026",
    eligibility: "Minimum 80% in Class 12. Family income below ₹6 LPA.",
    description: "A prestigious government scholarship awarded to meritorious students from economically weaker sections to pursue higher education.",
    documents: ["marksheet", "income_certificate", "aadhaar", "bank_passbook"],
    seats: 500,
    applied: 342,
    tags: ["Merit-Based", "Central Government", "All India"],
    featured: true,
    applicationUrl: "https://scholarships.gov.in/"
  },
  {
    id: "sch002",
    title: "Pre-Matric Scholarship for SC/ST Students",
    organization: "Ministry of Social Justice",
    orgEmoji: "⚖️",
    orgColor: "#0F3460",
    amount: 25000,
    amountDisplay: "₹25,000/year",
    category: "Reserved",
    level: ["school"],
    deadline: "2026-09-30",
    deadlineDisplay: "Sep 30, 2026",
    eligibility: "SC/ST students in Class 9–10. Family income below ₹2 LPA.",
    description: "Financial support for SC/ST students studying in Class 9 and 10 to ensure continuity of education.",
    documents: ["caste_certificate", "income_certificate", "marksheet", "aadhaar"],
    seats: 1000,
    applied: 720,
    tags: ["SC/ST", "Pre-Matric", "Central Government"],
    featured: true,
    applicationUrl: "https://scholarships.gov.in/"
  },
  {
    id: "sch003",
    title: "Inspire Scholarship for Higher Education",
    organization: "Dept. of Science & Technology",
    orgEmoji: "🔬",
    orgColor: "#1D4ED8",
    amount: 60000,
    amountDisplay: "₹60,000/year",
    category: "Science",
    level: ["undergraduate"],
    deadline: "2026-11-15",
    deadlineDisplay: "Nov 15, 2026",
    eligibility: "Top 1% in Class 12 board exams. Pursuing science streams.",
    description: "Awarded to exceptional science students to encourage and strengthen the talent pool in science streams.",
    documents: ["marksheet", "merit_certificate", "bank_passbook", "aadhaar"],
    seats: 10000,
    applied: 4500,
    tags: ["Science", "Merit", "DST"],
    featured: true,
    applicationUrl: "https://online-inspire.gov.in/"
  },
  {
    id: "sch004",
    title: "Pragati Scholarship for Girls",
    organization: "AICTE India",
    orgEmoji: "👩‍🎓",
    orgColor: "#7E22CE",
    amount: 30000,
    amountDisplay: "₹30,000/year",
    category: "Girls",
    level: ["undergraduate"],
    deadline: "2026-10-15",
    deadlineDisplay: "Oct 15, 2026",
    eligibility: "Girl students admitted to AICTE-approved degree courses. Family income below ₹8 LPA.",
    description: "Empowering girl students to pursue technical education and build careers in STEM fields.",
    documents: ["marksheet", "income_certificate", "fee_receipt", "aadhaar", "bank_passbook"],
    seats: 4000,
    applied: 1200,
    tags: ["Girls", "Technical", "AICTE"],
    featured: false,
    applicationUrl: "https://www.aicte-india.org/schemes/students-development-schemes/Pragati"
  },
  {
    id: "sch005",
    title: "PM Scholarship for Central Armed Police Forces",
    organization: "Ministry of Home Affairs",
    orgEmoji: "🎖️",
    orgColor: "#15803D",
    amount: 36000,
    amountDisplay: "₹36,000/year",
    category: "Defence",
    level: ["undergraduate", "postgraduate"],
    deadline: "2026-12-01",
    deadlineDisplay: "Dec 1, 2026",
    eligibility: "Wards of ex-servicemen / CAPF personnel. Pursuing professional degree courses.",
    description: "Supporting children of ex-servicemen and CAPF personnel to pursue professional education.",
    documents: ["service_certificate", "marksheet", "income_certificate", "aadhaar"],
    seats: 2000,
    applied: 980,
    tags: ["Defence", "Professional Courses", "MHA"],
    featured: false,
    applicationUrl: "https://www.mha.gov.in/"
  },
  {
    id: "sch006",
    title: "Ishan Uday Scholarship for NE Students",
    organization: "University Grants Commission",
    orgEmoji: "🌄",
    orgColor: "#B45309",
    amount: 54000,
    amountDisplay: "₹54,000/year",
    category: "Regional",
    level: ["undergraduate"],
    deadline: "2026-11-30",
    deadlineDisplay: "Nov 30, 2026",
    eligibility: "Students domiciled in North-East India. Family income below ₹4.5 LPA.",
    description: "Special scholarship to encourage higher education among students from North-Eastern states.",
    documents: ["domicile_certificate", "income_certificate", "marksheet", "bank_passbook"],
    seats: 10000,
    applied: 3200,
    tags: ["North-East", "UGC", "Regional"],
    featured: false,
    applicationUrl: "https://scholarships.gov.in/"
  },
  {
    id: "sch007",
    title: "Tata Trusts Medical & Healthcare Scholarship",
    organization: "Sir Ratan Tata Trusts",
    orgEmoji: "🏥",
    orgColor: "#088395",
    amount: 120000,
    amountDisplay: "₹1,20,000/year",
    category: "Science",
    level: ["undergraduate", "postgraduate"],
    deadline: "2026-10-25",
    deadlineDisplay: "Oct 25, 2026",
    eligibility: "Pursuing MBBS, BDS, Pharmacy, or Nursing in recognized colleges. 75%+ in Class 12. Family income < ₹6 LPA.",
    description: "Prestigious financial support from Tata Trusts to empower promising healthcare and medical students across India.",
    documents: ["marksheet", "income_certificate", "college_admission", "aadhaar", "bank_passbook"],
    seats: 1200,
    applied: 640,
    tags: ["Medical", "Healthcare", "Tata Trusts", "Merit-cum-Means"],
    featured: true,
    applicationUrl: "https://www.tatatrusts.org/"
  },
  {
    id: "sch008",
    title: "Reliance Foundation Undergraduate Scholarship",
    organization: "Reliance Foundation",
    orgEmoji: "💎",
    orgColor: "#0A4D68",
    amount: 200000,
    amountDisplay: "₹2,00,000 grant",
    category: "Merit",
    level: ["undergraduate"],
    deadline: "2026-11-20",
    deadlineDisplay: "Nov 20, 2026",
    eligibility: "Enrolled in 1st year full-time UG degree in any stream. Min 60% in Class 12. Household income below ₹15 LPA.",
    description: "Flagship scholarship program aimed at empowering students who demonstrate leadership potential and academic rigor.",
    documents: ["marksheet", "income_certificate", "aadhaar", "bonafide_certificate"],
    seats: 5000,
    applied: 3890,
    tags: ["Reliance", "Undergraduate", "Merit", "Leadership"],
    featured: true,
    applicationUrl: "https://www.reliancefoundation.org/"
  },
  {
    id: "sch009",
    title: "Sports Authority of India (SAI) National Talent Scholarship",
    organization: "Ministry of Youth Affairs & Sports",
    orgEmoji: "🏃",
    orgColor: "#C07F00",
    amount: 150000,
    amountDisplay: "₹1,50,000/year",
    category: "Sports",
    level: ["school", "undergraduate"],
    deadline: "2026-12-15",
    deadlineDisplay: "Dec 15, 2026",
    eligibility: "Medalists or participants in National / State School Games or Khelo India Youth Games. Age 14-23 years.",
    description: "Comprehensive scholarship covering nutrition, coaching equipment, sports kit allowances, and academic continuity.",
    documents: ["sports_certificate", "birth_certificate", "marksheet", "bank_passbook", "aadhaar"],
    seats: 2500,
    applied: 1120,
    tags: ["Sports", "Khelo India", "SAI", "National"],
    featured: false,
    applicationUrl: "https://scholarships.gov.in/"
  },
  {
    id: "sch010",
    title: "ONGC Foundation Meritorious Scholarship",
    organization: "ONGC Foundation",
    orgEmoji: "🛢️",
    orgColor: "#850000",
    amount: 48000,
    amountDisplay: "₹48,000/year",
    category: "Reserved",
    level: ["undergraduate", "postgraduate"],
    deadline: "2026-10-18",
    deadlineDisplay: "Oct 18, 2026",
    eligibility: "SC/ST/OBC students in 1st year Engineering, MBBS, MBA, or Geology. Min 60% marks. Family income < ₹2 LPA.",
    description: "CSR initiative dedicated to supporting students from marginalized communities enrolled in professional courses.",
    documents: ["caste_certificate", "income_certificate", "jee_neet_rankcard", "marksheet", "aadhaar"],
    seats: 2000,
    applied: 1450,
    tags: ["ONGC", "Engineering", "MBBS", "CSR"],
    featured: false,
    applicationUrl: "https://www.ongcindia.com/"
  },
  {
    id: "sch011",
    title: "KVPY - IISc Young Scientist Research Fellowship",
    organization: "Indian Institute of Science & DST",
    orgEmoji: "🔭",
    orgColor: "#005B41",
    amount: 84000,
    amountDisplay: "₹84,000/year + ₹28K Grant",
    category: "Science",
    level: ["undergraduate", "postgraduate"],
    deadline: "2026-11-05",
    deadlineDisplay: "Nov 5, 2026",
    eligibility: "Students enrolled in 1st year B.Sc / B.S. / Int. M.Sc in Basic Sciences with minimum 75% in Science & Mathematics.",
    description: "National premier fellowship program to attract exceptionally talented young minds to research careers in basic sciences.",
    documents: ["marksheet", "research_proposal", "recommendation_letter", "aadhaar", "bank_passbook"],
    seats: 1500,
    applied: 920,
    tags: ["Research", "IISc", "Basic Sciences", "Fellowship"],
    featured: true,
    applicationUrl: "https://www.iisc.ac.in/kvpy/"
  },
  {
    id: "sch012",
    title: "Dr. APJ Abdul Kalam International Studies Scholarship",
    organization: "Directorate of Higher Education",
    orgEmoji: "✈️",
    orgColor: "#1B263B",
    amount: 400000,
    amountDisplay: "₹4,00,000/year",
    category: "Regional",
    level: ["postgraduate"],
    deadline: "2026-12-10",
    deadlineDisplay: "Dec 10, 2026",
    eligibility: "Indian students accepted into Top 200 QS-ranked global universities for Master's or Ph.D in STEM domains.",
    description: "Prestige grant funding tuition, overseas air travel, and specialized research equipment for international study.",
    documents: ["passport", "university_admission_offer", "gre_ielts_score", "marksheet", "income_certificate"],
    seats: 300,
    applied: 215,
    tags: ["Study Abroad", "STEM", "International", "Postgraduate"],
    featured: false,
    applicationUrl: "https://www.education.gov.in/"
  },
  {
    id: "sch013",
    title: "Begum Hazrat Mahal National Scholarship for Girls",
    organization: "Maulana Azad Education Foundation",
    orgEmoji: "🧕",
    orgColor: "#5A189A",
    amount: 12000,
    amountDisplay: "₹12,000/year",
    category: "Girls",
    level: ["school"],
    deadline: "2026-10-10",
    deadlineDisplay: "Oct 10, 2026",
    eligibility: "Meritorious girl students belonging to Minority Communities studying in Classes 9-12. Income below ₹2 LPA.",
    description: "Government financial assistance aimed at curbing school dropouts and encouraging girl students to complete senior secondary.",
    documents: ["minority_certificate", "income_certificate", "school_bonafide", "marksheet", "aadhaar"],
    seats: 8000,
    applied: 5120,
    tags: ["Minority", "Girls", "School", "Central Government"],
    featured: false,
    applicationUrl: "https://www.minorityaffairs.gov.in/"
  },
  {
    id: "sch014",
    title: "Infosys Foundation STEM Stars Scholarship",
    organization: "Infosys Foundation",
    orgEmoji: "💻",
    orgColor: "#0077B6",
    amount: 100000,
    amountDisplay: "₹1,00,000/year",
    category: "Girls",
    level: ["undergraduate"],
    deadline: "2026-11-25",
    deadlineDisplay: "Nov 25, 2026",
    eligibility: "Female students enrolled in 1st year B.Tech / B.E. in NIRF top 100 institutes. Annual family income <= ₹8 Lakhs.",
    description: "Empowering female engineering students with financial tuition assistance, mentorship by Infosys technical leads, and laptop grants.",
    documents: ["admission_letter", "marksheet", "income_certificate", "aadhaar", "bank_details"],
    seats: 1000,
    applied: 740,
    tags: ["Women in STEM", "Engineering", "Infosys", "Mentorship"],
    featured: true,
    applicationUrl: "https://www.infosys.com/infosys-foundation.html"
  },
  {
    id: "sch015",
    title: "National Overseas Scholarship for SC/ST Candidates",
    organization: "Ministry of Social Justice & Empowerment",
    orgEmoji: "🌍",
    orgColor: "#2B2D42",
    amount: 1500000,
    amountDisplay: "₹15,00,000/year",
    category: "Reserved",
    level: ["postgraduate"],
    deadline: "2026-11-12",
    deadlineDisplay: "Nov 12, 2026",
    eligibility: "SC/ST candidates who have obtained admission in top 500 QS world university rankings for Master's or Ph.D.",
    description: "Full overseas scholarship covering entire international tuition, monthly living contingency, health insurance, and airfare.",
    documents: ["caste_certificate", "income_tax_returns", "foreign_offer_letter", "gre_toefl", "passport"],
    seats: 125,
    applied: 98,
    tags: ["Overseas", "SC/ST", "Full Ride", "Ph.D"],
    featured: false,
    applicationUrl: "https://scholarships.gov.in/"
  },
  {
    id: "sch016",
    title: "Aditya Birla Capital Covid & Merit Support",
    organization: "Aditya Birla Capital Foundation",
    orgEmoji: "🌟",
    orgColor: "#8D0801",
    amount: 60000,
    amountDisplay: "₹60,000/year",
    category: "Merit",
    level: ["undergraduate", "postgraduate"],
    deadline: "2026-10-28",
    deadlineDisplay: "Oct 28, 2026",
    eligibility: "Students enrolled in general or professional graduation courses with min 65% marks or facing financial adversity.",
    description: "CSR scholarship empowering students facing acute financial crises to complete their university education without interruption.",
    documents: ["marksheet", "income_certificate", "college_id", "aadhaar", "bank_passbook"],
    seats: 3000,
    applied: 1820,
    tags: ["CSR", "Aditya Birla", "Higher Education", "Need-Based"],
    featured: false,
    applicationUrl: "https://www.adityabirla.com/"
  }
];

const MOCK_USER = {
  uid: "demo_user_001",
  name: "Ravi Kumar",
  email: "ravi.kumar@example.com",
  phone: "9876543210",
  dob: "2002-04-15",
  gender: "Male",
  category: "OBC",
  income: "250000",
  address: "12, Green Park Colony, Nagpur, Maharashtra",
  class12Percentage: "87.4",
  currentCourse: "B.Tech Computer Science",
  college: "Government Engineering College",
  year: "2nd Year",
  profileComplete: 80,
  applications: [
    { scholarshipId: "sch001", status: "under_review", appliedDate: "2026-08-10", statusLabel: "Under Review" },
    { scholarshipId: "sch003", status: "approved",     appliedDate: "2026-07-22", statusLabel: "Approved ✓" },
    { scholarshipId: "sch004", status: "pending",      appliedDate: "2026-09-01", statusLabel: "Pending" }
  ]
};

const MOCK_TESTIMONIALS = [
  { name: "Priya Sharma", photo: "P", course: "B.Tech, NIT Nagpur", scholarship: "National Merit Scholarship", amount: "₹75,000", quote: "This scholarship changed my life. I was about to drop out due to financial constraints. Now I can focus entirely on my studies without worrying about fees.", stars: 5 },
  { name: "Rahul Verma",  photo: "R", course: "MBBS, Government Medical College", scholarship: "INSPIRE Scholarship", amount: "₹60,000", quote: "Getting the INSPIRE scholarship was a dream come true. The application process through this platform was so smooth and transparent!", stars: 5 },
  { name: "Anjali Nair",  photo: "A", course: "B.E. Mechanical, VIT Chennai", scholarship: "Pragati Scholarship", amount: "₹30,000", quote: "As the first girl in my family to attend college, this scholarship gave me the confidence that the government truly supports us.", stars: 5 }
];

// ─── App State ───
window.AppState = {
  currentUser: null,
  scholarships: MOCK_SCHOLARSHIPS,
  testimonials: MOCK_TESTIMONIALS,
  mockUser: MOCK_USER,
  isDemo: true,
  firebaseReady: false
};

// ─── Firebase Init (graceful degradation) ───
(async function initFirebase() {
  try {
    if (!isFirebaseConfigReady(firebaseConfig)) {
      console.warn('%c⚠️ Firebase config is still using placeholder values. Switching to Demo Mode.', 'color: #ff9900; font-weight: bold;');
      return;
    }

    await ensureFirebaseSDK();

    if (typeof firebase === 'undefined') {
      console.warn('%c⚠️ Firebase SDK failed to load. Running in Demo Mode.', 'color: #ff0000; font-weight: bold;');
      return;
    }

    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    window.db = firebase.firestore();
    window.auth = firebase.auth();
    window.storage = firebase.storage();
    AppState.isDemo = false;
    AppState.firebaseReady = true;
    console.log('%c✅ Firebase Connected', 'color: #22C55E; font-weight: bold;');
  } catch (e) {
    console.warn('Firebase init error, running in demo mode:', e.message);
  }
})();
