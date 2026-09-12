// =============================================
//  SCHOLARSHIP ASSISTANCE — MAIN APP LOGIC
// =============================================

/* ─── Utility Functions ─── */

// Format currency
const formatCurrency = (n) => '₹' + Number(n).toLocaleString('en-IN');

// Format date
const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const DEFAULT_EXTERNAL_APPLY_URL = 'https://scholarships.gov.in/';

function getScholarshipApplyUrl(scholarship) {
  const candidate = scholarship?.applicationUrl || scholarship?.applyUrl || scholarship?.website || scholarship?.url || scholarship?.link;
  if (typeof candidate === 'string' && candidate.trim()) {
    const normalized = candidate.trim();
    return /^https?:\/\//i.test(normalized) ? normalized : `https://${normalized}`;
  }
  return DEFAULT_EXTERNAL_APPLY_URL;
}

// Days remaining
const daysLeft = (deadline) => {
  const diff = new Date(deadline) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

// Debounce
const debounce = (fn, ms = 300) => {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
};

// Animate number counter
const animateCounter = (el, target, duration = 1500) => {
  const start = performance.now();
  const startVal = 0;
  const update = (time) => {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(startVal + (target - startVal) * ease).toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
};

/* ─── Toast Notifications ─── */
function showToast(message, type = 'info', duration = 4000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.style.setProperty('--duration', `${duration / 1000}s`);
  toast.innerHTML = `<span>${icons[type] || '🔔'}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration + 500);
}

function showRedirectModal(title, url) {
  let modal = document.getElementById('externalRedirectModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'externalRedirectModal';
    modal.style.position = 'fixed';
    modal.style.left = '50%';
    modal.style.top = '20px';
    modal.style.transform = 'translateX(-50%)';
    modal.style.zIndex = '99999';
    modal.style.width = 'min(90vw, 420px)';
    modal.style.background = 'rgba(15, 23, 42, 0.96)';
    modal.style.border = '1px solid rgba(255,255,255,0.12)';
    modal.style.borderRadius = '16px';
    modal.style.boxShadow = '0 18px 48px rgba(15, 23, 42, 0.35)';
    modal.style.padding = '16px 18px';
    modal.style.color = '#fff';
    modal.style.fontFamily = 'system-ui, sans-serif';
    modal.style.backdropFilter = 'blur(6px)';
    document.body.appendChild(modal);
  }

  const safeUrl = url || DEFAULT_EXTERNAL_APPLY_URL;
  modal.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;">
      <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:1.2rem;">🔗</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:0.74rem;letter-spacing:0.08em;text-transform:uppercase;color:#cbd5e1;opacity:0.9;">Official portal</div>
        <div style="font-size:0.98rem;font-weight:700;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${title}</div>
      </div>
    </div>
    <div style="margin-top:12px;font-size:0.78rem;color:#cbd5e1;word-break:break-all;">${safeUrl}</div>
    <div style="display:flex;gap:10px;margin-top:14px;">
      <button id="redirectCancelBtn" style="flex:1;padding:10px 12px;border-radius:10px;border:1px solid rgba(255,255,255,0.2);background:transparent;color:#fff;cursor:pointer;">Cancel</button>
      <button id="redirectContinueBtn" style="flex:1;padding:10px 12px;border-radius:10px;border:none;background:linear-gradient(135deg,#2563eb,#0ea5e9);color:#fff;font-weight:700;cursor:pointer;">Continue</button>
    </div>
  `;

  const continueBtn = document.getElementById('redirectContinueBtn');
  const cancelBtn = document.getElementById('redirectCancelBtn');

  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      clearTimeout(Number(modal.dataset.closeTimer || 0));
      modal.remove();
      const popup = window.open(safeUrl, '_blank', 'noopener,noreferrer');
      if (!popup) {
        window.location.href = safeUrl;
      }
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      clearTimeout(Number(modal.dataset.closeTimer || 0));
      modal.remove();
    });
  }

  clearTimeout(Number(modal.dataset.closeTimer || 0));
  modal.dataset.closeTimer = setTimeout(() => modal.remove(), 15000).toString();
}

/* ─── Navbar ─── */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileBtn = document.getElementById('navMobileBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (navbar) {
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      mobileBtn.innerHTML = mobileMenu.classList.contains('open') ? '✕' : '☰';
    });
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !mobileBtn.contains(e.target)) {
        mobileMenu.classList.remove('open');
        mobileBtn.innerHTML = '☰';
      }
    });
  }

  // Mark active link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
}

/* ─── Scroll Animations ─── */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');

        // Counter animation
        if (e.target.dataset.count) {
          const el = e.target.querySelector('.stat-num') || e.target;
          animateCounter(el, parseInt(e.target.dataset.count));
        }
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, [data-count]').forEach(el => {
    observer.observe(el);
  });
}

/* ─── Page Loader ─── */
function initPageLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('done');
    setTimeout(() => loader.remove(), 500);
  }, 1200);
}

/* ─── FAQ Accordion ─── */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ─── Scholarship Search & Filter ─── */
function initScholarshipFilter() {
  const searchInput = document.getElementById('schSearch');
  const categoryFilter = document.getElementById('schCategory');
  const levelFilter = document.getElementById('schLevel');
  const sortFilter = document.getElementById('schSort');
  const grid = document.getElementById('schGrid');
  const countEl = document.getElementById('schCount');
  if (!grid) return;

  let scholarships = AppState.scholarships;

  function renderCards(data) {
    if (countEl) countEl.textContent = `${data.length} Scholarships Found`;
    if (data.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;">
          <div class="empty-icon">🔍</div>
          <h3>No Scholarships Found</h3>
          <p>Try adjusting your search or filter criteria.</p>
          <button class="btn btn-outline" onclick="resetFilters()">Clear Filters</button>
        </div>`;
      return;
    }
    grid.innerHTML = data.map(s => createScholarshipCard(s)).join('');
    initScrollAnimations();
  }

  function applyFilters() {
    const q = searchInput ? searchInput.value.toLowerCase() : '';
    const cat = categoryFilter ? categoryFilter.value : '';
    const lev = levelFilter ? levelFilter.value : '';
    const sort = sortFilter ? sortFilter.value : 'deadline';

    let filtered = scholarships.filter(s => {
      const matchQ   = !q || s.title.toLowerCase().includes(q) || s.organization.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
      const matchCat = !cat || s.category === cat;
      const matchLev = !lev || s.level.includes(lev);
      return matchQ && matchCat && matchLev;
    });

    if (sort === 'amount_desc') filtered.sort((a, b) => b.amount - a.amount);
    else if (sort === 'amount_asc')  filtered.sort((a, b) => a.amount - b.amount);
    else if (sort === 'deadline')    filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    renderCards(filtered);
  }

  window.resetFilters = () => {
    if (searchInput)   searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (levelFilter)   levelFilter.value = '';
    if (sortFilter)    sortFilter.value = 'deadline';
    applyFilters();
  };

  const debouncedFilter = debounce(applyFilters, 250);
  [searchInput, categoryFilter, levelFilter, sortFilter].forEach(el => {
    if (el) el.addEventListener('input', debouncedFilter);
    if (el && el.tagName === 'SELECT') el.addEventListener('change', applyFilters);
  });

  applyFilters();
}

/* ─── Scholarship Application Limit & Tracking ─── */
const MAX_SCHOLARSHIP_APPLICATIONS = 5;

function getUserApplications() {
  try {
    const stored = localStorage.getItem('scholarbridge_user_applications');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Error reading stored applications', e);
  }
  const defaultApps = (AppState.currentUser && AppState.currentUser.applications) ||
                      (AppState.mockUser && AppState.mockUser.applications) || [];
  try {
    localStorage.setItem('scholarbridge_user_applications', JSON.stringify(defaultApps));
  } catch (e) {}
  return defaultApps;
}

function hasAppliedForScholarship(schId) {
  const apps = getUserApplications();
  return apps.some(a => a.scholarshipId === schId);
}

function canApplyForScholarship(schId) {
  const apps = getUserApplications();
  if (schId && hasAppliedForScholarship(schId)) {
    return {
      allowed: false,
      reason: 'already_applied',
      message: 'You have already applied for this scholarship.',
      count: apps.length,
      max: MAX_SCHOLARSHIP_APPLICATIONS
    };
  }
  if (apps.length >= MAX_SCHOLARSHIP_APPLICATIONS) {
    return {
      allowed: false,
      reason: 'limit_reached',
      message: `You can apply for up to ${MAX_SCHOLARSHIP_APPLICATIONS} scholarships only. You have already reached your limit (${apps.length}/${MAX_SCHOLARSHIP_APPLICATIONS}).`,
      count: apps.length,
      max: MAX_SCHOLARSHIP_APPLICATIONS
    };
  }
  return {
    allowed: true,
    count: apps.length,
    max: MAX_SCHOLARSHIP_APPLICATIONS,
    remaining: MAX_SCHOLARSHIP_APPLICATIONS - apps.length
  };
}

function saveUserApplication(application) {
  const apps = getUserApplications();
  const exists = apps.some(a => a.scholarshipId === application.scholarshipId);
  if (!exists) {
    apps.unshift(application);
    try {
      localStorage.setItem('scholarbridge_user_applications', JSON.stringify(apps));
    } catch (e) {}
    if (AppState.mockUser) AppState.mockUser.applications = apps;
    if (AppState.currentUser) AppState.currentUser.applications = apps;
  }
  return apps;
}

window.MAX_SCHOLARSHIP_APPLICATIONS = MAX_SCHOLARSHIP_APPLICATIONS;
window.getUserApplications = getUserApplications;
window.hasAppliedForScholarship = hasAppliedForScholarship;
window.canApplyForScholarship = canApplyForScholarship;
window.saveUserApplication = saveUserApplication;

/* ─── Favorites / Bookmarked Scholarships ─── */
function getFavoriteScholarships() {
  try {
    return JSON.parse(localStorage.getItem('scholarbridge_favorites') || '["sch001", "sch005"]');
  } catch (e) {
    return ["sch001", "sch005"];
  }
}

function isFavoriteScholarship(id) {
  return getFavoriteScholarships().includes(id);
}

function toggleFavoriteScholarship(id) {
  let favs = getFavoriteScholarships();
  const exists = favs.includes(id);
  if (exists) {
    favs = favs.filter(x => x !== id);
    showToast('Removed from Favorites 🤍', 'info', 2000);
  } else {
    favs.push(id);
    showToast('Saved to Favorites ❤️', 'success', 2000);
  }
  try {
    localStorage.setItem('scholarbridge_favorites', JSON.stringify(favs));
  } catch (e) {}

  document.querySelectorAll(`.fav-btn[data-sch-id="${id}"]`).forEach(btn => {
    btn.classList.toggle('active', !exists);
    btn.innerHTML = !exists ? '❤️' : '🤍';
    btn.title = !exists ? 'Remove from Favorites' : 'Add to Favorites';
  });

  if (typeof window.renderFavoritesTab === 'function') window.renderFavoritesTab();
}

window.getFavoriteScholarships = getFavoriteScholarships;
window.isFavoriteScholarship = isFavoriteScholarship;
window.toggleFavoriteScholarship = toggleFavoriteScholarship;

/* ─── Education Loan EMI Calculator ─── */
function calculateLoanEMI(principal, annualRate, tenureYears) {
  const p = Number(principal);
  const r = (Number(annualRate) / 12) / 100;
  const n = Number(tenureYears) * 12;
  if (r === 0 || n === 0) return { emi: Math.round(p / Math.max(1, n)), totalPayment: p, totalInterest: 0 };
  const emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  const totalPayment = emi * n;
  const totalInterest = totalPayment - p;
  return { emi, totalPayment, totalInterest };
}
window.calculateLoanEMI = calculateLoanEMI;

/* ─── Document Wallet Helper ─── */
const DEFAULT_WALLET_DOCUMENTS = [
  { id: 'doc1', title: 'Class 10 Marksheet & Certificate', type: 'Academic', date: '2026-05-12', status: 'verified', authority: 'CBSE Board / DigiLocker', icon: '🎓', size: '1.2 MB' },
  { id: 'doc2', title: 'Class 12 Higher Secondary Marksheet', type: 'Academic', date: '2026-06-20', status: 'verified', authority: 'State Board / DigiLocker', icon: '📋', size: '1.4 MB' },
  { id: 'doc3', title: 'Aadhaar Card (UIDAI e-KYC)', type: 'Identity', date: '2026-04-10', status: 'verified', authority: 'UIDAI / e-Pramaan', icon: '💳', size: '850 KB' },
  { id: 'doc4', title: 'Income Certificate (FY 2025-26)', type: 'Income', date: '2026-07-02', status: 'verified', authority: 'Revenue Dept (Tahsildar)', icon: '📊', size: '620 KB' },
  { id: 'doc5', title: 'Bank Passbook & Mandate (DBT Active)', type: 'Financial', date: '2026-08-01', status: 'verified', authority: 'State Bank of India', icon: '🏦', size: '940 KB' },
  { id: 'doc6', title: 'College Bonafide & Admission Slip', type: 'Institutional', date: '2026-08-15', status: 'pending', authority: 'Govt Engineering College', icon: '🏛️', size: '1.1 MB' }
];

function getWalletDocuments() {
  try {
    const stored = localStorage.getItem('scholarbridge_wallet_docs');
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  try {
    localStorage.setItem('scholarbridge_wallet_docs', JSON.stringify(DEFAULT_WALLET_DOCUMENTS));
  } catch (e) {}
  return DEFAULT_WALLET_DOCUMENTS;
}

function saveWalletDocument(doc) {
  const docs = getWalletDocuments();
  docs.unshift(doc);
  try {
    localStorage.setItem('scholarbridge_wallet_docs', JSON.stringify(docs));
  } catch (e) {}
  return docs;
}

window.getWalletDocuments = getWalletDocuments;
window.saveWalletDocument = saveWalletDocument;

/* ─── Create Scholarship Card HTML ─── */
function createScholarshipCard(s) {
  const days = daysLeft(s.deadline);
  const urgency = days < 15 ? 'badge-red' : days < 30 ? 'badge-gold' : 'badge-green';
  const urgencyText = days === 0 ? 'Closed' : days < 15 ? `${days}d left` : `${days}d left`;
  const levelBadge = s.level.includes('postgraduate') ? 'PG' : s.level.includes('undergraduate') ? 'UG' : 'School';
  const isCompared = (window.compareList || []).includes(s.id);
  const alreadyApplied = hasAppliedForScholarship(s.id);
  const isFav = isFavoriteScholarship(s.id);
  const userApps = getUserApplications();
  const limitReached = userApps.length >= MAX_SCHOLARSHIP_APPLICATIONS;

  let actionBtn = '';
  if (alreadyApplied) {
    actionBtn = `<a href="dashboard.html" class="btn btn-outline btn-sm" onclick="event.stopPropagation();" style="color:#22c55e;border-color:#22c55e;font-size:0.75rem;" title="Already submitted — view status in Dashboard">✓ Applied</a>`;
  } else if (limitReached) {
    actionBtn = `<button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); showToast('Application limit reached: You can apply for up to 5 scholarships only (5/5 applied).','warning',4000);" style="opacity:0.75;font-size:0.75rem;" title="Application limit reached (5/5)">Limit (5/5)</button>`;
  } else {
    actionBtn = `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); applyScholarship('${s.id}')">Apply Now</button>`;
  }

  return `
  <div class="scholarship-card fade-in" onclick="viewScholarship('${s.id}')">
    <div class="card-top-bar">
      <div class="card-top-left">
        <div class="badge ${urgency}">${urgencyText}</div>
        ${alreadyApplied ? '<div class="badge badge-green" style="background:#22c55e22;color:#22c55e;border:1px solid #22c55e44;">✓ Applied</div>' : ''}
      </div>
      <div class="card-top-right">
        <button class="fav-btn ${isFav ? 'active' : ''}" data-sch-id="${s.id}" 
          onclick="event.stopPropagation(); toggleFavoriteScholarship('${s.id}')" 
          title="${isFav ? 'Remove from Favorites' : 'Save to Favorites'}">
          ${isFav ? '❤️' : '🤍'}
        </button>
        <button class="btn btn-sm ${isCompared ? 'btn-primary' : 'btn-outline'}" 
          style="padding:3px 8px;font-size:0.72rem;border-radius:20px;" 
          onclick="event.stopPropagation(); toggleCompareScholarship('${s.id}')"
          title="Compare this scholarship">
          ${isCompared ? '✓ Compared' : '⚖️ Compare'}
        </button>
      </div>
    </div>
    <div class="org-logo" style="background:${s.orgColor};">${s.orgEmoji}</div>
    <h4>${s.title}</h4>
    <p class="org-name">🏢 ${s.organization}</p>
    <div class="amount">${s.amountDisplay}</div>
    <div class="meta">
      <span class="meta-item"><i>📚</i>${levelBadge}</span>
      <span class="meta-item"><i>🏷️</i>${s.category}</span>
      <span class="meta-item"><i>💺</i>${s.seats - s.applied} seats left</span>
    </div>
    <div class="deadline" style="display:flex;justify-content:space-between;align-items:center;">
      <span>🗓️ ${s.deadlineDisplay}</span>
      <button class="btn btn-ghost btn-sm" style="padding:2px 6px;font-size:0.72rem;" title="Add to Google Calendar" onclick="event.stopPropagation(); addToGoogleCalendar('${s.id}')">
        📅 Remind
      </button>
    </div>
    <div class="d-flex gap-1" style="margin-top:12px;">
      ${actionBtn}
      <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation(); viewScholarship('${s.id}')">Details</button>
    </div>
  </div>`;
}

/* ─── Navigation Actions ─── */
window.viewScholarship = (id) => {
  localStorage.setItem('selectedScholarship', id);
  window.location.href = 'scholarship-detail.html';
};

window.applyScholarship = (id) => {
  const scholarship = AppState.scholarships.find(item => item.id === id) || null;
  const externalUrl = getScholarshipApplyUrl(scholarship);

  if (scholarship) {
    showRedirectModal(scholarship.title, externalUrl);
    return;
  }

  if (!AppState.currentUser && !AppState.isDemo) {
    showToast('Please login to apply for scholarships', 'warning');
    setTimeout(() => window.location.href = 'login.html', 1500);
    return;
  }

  const check = canApplyForScholarship(id);
  if (!check.allowed) {
    if (check.reason === 'already_applied') {
      showToast('⚠️ You have already applied for this scholarship! Check your Dashboard.', 'info', 4000);
      return;
    }
    if (check.reason === 'limit_reached') {
      showToast(`⚠️ Application limit reached! You can apply for up to ${MAX_SCHOLARSHIP_APPLICATIONS} scholarships only (${check.count}/${check.max} used). Check your Dashboard.`, 'warning', 5000);
      return;
    }
  }

  localStorage.setItem('applyScholarshipId', id);
  window.location.href = 'apply.html';
};

/* ─── Auth: Login ─── */
function handleLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const btn      = document.getElementById('loginBtn');

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner" style="width:18px;height:18px;border-width:2px;"></span> Signing in...';

  if (AppState.isDemo || !AppState.firebaseReady || typeof auth === 'undefined') {
    setTimeout(() => {
      AppState.currentUser = AppState.mockUser;
      localStorage.setItem('demoUser', JSON.stringify(AppState.mockUser));
      showToast('Welcome back, ' + AppState.mockUser.name + '! 👋', 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 1200);
    }, 1500);
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(uc => {
      AppState.currentUser = uc.user;
      showToast('Welcome back!', 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 800);
    })
    .catch(err => {
      btn.disabled = false;
      btn.innerHTML = 'Sign In';
      document.getElementById('loginError').textContent = getAuthError(err.code);
      document.getElementById('loginError').style.display = 'block';
    });
}

/* ─── Auth: Register ─── */
function handleRegister(e) {
  e.preventDefault();
  const name     = document.getElementById('regName').value;
  const email    = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const btn      = document.getElementById('regBtn');

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner" style="width:18px;height:18px;border-width:2px;"></span> Creating Account...';

  if (AppState.isDemo || !AppState.firebaseReady || typeof auth === 'undefined' || typeof db === 'undefined') {
    setTimeout(() => {
      const user = { ...AppState.mockUser, name, email };
      AppState.currentUser = user;
      localStorage.setItem('demoUser', JSON.stringify(user));
      showToast('Account created! Welcome, ' + name + '! 🎉', 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 1200);
    }, 1800);
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(uc => uc.user.updateProfile({ displayName: name }).then(() => {
      return db.collection('users').doc(uc.user.uid).set({
        name, email, createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }))
    .then(() => {
      showToast('Account created! Welcome! 🎉', 'success');
      setTimeout(() => window.location.href = 'dashboard.html', 800);
    })
    .catch(err => {
      btn.disabled = false;
      btn.innerHTML = 'Create Account';
      document.getElementById('regError').textContent = getAuthError(err.code);
      document.getElementById('regError').style.display = 'block';
    });
}

/* ─── Logout ─── */
window.logout = () => {
  localStorage.removeItem('demoUser');
  AppState.currentUser = null;
  if (!AppState.isDemo && AppState.firebaseReady && typeof auth !== 'undefined') auth.signOut();
  showToast('Logged out successfully', 'success');
  setTimeout(() => window.location.href = 'index.html', 800);
};

/* ─── Auth Error Messages ─── */
function getAuthError(code) {
  const map = {
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}

/* ─── Session Check ─── */
function checkSession() {
  const saved = localStorage.getItem('demoUser');
  if (saved) {
    try { AppState.currentUser = JSON.parse(saved); } catch (e) {}
  }
  if (!AppState.isDemo && typeof auth !== 'undefined') {
    auth.onAuthStateChanged(user => {
      AppState.currentUser = user;
      updateNavForUser(user);
    });
  }
  updateNavForUser(AppState.currentUser);
}

function updateNavForUser(user) {
  const loginBtn   = document.getElementById('navLoginBtn');
  const dashBtn    = document.getElementById('navDashBtn');
  const logoutBtn  = document.getElementById('navLogoutBtn');

  if (user) {
    if (loginBtn)  loginBtn.style.display  = 'none';
    if (dashBtn)   dashBtn.style.display   = 'inline-flex';
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';
  } else {
    if (loginBtn)  loginBtn.style.display  = 'inline-flex';
    if (dashBtn)   dashBtn.style.display   = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
}

/* ─── File Upload Drag & Drop ─── */
function initFileUpload() {
  document.querySelectorAll('.file-upload').forEach(zone => {
    const input = zone.querySelector('input[type="file"]');
    if (!input) return;

    zone.addEventListener('click', () => input.click());
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelected(zone, file);
    });
    input.addEventListener('change', () => {
      if (input.files[0]) handleFileSelected(zone, input.files[0]);
    });
  });
}

function handleFileSelected(zone, file) {
  const maxMB = 5;
  if (file.size > maxMB * 1024 * 1024) {
    showToast(`File too large. Maximum size is ${maxMB}MB`, 'error');
    return;
  }
  zone.innerHTML = `
    <div class="upload-icon">📎</div>
    <p><span>${file.name}</span></p>
    <p style="font-size:0.75rem;color:var(--text-muted);">${(file.size / 1024).toFixed(1)} KB — <a href="#" style="color:var(--primary);" onclick="this.closest('.file-upload').click()">Change</a></p>`;
  showToast(`"${file.name}" selected`, 'success');
}

/* ─── Password Toggle ─── */
function initPasswordToggles() {
  document.querySelectorAll('.input-toggle').forEach(btn => {
    const input = btn.previousElementSibling;
    if (!input) return;
    btn.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.textContent = isPassword ? '🙈' : '👁️';
    });
  });
}

/* ─── Dark Mode / Theme Toggle ─── */
function initThemeToggle() {
  const savedTheme = localStorage.getItem('scholarbridge_theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  // Inject toggle button into navbar actions if not present
  const navActions = document.querySelector('.navbar-actions');
  if (navActions && !document.getElementById('themeToggleBtn')) {
    const btn = document.createElement('button');
    btn.id = 'themeToggleBtn';
    btn.className = 'theme-toggle-btn';
    btn.title = 'Toggle Dark / Light Mode';
    btn.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      if (current === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('scholarbridge_theme', 'light');
        btn.innerHTML = '🌙';
        showToast('Light mode activated ☀️', 'info', 2000);
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('scholarbridge_theme', 'dark');
        btn.innerHTML = '☀️';
        showToast('Dark mode activated 🌙', 'info', 2000);
      }
    });
    navActions.prepend(btn);
  }
}

/* ─── Scholarship Comparison Logic ─── */
window.compareList = [];

window.toggleCompareScholarship = (id) => {
  const idx = window.compareList.indexOf(id);
  if (idx > -1) {
    window.compareList.splice(idx, 1);
    showToast('Scholarship removed from comparison', 'info', 2000);
  } else {
    if (window.compareList.length >= 3) {
      showToast('You can compare up to 3 scholarships at once', 'warning');
      return;
    }
    window.compareList.push(id);
    showToast('Added to comparison! (Select up to 3)', 'success', 2000);
  }
  updateCompareDock();
  if (window.applyFiltersManual) {
    window.applyFiltersManual();
  }
};

window.clearComparison = () => {
  window.compareList = [];
  updateCompareDock();
  if (window.applyFiltersManual) window.applyFiltersManual();
  showToast('Comparison cleared', 'info', 1500);
};

window.updateCompareDock = () => {
  let dock = document.getElementById('compareDock');
  if (!dock) {
    dock = document.createElement('div');
    dock.id = 'compareDock';
    dock.className = 'compare-dock';
    document.body.appendChild(dock);
  }

  if (window.compareList.length > 0) {
    dock.innerHTML = `
      <span>⚖️ Comparing <span class="compare-dock-count">${window.compareList.length}/3</span> Scholarships</span>
      <button class="btn btn-primary btn-sm" onclick="openComparisonModal()">View Comparison</button>
      <button class="btn btn-ghost btn-sm" style="color:rgba(255,255,255,0.7);" onclick="clearComparison()">Clear</button>
    `;
    dock.classList.add('visible');
  } else {
    dock.classList.remove('visible');
  }
};

window.openComparisonModal = () => {
  if (!window.compareList || window.compareList.length === 0) {
    showToast('Please select at least 1 scholarship to compare', 'warning');
    return;
  }
  let modal = document.getElementById('compareModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'compareModal';
    modal.className = 'modal-backdrop';
    document.body.appendChild(modal);
  }

  const items = window.compareList.map(id => AppState.scholarships.find(s => s.id === id)).filter(Boolean);

  modal.innerHTML = `
    <div class="modal" style="max-width:920px;width:95%;max-height:88vh;overflow-y:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <h3>⚖️ Side-by-Side Scholarship Comparison</h3>
        <button class="modal-close" onclick="closeComparisonModal()">✕</button>
      </div>
      <div class="compare-table-wrap">
        <table class="compare-table">
          <thead>
            <tr>
              <th>Feature</th>
              ${items.map(s => `<th>${s.title}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Provider</strong></td>
              ${items.map(s => `<td>${s.orgEmoji} ${s.organization}</td>`).join('')}
            </tr>
            <tr>
              <td><strong>Award Amount</strong></td>
              ${items.map(s => `<td style="color:var(--primary);font-weight:700;">${s.amountDisplay}</td>`).join('')}
            </tr>
            <tr>
              <td><strong>Category</strong></td>
              ${items.map(s => `<td><span class="badge badge-gold">${s.category}</span></td>`).join('')}
            </tr>
            <tr>
              <td><strong>Education Level</strong></td>
              ${items.map(s => `<td>${(s.level || []).join(', ').toUpperCase()}</td>`).join('')}
            </tr>
            <tr>
              <td><strong>Eligibility Criteria</strong></td>
              ${items.map(s => `<td>${s.eligibility}</td>`).join('')}
            </tr>
            <tr>
              <td><strong>Deadline</strong></td>
              ${items.map(s => `<td>🗓️ ${s.deadlineDisplay} (${daysLeft(s.deadline)}d left)</td>`).join('')}
            </tr>
            <tr>
              <td><strong>Seats Available</strong></td>
              ${items.map(s => `<td>${s.seats - s.applied} seats left of ${s.seats}</td>`).join('')}
            </tr>
            <tr>
              <td><strong>Action</strong></td>
              ${items.map(s => `<td><button class="btn btn-primary btn-sm" onclick="closeComparisonModal(); applyScholarship('${s.id}')">Apply Now</button></td>`).join('')}
            </tr>
          </tbody>
        </table>
      </div>
      <div style="margin-top:20px;display:flex;justify-content:space-between;">
        <button class="btn btn-ghost btn-sm" onclick="clearComparison(); closeComparisonModal();">Reset Comparison</button>
        <button class="btn btn-outline" onclick="closeComparisonModal()">Close</button>
      </div>
    </div>
  `;
  modal.classList.add('open');
};

window.closeComparisonModal = () => {
  const modal = document.getElementById('compareModal');
  if (modal) modal.classList.remove('open');
};

/* ─── Calendar Sync Utilities ─── */
window.addToGoogleCalendar = (id) => {
  const s = AppState.scholarships.find(item => item.id === id);
  if (!s) return;
  const deadlineDate = new Date(s.deadline);
  const startStr = deadlineDate.toISOString().replace(/-|:|\.\d\d\d/g, '').substring(0, 8);
  const endStr = startStr;
  const title = encodeURIComponent(`Scholarship Deadline: ${s.title}`);
  const details = encodeURIComponent(`Last date to apply for ${s.title} provided by ${s.organization}.\nAward Amount: ${s.amountDisplay}.\nCheck details at ScholarBridge.`);
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}`;
  window.open(url, '_blank');
  showToast('Opening Google Calendar...', 'info', 1500);
};

window.downloadIcsFile = (id) => {
  const s = AppState.scholarships.find(item => item.id === id);
  if (!s) return;
  const deadlineStr = s.deadline.replace(/-/g, '');
  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ScholarBridge//Scholarship Deadline//EN',
    'BEGIN:VEVENT',
    `SUMMARY:Deadline: ${s.title}`,
    `DESCRIPTION:Last day to submit application for ${s.title} (${s.amountDisplay}).`,
    `DTSTART;VALUE=DATE:${deadlineStr}`,
    `DTEND;VALUE=DATE:${deadlineStr}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${s.id}_deadline.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Calendar reminder (.ics) downloaded! 📅', 'success');
};

/* ─── Stream Selector Helpers ─── */
const STREAM_CLUSTERS = [
  {
    id: 'stem',
    name: 'STEM, AI & Engineering',
    icon: '💻',
    fitScore: '96%',
    description: 'Software Architecture, Artificial Intelligence, Robotics, and Advanced Computing Systems.',
    degrees: ['B.Tech Computer Science', 'B.Tech AI & Data Science', 'B.E. Robotics', 'Int. M.Tech Computing'],
    recommendedSchIds: ['sch014', 'sch008', 'sch010', 'sch001'],
    avgFunding: '₹1,50,000 / yr',
    topCareers: ['AI Systems Engineer', 'Full-stack Architect', 'Robotics Specialist', 'Cloud Security Lead']
  },
  {
    id: 'medical',
    name: 'Medicine & Allied Healthcare',
    icon: '🩺',
    fitScore: '91%',
    description: 'Clinical Medicine, Surgery, Pharmaceutical Sciences, Public Health, and Biotechnology.',
    degrees: ['MBBS', 'BDS', 'B.Pharm', 'B.Sc Biotechnology & Genetics', 'B.Sc Nursing'],
    recommendedSchIds: ['sch007', 'sch010', 'sch001'],
    avgFunding: '₹1,20,000 / yr',
    topCareers: ['Physician / Surgeon', 'Clinical Researcher', 'Biochemist', 'Healthcare Administrator']
  },
  {
    id: 'science',
    name: 'Pure Sciences & Research',
    icon: '🔬',
    fitScore: '89%',
    description: 'Fundamental Physics, Pure Mathematics, Astrophysics, Chemical Sciences, and Deep-tech Research.',
    degrees: ['B.S. / M.S. IISc Bangalore', 'B.Sc Physics Honours', 'Integrated M.Sc Mathematics', 'Ph.D DST Fellow'],
    recommendedSchIds: ['sch011', 'sch003', 'sch012', 'sch015'],
    avgFunding: '₹1,12,000 / yr + Grants',
    topCareers: ['ISRO / DRDO Scientist', 'CERN Fellow', 'Quantitative Analyst', 'Academic Professor']
  },
  {
    id: 'commerce',
    name: 'Commerce, FinTech & Management',
    icon: '📈',
    fitScore: '85%',
    description: 'Chartered Accountancy, Investment Banking, Corporate Finance, Actuarial Science, and FinTech.',
    degrees: ['B.Com Honours', 'BBA Finance', 'CA / CFA Track', 'B.Sc FinTech', 'Integrated MBA'],
    recommendedSchIds: ['sch016', 'sch008', 'sch001'],
    avgFunding: '₹80,000 / yr',
    topCareers: ['Investment Banker', 'Chartered Accountant', 'Risk Strategist', 'Venture Capital Analyst']
  },
  {
    id: 'humanities',
    name: 'Law, Public Policy & Civil Services',
    icon: '⚖️',
    fitScore: '88%',
    description: 'Constitutional Law, Civil Services (UPSC), International Relations, Psychology, and Media.',
    degrees: ['B.A. LL.B (Hons)', 'B.A. Political Science & Policy', 'B.Sc Psychology', 'Masters in Public Policy'],
    recommendedSchIds: ['sch005', 'sch006', 'sch013', 'sch015'],
    avgFunding: '₹95,000 / yr',
    topCareers: ['Judicial Advocate', 'Civil Services Officer (IAS/IFS)', 'Policy Analyst', 'Diplomat']
  }
];

window.STREAM_CLUSTERS = STREAM_CLUSTERS;

/* ─── Awards & Achievements State ─── */
const DEFAULT_AWARDS = [
  {
    id: 'aw1',
    title: 'State Board Merit Top 1% Award',
    organization: 'Maharashtra State Board of Secondary & Higher Education',
    year: '2024',
    icon: '🥇',
    category: 'Academic Merit',
    verified: true,
    hash: 'SHA256: 7f8a92b1...3c4d'
  },
  {
    id: 'aw2',
    title: 'National Science Olympiad (NSO) Gold Medalist',
    organization: 'Science Olympiad Foundation (SOF)',
    year: '2023',
    icon: '🔬',
    category: 'Science & Research',
    verified: true,
    hash: 'SOF-IN-2023-99412'
  },
  {
    id: 'aw3',
    title: 'Smart India Hackathon (SIH) Finalist',
    organization: 'Ministry of Education Innovation Cell & AICTE',
    year: '2025',
    icon: '💻',
    category: 'Innovation & Tech',
    verified: true,
    hash: 'SIH2025-EDTECH-802'
  },
  {
    id: 'aw4',
    title: 'DigiLocker Verified Scholar Credential',
    organization: 'Ministry of Electronics and Information Technology (MeitY)',
    year: '2026',
    icon: '🛡️',
    category: 'e-Governance',
    verified: true,
    hash: 'UIDAI-EPR-12310656'
  }
];

function getAwardsList() {
  try {
    const stored = localStorage.getItem('scholarbridge_awards');
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  try {
    localStorage.setItem('scholarbridge_awards', JSON.stringify(DEFAULT_AWARDS));
  } catch (e) {}
  return DEFAULT_AWARDS;
}

function saveAwardItem(item) {
  const awards = getAwardsList();
  awards.unshift(item);
  try {
    localStorage.setItem('scholarbridge_awards', JSON.stringify(awards));
  } catch (e) {}
  return awards;
}

window.getAwardsList = getAwardsList;
window.saveAwardItem = saveAwardItem;

/* ─── Grievances Helpdesk State ─── */
const DEFAULT_GRIEVANCES = [
  {
    id: 'GRV-2026-8841',
    subject: 'DBT Direct Bank Transfer delay for INSPIRE Scholarship (1st Installment)',
    category: 'DBT & Payment Delay',
    date: '2026-08-28',
    status: 'Under Investigation',
    statusStep: 2, // 1: Submitted, 2: Under Nodal Review, 3: PFMS Processing, 4: Resolved
    nodalOfficer: 'Dr. Suresh Patil (State Nodal Officer - Higher Education)',
    remarks: 'Aadhaar NPCI mapping verified with SBI. Bank reconciliation under process at PFMS portal.'
  }
];

function getGrievanceTickets() {
  try {
    const stored = localStorage.getItem('scholarbridge_grievances');
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  try {
    localStorage.setItem('scholarbridge_grievances', JSON.stringify(DEFAULT_GRIEVANCES));
  } catch (e) {}
  return DEFAULT_GRIEVANCES;
}

function saveGrievanceTicket(ticket) {
  const list = getGrievanceTickets();
  list.unshift(ticket);
  try {
    localStorage.setItem('scholarbridge_grievances', JSON.stringify(list));
  } catch (e) {}
  return list;
}

window.getGrievanceTickets = getGrievanceTickets;
window.saveGrievanceTicket = saveGrievanceTicket;

/* ─── Stream Tab Renderer ─── */
window.renderStreamTab = () => {
  const grid = document.getElementById('streamClustersGrid');
  const roadmapBox = document.getElementById('streamRoadmapBox');
  if (!grid) return;

  // Get selected cluster from storage
  const savedClusterId = localStorage.getItem('scholarbridge_stream_cluster') || 'stem';

  grid.innerHTML = STREAM_CLUSTERS.map(c => {
    const isActive = c.id === savedClusterId;
    return `
    <div class="stream-cluster-card ${isActive ? 'active' : ''} fade-in" 
         onclick="selectStreamCluster('${c.id}')" 
         style="cursor:pointer;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <div style="font-size:1.8rem;">${c.icon}</div>
        <div>
          <div style="font-weight:700;font-size:0.9rem;line-height:1.2;">${c.name}</div>
          <div style="display:flex;align-items:center;gap:6px;margin-top:3px;">
            <span class="badge badge-green" style="font-size:0.68rem;padding:2px 6px;">${c.fitScore} Fit</span>
            ${isActive ? '<span class="badge" style="background:var(--primary);color:white;font-size:0.68rem;padding:2px 6px;">✓ Active</span>' : ''}
          </div>
        </div>
      </div>
      <p style="font-size:0.78rem;color:var(--text-muted);margin:0;line-height:1.4;">${c.description.substring(0, 80)}...</p>
      <div style="margin-top:10px;font-size:0.75rem;color:var(--text-muted);">💰 Avg Funding: <strong style="color:var(--primary);">${c.avgFunding}</strong></div>
    </div>`;
  }).join('');

  renderStreamRoadmap(savedClusterId);
  initScrollAnimations();
};

window.selectStreamCluster = (clusterId) => {
  localStorage.setItem('scholarbridge_stream_cluster', clusterId);
  const cluster = STREAM_CLUSTERS.find(c => c.id === clusterId);
  if (!cluster) return;

  // Update hero
  const heroTitle = document.getElementById('streamHeroTitle');
  const heroDesc = document.getElementById('streamHeroDesc');
  if (heroTitle) heroTitle.textContent = `Recommended Track: ${cluster.name} ${cluster.icon}`;
  if (heroDesc) heroDesc.textContent = cluster.description;

  // Re-render clusters to update active state
  renderStreamTab();
  showToast(`Stream updated to ${cluster.name}! 🧭`, 'success', 2000);
};

window.renderStreamRoadmap = (clusterId) => {
  const box = document.getElementById('streamRoadmapBox');
  if (!box) return;
  const cluster = STREAM_CLUSTERS.find(c => c.id === clusterId) || STREAM_CLUSTERS[0];
  const relatedSchs = AppState.scholarships.filter(s => cluster.recommendedSchIds.includes(s.id)).slice(0, 3);

  box.innerHTML = `
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
    <h4 style="font-size:1rem;margin:0;">${cluster.icon} ${cluster.name} — Career Roadmap</h4>
    <span class="badge badge-green" style="font-size:0.75rem;">${cluster.fitScore} Match Score</span>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:16px;margin-bottom:18px;">
    <div>
      <div style="font-size:0.75rem;text-transform:uppercase;font-weight:700;color:var(--primary);margin-bottom:8px;">🎓 Target Degrees</div>
      ${cluster.degrees.map(d => `<div style="font-size:0.82rem;padding:4px 0;border-bottom:1px solid var(--border-light);">→ ${d}</div>`).join('')}
    </div>
    <div>
      <div style="font-size:0.75rem;text-transform:uppercase;font-weight:700;color:var(--primary);margin-bottom:8px;">💼 Top Careers</div>
      ${cluster.topCareers.map(c => `<div style="font-size:0.82rem;padding:4px 0;border-bottom:1px solid var(--border-light);">⭐ ${c}</div>`).join('')}
    </div>
    <div>
      <div style="font-size:0.75rem;text-transform:uppercase;font-weight:700;color:var(--primary);margin-bottom:8px;">🏅 Linked Scholarships</div>
      ${relatedSchs.length > 0
        ? relatedSchs.map(s => `<div style="font-size:0.82rem;padding:4px 0;border-bottom:1px solid var(--border-light);cursor:pointer;color:var(--primary);" onclick="viewScholarship('${s.id}')">→ ${s.title.substring(0, 28)}...</div>`).join('')
        : '<div style="font-size:0.82rem;color:var(--text-muted);">Explore all scholarships →</div>'
      }
    </div>
  </div>
  <div style="display:flex;gap:10px;flex-wrap:wrap;">
    <a href="scholarships.html" class="btn btn-primary btn-sm">🔍 Find ${cluster.name} Scholarships</a>
    <a href="eligibility.html" class="btn btn-outline btn-sm">✅ Check Eligibility</a>
  </div>`;
};

window.exportStreamRoadmap = () => {
  showToast('Generating your Career Roadmap PDF... 🖨️', 'info', 2000);
  setTimeout(() => {
    window.print();
    showToast('Print dialog opened. Save as PDF for your roadmap! 📄', 'success', 3500);
  }, 500);
};

window.runStreamDiagnostic = () => {
  const subject = document.getElementById('diagSubject')?.value || 'Mathematics & Computer Science';
  const env = document.getElementById('diagEnv')?.value || 'research';
  const diagResult = document.getElementById('diagResult');

  const map = {
    'Mathematics & Computer Science': 'stem',
    'Biology & Life Sciences': 'medical',
    'Physics & Chemistry': 'science',
    'Commerce & Accountancy': 'commerce',
    'History & Political Science': 'humanities',
    'English & Literature': 'humanities',
    'Mechanical / Electrical Engineering': 'stem',
  };

  const suggested = map[subject] || 'stem';
  const cluster = STREAM_CLUSTERS.find(c => c.id === suggested) || STREAM_CLUSTERS[0];

  if (diagResult) {
    diagResult.innerHTML = `
    <div style="background:var(--gradient-soft);border-radius:var(--radius-sm);padding:14px 18px;border:1px solid var(--border-light);">
      <div style="font-size:0.82rem;font-weight:700;margin-bottom:4px;">🎯 Diagnostic Result: <span style="color:var(--primary);">${cluster.name}</span></div>
      <div style="font-size:0.78rem;color:var(--text-muted);">Based on your interests, the <strong>${cluster.name}</strong> track (${cluster.fitScore} fit) is recommended. Average funding: <strong>${cluster.avgFunding}</strong>.</div>
      <button class="btn btn-primary btn-sm" style="margin-top:10px;" onclick="selectStreamCluster('${cluster.id}')">Apply This Track →</button>
    </div>`;
  }
};

/* ─── Assessment Tab Renderer ─── */
window.renderAssessmentTab = () => {
  const simResult = document.getElementById('simForecastAmount');
  if (simResult) updateAssessmentSim();
};

window.updateAssessmentSim = () => {
  const marks = Number(document.getElementById('simMarksRange')?.value || 87.4);
  const income = Number(document.getElementById('simIncomeRange')?.value || 250000);
  const category = document.getElementById('simCategory')?.value || 'obc';
  const state = document.getElementById('simState')?.value || 'maharashtra';

  if (document.getElementById('simMarksVal'))
    document.getElementById('simMarksVal').textContent = marks.toFixed(1) + '%';
  if (document.getElementById('simIncomeVal'))
    document.getElementById('simIncomeVal').textContent = '₹' + income.toLocaleString('en-IN');

  // Calculate eligibility based on sliders
  let eligibleSchemes = 0;
  let totalFunding = 0;

  if (marks >= 75) { eligibleSchemes += 4; totalFunding += 140000; }
  if (marks >= 85) { eligibleSchemes += 3; totalFunding += 100000; }
  if (marks >= 90) { eligibleSchemes += 2; totalFunding += 60000; }
  if (income <= 250000) { eligibleSchemes += 3; totalFunding += 120000; }
  if (income <= 600000) { eligibleSchemes += 2; totalFunding += 45000; }
  if (category === 'sc' || category === 'st') { eligibleSchemes += 3; totalFunding += 80000; }
  if (category === 'obc') { eligibleSchemes += 2; totalFunding += 40000; }
  if (state === 'maharashtra' || state === 'uttar_pradesh') { eligibleSchemes += 1; totalFunding += 25000; }

  const schemeNames = eligibleSchemes >= 10
    ? 'Central Merit, ONGC, Reliance Foundation & 8 more'
    : eligibleSchemes >= 7
      ? 'Central Merit, INSPIRE & PM CARES'
      : 'National Merit & State Board Schemes';

  if (document.getElementById('simForecastAmount'))
    document.getElementById('simForecastAmount').textContent = '₹' + totalFunding.toLocaleString('en-IN') + ' / year';
  if (document.getElementById('simForecastDetail'))
    document.getElementById('simForecastDetail').textContent = `${eligibleSchemes} Eligible Schemes unlocked including ${schemeNames}`;
};

/* ─── Awards Tab Renderer ─── */
window.renderAwardsTab = () => {
  const grid = document.getElementById('awardsListGrid');
  const countBadge = document.getElementById('awardsCountBadge');
  if (!grid) return;

  const awards = getAwardsList();
  if (countBadge) countBadge.textContent = awards.length;

  if (awards.length === 0) {
    grid.innerHTML = `
    <div class="empty-state" style="grid-column:1/-1;">
      <div class="empty-icon">🏆</div>
      <h3>No Credentials Yet</h3>
      <p>Add your academic honors, olympiad medals, and extracurricular achievements.</p>
      <button class="btn btn-primary" onclick="openAddAwardModal()">+ Add First Achievement</button>
    </div>`;
    return;
  }

  const categoryColors = {
    'Academic Merit': { bg: '#fef9c3', color: '#ca8a04' },
    'Science & Research': { bg: '#dbeafe', color: '#1d4ed8' },
    'Innovation & Tech': { bg: '#f3e8ff', color: '#7c3aed' },
    'Sports & Athletics': { bg: '#dcfce7', color: '#16a34a' },
    'Leadership & Social': { bg: '#ffe4e6', color: '#be123c' },
    'e-Governance': { bg: '#e0f2fe', color: '#0369a1' },
  };

  grid.innerHTML = awards.map(a => {
    const col = categoryColors[a.category] || { bg: '#f1f5f9', color: '#475569' };
    return `
    <div class="award-badge-card fade-in">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
        <div style="font-size:2.2rem;">${a.icon || '🏅'}</div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
          ${a.verified ? '<span class="badge badge-green" style="font-size:0.68rem;">✓ Verified</span>' : '<span class="badge badge-gold" style="font-size:0.68rem;">⏳ Pending</span>'}
          <span class="badge" style="background:${col.bg};color:${col.color};font-size:0.68rem;">${a.category}</span>
        </div>
      </div>
      <div style="font-weight:700;font-size:0.92rem;margin-bottom:4px;line-height:1.3;">${a.title}</div>
      <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:8px;">🏢 ${a.organization}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border-light);padding-top:10px;margin-top:auto;">
        <span style="font-size:0.75rem;color:var(--text-muted);">📅 ${a.year}</span>
        <div style="display:flex;gap:6px;">
          ${a.hash ? `<button class="btn btn-ghost btn-sm" style="font-size:0.72rem;padding:2px 8px;" onclick="showToast('Credential ID: ${a.hash}','info',3000)">🔗 Verify</button>` : ''}
          <button class="btn btn-outline btn-sm" style="font-size:0.72rem;padding:2px 8px;" onclick="showToast('Downloading certificate for ${a.title}... 📥','info',2000)">Download</button>
        </div>
      </div>
    </div>`;
  }).join('');

  initScrollAnimations();
};

window.openAddAwardModal = () => {
  const modal = document.getElementById('addAwardModal');
  if (modal) modal.classList.add('open');
};
window.closeAddAwardModal = () => {
  const modal = document.getElementById('addAwardModal');
  if (modal) modal.classList.remove('open');
};

window.handleAddAward = (e) => {
  e.preventDefault();
  const title = document.getElementById('awardTitle').value.trim();
  const org = document.getElementById('awardOrg').value.trim();
  const year = document.getElementById('awardYear').value;
  const category = document.getElementById('awardCategory').value;
  const hash = document.getElementById('awardHash').value.trim();

  const catIconMap = {
    'Academic Merit': '🥇',
    'Science & Research': '🔬',
    'Innovation & Tech': '💻',
    'Sports & Athletics': '🏃',
    'Leadership & Social': '🌟',
  };

  const newAward = {
    id: 'aw_' + Date.now(),
    title,
    organization: org,
    year,
    icon: catIconMap[category] || '🏅',
    category,
    verified: true,
    hash: hash || null
  };

  saveAwardItem(newAward);
  closeAddAwardModal();
  document.getElementById('awardForm').reset();
  renderAwardsTab();
  showToast(`"${title}" added to your Credential Vault! 🏆`, 'success', 3500);
};

window.downloadScholarshipCV = () => {
  showToast('Generating your Official Scholarship CV PDF... 📜', 'info', 2000);
  setTimeout(() => {
    window.print();
    showToast('Print dialog opened. Save as PDF for your scholarship CV! 📄', 'success', 3500);
  }, 600);
};

/* ─── Grievance Tab Renderer ─── */
window.renderGrievanceTab = () => {
  const list = document.getElementById('grievanceTicketsList');
  if (!list) return;

  const tickets = getGrievanceTickets();

  if (tickets.length === 0) {
    list.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">⚖️</div>
      <h3>No Grievances Filed</h3>
      <p>If you face any issues with scholarships, DBT transfers, or portal verification, lodge a formal grievance.</p>
      <button class="btn btn-primary" onclick="openLodgeGrievanceModal()">+ Lodge New Grievance</button>
    </div>`;
    return;
  }

  const stepLabels = ['Submitted', 'Nodal Review', 'PFMS / DTA', 'Resolved'];
  const stepIcons = ['📤', '🔍', '🏦', '✅'];

  list.innerHTML = tickets.map(t => {
    const step = Math.min(Math.max(t.statusStep || 1, 1), 4);
    const statusColors = {
      'Submitted': { bg: '#fef9c3', color: '#ca8a04' },
      'Under Investigation': { bg: '#dbeafe', color: '#1d4ed8' },
      'Resolved': { bg: '#dcfce7', color: '#16a34a' },
      'Escalated': { bg: '#ffe4e6', color: '#be123c' },
    };
    const sc = statusColors[t.status] || { bg: '#f1f5f9', color: '#475569' };

    return `
    <div class="grievance-ticket-card fade-in" style="background:white;border:1px solid var(--border-light);border-radius:var(--radius-md);padding:20px 24px;margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span style="font-weight:800;font-size:0.95rem;color:var(--primary);">${t.id}</span>
            <span class="badge" style="background:${sc.bg};color:${sc.color};font-size:0.7rem;">${t.status}</span>
          </div>
          <div style="font-weight:700;font-size:0.88rem;margin-bottom:2px;">${t.subject}</div>
          <div style="font-size:0.76rem;color:var(--text-muted);">📁 ${t.category} • 📅 Filed: ${t.date}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:0.75rem;color:var(--text-muted);">Nodal Officer</div>
          <div style="font-size:0.78rem;font-weight:600;">${t.nodalOfficer}</div>
        </div>
      </div>

      <!-- Progress Stepper -->
      <div style="display:flex;align-items:center;gap:0;margin-bottom:14px;overflow-x:auto;">
        ${stepLabels.map((label, i) => {
          const idx = i + 1;
          const done = idx < step;
          const current = idx === step;
          return `
          <div style="display:flex;flex-direction:column;align-items:center;min-width:72px;">
            <div style="width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;
              background:${done ? '#22c55e' : current ? 'var(--primary)' : 'var(--surface-2)'};
              color:${done || current ? 'white' : 'var(--text-muted)'};
              border:2px solid ${done ? '#22c55e' : current ? 'var(--primary)' : 'var(--border-light)'};">
              ${done ? '✓' : stepIcons[i]}
            </div>
            <div style="font-size:0.68rem;text-align:center;margin-top:4px;color:${current ? 'var(--primary)' : done ? '#22c55e' : 'var(--text-muted)'};font-weight:${current ? '700' : '400'};">${label}</div>
          </div>
          ${i < stepLabels.length - 1 ? `<div style="flex:1;height:2px;background:${done ? '#22c55e' : 'var(--border-light)'};margin-bottom:18px;min-width:20px;"></div>` : ''}`;
        }).join('')}
      </div>

      ${t.remarks ? `
      <div style="background:var(--surface-2);border-radius:var(--radius-sm);padding:10px 14px;font-size:0.78rem;border-left:3px solid var(--primary);margin-bottom:12px;">
        <strong>📋 Officer Remarks:</strong> ${t.remarks}
      </div>` : ''}

      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-ghost btn-sm" onclick="showToast('Downloading grievance acknowledgment PDF... 📄','info',2000)">📥 Download Acknowledgment</button>
        <button class="btn btn-outline btn-sm" onclick="showToast('Escalation request sent to State Higher Education Department! 🚨','warning',3500)">🚨 Escalate</button>
      </div>
    </div>`;
  }).join('');

  initScrollAnimations();
};

window.openLodgeGrievanceModal = () => {
  const modal = document.getElementById('lodgeGrievanceModal');
  if (modal) modal.classList.add('open');
};
window.closeLodgeGrievanceModal = () => {
  const modal = document.getElementById('lodgeGrievanceModal');
  if (modal) modal.classList.remove('open');
};

window.handleLodgeGrievance = (e) => {
  e.preventDefault();
  const category = document.getElementById('grvCategory').value;
  const scheme = document.getElementById('grvScheme').value.trim();
  const subject = document.getElementById('grvSubject').value.trim();

  const ticketId = `GRV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const newTicket = {
    id: ticketId,
    subject,
    category,
    date: new Date().toISOString().split('T')[0],
    status: 'Submitted',
    statusStep: 1,
    nodalOfficer: 'Assigned within 1 working day',
    remarks: `Grievance filed for: ${scheme}`
  };

  saveGrievanceTicket(newTicket);
  closeLodgeGrievanceModal();
  document.getElementById('grievanceForm').reset();
  renderGrievanceTab();
  showToast(`Grievance ${ticketId} filed successfully! You'll receive an acknowledgment within 24 hours. ⚖️`, 'success', 5000);
};

/* ─── Global Init ─── */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initPageLoader();
  initNavbar();
  initScrollAnimations();
  initFAQ();
  initPasswordToggles();
  initFileUpload();
  checkSession();
  initScholarshipFilter();

  // Attach form handlers
  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  const regForm = document.getElementById('registerForm');
  if (regForm) regForm.addEventListener('submit', handleRegister);
});

