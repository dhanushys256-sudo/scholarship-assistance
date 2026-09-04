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
    featured: true
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
    featured: true
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
    featured: true
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
    featured: false
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
    featured: false
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
    featured: false
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
