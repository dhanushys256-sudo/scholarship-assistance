// =============================================
//  SCHOLARBRIDGE — MULTI-LANGUAGE TRANSLATION ENGINE
//  Supports: English, Kannada, Hindi, Tamil, Telugu,
//            Malayalam, Marathi, Bengali
// =============================================

(function () {
  'use strict';

  const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English', native: 'English', flag: '🇬🇧', msg: 'Language changed to English' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳', msg: 'ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', msg: 'भाषा बदलकर हिन्दी कर दी गई है' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', msg: 'மொழி தமிழாக மாற்றப்பட்டது' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳', msg: 'భాష తెలుగుకు మార్చబడింది' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳', msg: 'ഭാഷ മലയാളത്തിലേക്ക് മാറ്റി' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳', msg: 'भाषा मराठीत बदलली आहे' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇮🇳', msg: 'ভাষা বাংলায় পরিবর্তন করা হয়েছে' }
  ];

  const UI_DICTIONARY = {
    en: {
      home: 'Home', scholarships: 'Scholarships', eligibility: 'Check Eligibility',
      faq: 'FAQ', contact: 'Contact', login: 'Login', getStarted: 'Get Started',
      dashboard: 'My Dashboard', logout: 'Logout', admin: 'Admin Panel', backToSite: '← Back to Site'
    },
    kn: {
      home: 'ಮುಖಪುಟ', scholarships: 'ವಿದ್ಯಾರ್ಥಿವೇತನಗಳು', eligibility: 'ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ',
      faq: 'ಪ್ರಶ್ನೋತ್ತರ', contact: 'ಸಂಪರ್ಕಿಸಿ', login: 'ಲಾಗಿನ್', getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
      dashboard: 'ನನ್ನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', logout: 'ಲಾಗ್‌ಔಟ್', admin: 'ನಿರ್ವಾಹಕ ಫಲಕ', backToSite: '← ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ'
    },
    hi: {
      home: 'मुख्य पृष्ठ', scholarships: 'छात्रवृत्तियां', eligibility: 'पात्रता जांचें',
      faq: 'एफएक्यू', contact: 'संपर्क करें', login: 'लॉगिन', getStarted: 'शुरू करें',
      dashboard: 'मेरा डैशबोर्ड', logout: 'लॉगआउट', admin: 'व्यवस्थापक पैनल', backToSite: '← साइट पर वापस जाएं'
    },
    ta: {
      home: 'முகப்பு', scholarships: 'உதவித்தொகைகள்', eligibility: 'தகுதியைச் சரிபார்க்கவும்',
      faq: 'கேள்விகள்', contact: 'தொடர்பு கொள்ள', login: 'உள்நுழைய', getStarted: 'தொடங்கவும்',
      dashboard: 'எனது டாஷ்போர்டு', logout: 'வெளியேறு', admin: 'நிர்வாக குழு', backToSite: '← தளத்திற்கு திரும்பு'
    },
    te: {
      home: 'హోమ్', scholarships: 'స్కాలర్‌షిప్‌లు', eligibility: 'అర్హత తనిఖీ',
      faq: 'ప్రశ్నోత్తరాలు', contact: 'సంప్రదించండి', login: 'లాగిన్', getStarted: 'ప్రారంభించండి',
      dashboard: 'నా డాష్‌బోర్డ్', logout: 'లాగౌట్', admin: 'అడ్మిన్ ప్యానెల్', backToSite: '← తిరిగి వెళ్లండి'
    },
    ml: {
      home: 'ഹോം', scholarships: 'സ്കോളർഷിപ്പുകൾ', eligibility: 'യോഗ്യത പരിശോധിക്കുക',
      faq: 'പതിവ് ചോദ്യങ്ങൾ', contact: 'ബന്ധപ്പെടുക', login: 'ലോഗിൻ', getStarted: 'ആരംഭിക്കുക',
      dashboard: 'എന്റെ ഡാഷ്‌ബോർഡ്', logout: 'ലോഗ്ഔട്ട്', admin: 'അഡ്മിൻ പാനൽ', backToSite: '← പിന്നോട്ട്'
    },
    mr: {
      home: 'मुख्यपृष्ठ', scholarships: 'शिष्यवृत्ती', eligibility: 'पात्रता तपासा',
      faq: 'प्रश्न व उत्तरे', contact: 'संपर्क करा', login: 'लॉगिन', getStarted: 'सुरू करा',
      dashboard: 'माझा डॅशबोर्ड', logout: 'लॉगआउट', admin: 'प्रशासक पॅनेल', backToSite: '← साइटवर परत जा'
    },
    bn: {
      home: 'হোম', scholarships: 'স্কলারশিপ', eligibility: 'যোগ্যতা যাচাই',
      faq: 'প্রশ্নোত্তর', contact: 'যোগাযোগ', login: 'লগইন', getStarted: 'শুরু করুন',
      dashboard: 'আমার ড্যাশবোর্ড', logout: 'লগআউট', admin: 'অ্যাডমিন প্যানেল', backToSite: '← সাইটে ফিরে যান'
    }
  };

  const STORAGE_KEY = 'scholarbridge_lang';

  function getCurrentLang() {
    return localStorage.getItem(STORAGE_KEY) || 'en';
  }

  function setCookie(lang) {
    if (lang === 'en') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=/en/en; path=/;';
    } else {
      const value = `/en/${lang}`;
      document.cookie = `googtrans=${value}; path=/;`;
      if (window.location.hostname && window.location.hostname !== 'localhost') {
        document.cookie = `googtrans=${value}; path=/; domain=.${window.location.hostname};`;
      }
    }
  }

  function applyInstantTranslations(langCode) {
    const dict = UI_DICTIONARY[langCode] || UI_DICTIONARY.en;

    // Navbar links
    const navLinks = document.querySelectorAll('.navbar-links a, .mobile-menu a');
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href.includes('index.html') || href === '/') {
        link.textContent = link.classList.contains('active') ? dict.home : dict.home;
      } else if (href.includes('scholarships.html')) {
        link.textContent = dict.scholarships;
      } else if (href.includes('eligibility.html')) {
        link.textContent = dict.eligibility;
      } else if (href.includes('faq.html')) {
        link.textContent = dict.faq;
      } else if (href.includes('contact.html')) {
        link.textContent = dict.contact;
      } else if (href.includes('dashboard.html')) {
        link.textContent = dict.dashboard;
      }
    });

    // Auth buttons
    const loginBtn = document.getElementById('navLoginBtn');
    if (loginBtn) loginBtn.textContent = dict.login;

    const logoutBtn = document.getElementById('navLogoutBtn');
    if (logoutBtn) logoutBtn.textContent = dict.logout;

    const dashBtn = document.getElementById('navDashBtn');
    if (dashBtn) dashBtn.textContent = dict.dashboard;

    // Admin links
    document.querySelectorAll('.badge-red').forEach(b => {
      if (b.textContent.includes('Admin')) b.textContent = dict.admin;
    });
  }

  function applyLanguage(langCode, triggerGoogle = true) {
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === langCode) || SUPPORTED_LANGUAGES[0];
    localStorage.setItem(STORAGE_KEY, langCode);
    setCookie(langCode);
    document.documentElement.lang = langCode;

    // Update active UI elements
    updateLanguageButtons(langObj);
    applyInstantTranslations(langCode);

    if (triggerGoogle) {
      triggerGoogleTranslate(langCode);
    }

    // Friendly notification
    if (typeof showToast === 'function') {
      showToast(`${langObj.flag} ${langObj.msg}`, 'info', 3000);
    }
  }

  function triggerGoogleTranslate(langCode) {
    const tryTrigger = (attempts = 0) => {
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        if (langCode === 'en') {
          combo.value = '';
        } else {
          combo.value = langCode;
        }
        combo.dispatchEvent(new Event('change'));
      } else if (attempts < 20) {
        setTimeout(() => tryTrigger(attempts + 1), 250);
      }
    };
    tryTrigger();
  }

  function updateLanguageButtons(langObj) {
    document.querySelectorAll('.lang-btn-current').forEach(el => {
      el.innerHTML = `<span class="lang-flag">${langObj.flag}</span> <span class="lang-text">${langObj.native}</span>`;
    });

    document.querySelectorAll('.lang-dropdown-item').forEach(item => {
      const code = item.getAttribute('data-lang');
      item.classList.toggle('active', code === langObj.code);
    });
  }

  // Create UI Dropdown Component
  function createLanguageSwitcher() {
    const currentLang = getCurrentLang();
    const currentObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

    const wrapper = document.createElement('div');
    wrapper.className = 'lang-switcher';
    wrapper.id = 'langSwitcher';

    wrapper.innerHTML = `
      <button type="button" class="lang-btn" id="langDropdownBtn" aria-label="Select Language" aria-expanded="false">
        <span class="lang-icon">🌐</span>
        <span class="lang-btn-current">
          <span class="lang-flag">${currentObj.flag}</span>
          <span class="lang-text">${currentObj.native}</span>
        </span>
        <span class="lang-arrow">▾</span>
      </button>
      <div class="lang-dropdown" id="langDropdownMenu" role="menu">
        <div class="lang-dropdown-header">Select Language / ಭಾಷೆ / भाषा</div>
        <div class="lang-dropdown-list">
          ${SUPPORTED_LANGUAGES.map(l => `
            <button type="button" class="lang-dropdown-item ${l.code === currentLang ? 'active' : ''}" data-lang="${l.code}">
              <span class="lang-flag">${l.flag}</span>
              <span class="lang-names">
                <strong class="lang-native">${l.native}</strong>
                <small class="lang-en">${l.name}</small>
              </span>
              <span class="lang-check">✓</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // Dropdown toggle logic
    const btn = wrapper.querySelector('#langDropdownBtn');
    const menu = wrapper.querySelector('#langDropdownMenu');

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = wrapper.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        wrapper.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    // Language select logic
    wrapper.querySelectorAll('.lang-dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = item.getAttribute('data-lang');
        wrapper.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        applyLanguage(code, true);
      });
    });

    return wrapper;
  }

  // Mobile menu language selector
  function createMobileLanguageSwitcher() {
    const currentLang = getCurrentLang();
    const container = document.createElement('div');
    container.className = 'mobile-lang-container';
    container.innerHTML = `
      <div class="mobile-lang-label">🌐 Choose Language / ಭಾಷೆ</div>
      <div class="mobile-lang-chips">
        ${SUPPORTED_LANGUAGES.map(l => `
          <button type="button" class="mobile-lang-chip ${l.code === currentLang ? 'active' : ''}" data-lang="${l.code}">
            ${l.flag} ${l.native}
          </button>
        `).join('')}
      </div>
    `;

    container.querySelectorAll('.mobile-lang-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.mobile-lang-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyLanguage(btn.getAttribute('data-lang'), true);
      });
    });

    return container;
  }

  // Mount switcher into navbars
  function mountLanguageSwitcher() {
    const currentLang = getCurrentLang();
    setCookie(currentLang);

    // Target navbar actions container
    const navbarActions = document.querySelector('.navbar-actions');
    if (navbarActions && !document.getElementById('langSwitcher')) {
      const switcher = createLanguageSwitcher();
      navbarActions.insertBefore(switcher, navbarActions.firstChild);
    } else if (!document.getElementById('langSwitcher')) {
      // Fallback for pages like admin or minimal nav
      const navInner = document.querySelector('.navbar-inner');
      if (navInner) {
        const switcher = createLanguageSwitcher();
        const mobileBtn = navInner.querySelector('.nav-mobile-btn') || navInner.lastElementChild;
        if (mobileBtn) {
          navInner.insertBefore(switcher, mobileBtn);
        } else {
          navInner.appendChild(switcher);
        }
      }
    }

    // Target mobile menu
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu && !mobileMenu.querySelector('.mobile-lang-container')) {
      mobileMenu.appendChild(createMobileLanguageSwitcher());
    }

    // Apply translations on initial load
    if (currentLang !== 'en') {
      applyInstantTranslations(currentLang);
    }
  }

  // Initialize Google Translate
  function initGoogleTranslate() {
    if (!document.getElementById('google_translate_element')) {
      const div = document.createElement('div');
      div.id = 'google_translate_element';
      div.style.display = 'none';
      document.body.appendChild(div);
    }

    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,kn,hi,ta,te,ml,mr,bn',
        autoDisplay: false
      }, 'google_translate_element');

      const savedLang = getCurrentLang();
      if (savedLang && savedLang !== 'en') {
        setTimeout(() => triggerGoogleTranslate(savedLang), 600);
      }
    };

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      mountLanguageSwitcher();
      initGoogleTranslate();
    });
  } else {
    mountLanguageSwitcher();
    initGoogleTranslate();
  }

  // Expose global controller
  window.ScholarBridgeLang = {
    setLanguage: applyLanguage,
    getCurrentLanguage: getCurrentLang,
    languages: SUPPORTED_LANGUAGES,
    dictionary: UI_DICTIONARY
  };
})();
