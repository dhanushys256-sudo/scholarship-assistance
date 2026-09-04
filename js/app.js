// =============================================
//  SCHOLARSHIP ASSISTANCE — MAIN APP LOGIC
// =============================================

/* ─── Utility Functions ─── */

// Format currency
const formatCurrency = (n) => '₹' + Number(n).toLocaleString('en-IN');

// Format date
const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

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

/* ─── Create Scholarship Card HTML ─── */
function createScholarshipCard(s) {
  const days = daysLeft(s.deadline);
  const urgency = days < 15 ? 'badge-red' : days < 30 ? 'badge-gold' : 'badge-green';
  const urgencyText = days === 0 ? 'Closed' : days < 15 ? `${days}d left` : `${days}d left`;
  const levelBadge = s.level.includes('postgraduate') ? 'PG' : s.level.includes('undergraduate') ? 'UG' : 'School';
  const isCompared = (window.compareList || []).includes(s.id);

  return `
  <div class="scholarship-card fade-in" onclick="viewScholarship('${s.id}')">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <div class="badge ${urgency}">${urgencyText}</div>
      <button class="btn btn-sm ${isCompared ? 'btn-primary' : 'btn-outline'}" 
        style="padding:3px 8px;font-size:0.72rem;border-radius:20px;" 
        onclick="event.stopPropagation(); toggleCompareScholarship('${s.id}')"
        title="Compare this scholarship">
        ${isCompared ? '✓ Compared' : '⚖️ Compare'}
      </button>
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
      <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); applyScholarship('${s.id}')">Apply Now</button>
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
  if (!AppState.currentUser && !AppState.isDemo) {
    showToast('Please login to apply for scholarships', 'warning');
    setTimeout(() => window.location.href = 'login.html', 1500);
    return;
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

