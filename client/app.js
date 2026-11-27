// Dynamic client logic for Packing Orbit
// APK (Capacitor) me web assets local hote hain — API calls phone par chal rahe Node server par bhejein
const nativeFetch = window.fetch.bind(window);
window.fetch = function (input, init) {
  if (typeof input === 'string' && input.startsWith('/api/') && window.PackingOrbitNative) {
    return nativeFetch('http://127.0.0.1:3000' + input, init);
  }
  return nativeFetch(input, init);
};

let currentUser = null;
let firmCache = [];
let firmBrandCache = 'Packing Orbit';
let selectedFirmId = null;
let ledgerCustomers = [];
let adminCustomers = [];
let selectedLedgerCustomer = null;
let ledgerEntries = [];
let selectedEditCustomer = null;

// ===== PRICING CONFIG — EDIT THESE VALUES LATER =====
// Lifetime = one-time license fee. AMC = annual maintenance charge (renewed every year).
const PRICING_CONFIG = {
  lifetimePrice: '₹XX,XXX',        // e.g. '₹50,000'
  amcPrice: '₹X,XXX',              // e.g. '₹10,000'
  contactPhone: '+91 XXXXX XXXXX', // display number
  contactTel: '+91XXXXXXXXXX',     // tel: link number (digits with +)
  contactWhatsApp: '91XXXXXXXXXX', // WhatsApp number without +
  contactEmail: 'support@packingorbit.in'
};

function applyPricingConfig() {
  const lifetimeEl = document.getElementById('pricingLifetimePrice');
  const amcEl = document.getElementById('pricingAmcPrice');
  const phoneEl = document.getElementById('pricingContactPhone');
  const contactLink = document.getElementById('pricingContactLink');
  const contactsPhone = document.getElementById('contactsPhoneValue');
  const contactsPhoneLink = document.getElementById('contactsPhoneLink');
  const contactsEmail = document.getElementById('contactsEmailValue');
  const contactsEmailLink = document.getElementById('contactsEmailLink');

  if (lifetimeEl) lifetimeEl.textContent = PRICING_CONFIG.lifetimePrice;
  if (amcEl) amcEl.textContent = PRICING_CONFIG.amcPrice;
  if (phoneEl) phoneEl.textContent = PRICING_CONFIG.contactPhone;
  if (contactLink) contactLink.href = `tel:${PRICING_CONFIG.contactTel}`;
  if (contactsPhone) contactsPhone.textContent = PRICING_CONFIG.contactPhone;
  if (contactsPhoneLink) contactsPhoneLink.href = `tel:${PRICING_CONFIG.contactTel}`;
  if (contactsEmail) contactsEmail.textContent = PRICING_CONFIG.contactEmail;
  if (contactsEmailLink) contactsEmailLink.href = `mailto:${PRICING_CONFIG.contactEmail}`;
}

function contactPricing() {
  const wa = PRICING_CONFIG.contactWhatsApp;
  if (!wa || /X/i.test(wa)) {
    alert('Quotation ke liye contact number abhi configure nahi hua hai. Please PRICING_CONFIG mein number update karein.');
    return;
  }
  const msg = encodeURIComponent('Hello, mujhe Packing Orbit ka lifetime license + AMC pricing chahiye.');
  window.open(`https://wa.me/${wa}?text=${msg}`, '_blank');
}

// ===== HEADER TABS NAVIGATION =====
function setActiveTab(tab) {
  document.querySelectorAll('.header-tab').forEach((el) => {
    el.classList.toggle('active', el.getAttribute('data-tab') === tab);
  });
}

function switchTab(tab) {
  // Ledger (and its sub-menus) are admin-only; Inward/Outward are for Admin + Employee
  if (tab.startsWith('ledger') && !(currentUser && currentUser.role === 'admin')) {
    tab = 'home';
  }
  if ((tab === 'inward' || tab === 'outward') &&
      !(currentUser && ['admin', 'employee'].includes(currentUser.role))) {
    tab = 'home';
  }

  const pageMap = {
    pricing: 'pricingPage',
    ledger: 'ledgerPage',
    inward: 'inwardPage',
    outward: 'outwardPage',
    ledgerCreate: 'ledgerCreatePage',
    ledgerEdit: 'ledgerEditPage',
    ledgerDelete: 'ledgerDeletePage',
    download: 'downloadPage',
    help: 'helpPage',
    contacts: 'contactsPage'
  };

  ['authGateContainer', 'protectedDashboard', 'adminControlPanelPage', 'pricingPage', 'ledgerPage', 'ledgerCreatePage', 'ledgerEditPage', 'ledgerDeletePage', 'inwardPage', 'outwardPage', 'downloadPage', 'helpPage', 'contactsPage']
    .forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

  setActiveTab(tab);
  closeSidebar();

  if (tab === 'home') {
    if (currentUser) {
      const dashboard = document.getElementById('protectedDashboard');
      if (dashboard) {
        dashboard.classList.remove('panel-open');
        dashboard.style.display = 'block';
      }
    } else {
      const authGate = document.getElementById('authGateContainer');
      if (authGate) authGate.style.display = 'flex';
    }
  } else {
    const pageId = pageMap[tab];
    const pageEl = pageId ? document.getElementById(pageId) : null;
    if (pageEl) pageEl.style.display = 'block';
  }

  if (tab === 'ledgerCreate') loadLedgerCustomers();
  if (tab === 'inward') { loadInwardCustomers(); loadInwardList(); }
  if (tab === 'ledgerEdit' || tab === 'ledgerDelete') {
    const editWrap = document.getElementById('ledgerEditFormWrap');
    if (editWrap) editWrap.style.display = 'none';
    loadLedgerCustomers();
    loadLedgerEntries();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Open / close the standalone Pricing page (visible to everyone)
function openPricingPage() {
  switchTab('pricing');
}

function closePricingPage() {
  switchTab('home');
}

// ===== ADMIN CONTROL PANEL (all admin cards in one place) =====
function openAdminControlPanel() {
  if (!currentUser || currentUser.role !== 'admin') return;

  const dashboard = document.getElementById('protectedDashboard');
  const panel = document.getElementById('adminControlPanelPage');
  if (dashboard) {
    dashboard.style.display = 'block';
    dashboard.classList.add('panel-open');
  }
  if (panel) panel.style.display = 'block';
  loadAdminLabourList();
  loadAdminLoginLogs();
  loadAdminFirmList();
  loadAdminCustomerList();
  loadAdminTransportList();
  closeSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeAdminControlPanel() {
  const panel = document.getElementById('adminControlPanelPage');
  const dashboard = document.getElementById('protectedDashboard');
  if (panel) panel.style.display = 'none';
  if (dashboard && currentUser) {
    dashboard.classList.remove('panel-open');
    dashboard.style.display = 'block';
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Admin-only customer list (PIN shown to admin; firm-scoped)
async function loadAdminCustomerList() {
  const token = sessionStorage.getItem('packing_orbit_session');
  const tbody = document.getElementById('customerListBody');
  if (!token || !tbody) return;

  const firmId = (currentUser && currentUser.firmId) ? currentUser.firmId : (firmCache[0] ? firmCache[0].id : null);
  const query = firmId ? `?firmId=${encodeURIComponent(firmId)}` : '';

  try {
    const res = await fetch(`/api/admin/customers${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!result.success) return;

    const customers = result.data || [];
    adminCustomers = customers;
    if (!customers.length) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#9ca3af;">Is firm ka koi customer register nahi hua.</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    customers.forEach((c) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(c.identifier)}</td>
        <td>${escapeHtml(c.party_name || c.full_name)}</td>
        <td>${escapeHtml(c.firm_name || '—')}</td>
        <td><strong>${escapeHtml(c.pin)}</strong></td>
        <td><span class="status-tag ${c.is_active ? 'status-active' : 'status-inactive'}">${c.is_active ? 'Active' : 'Inactive'}</span></td>
        <td><button class="btn-action-reinstate" onclick="openCustomerEdit(${c.id})">Edit</button></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error loading firm customers:', err);
  }
}

// Admin-only transport list for Outward
async function loadAdminTransportList() {
  const token = sessionStorage.getItem('packing_orbit_session');
  const tbody = document.getElementById('transportTableBody');
  if (!token || !tbody) return;

  const firmId = (currentUser && currentUser.firmId) ? currentUser.firmId : (firmCache[0] ? firmCache[0].id : null);
  const query = firmId ? `?firmId=${encodeURIComponent(firmId)}` : '';

  try {
    const res = await fetch(`/api/admin/transports${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!result.success) return;
    const transports = result.data || [];
    if (!transports.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#9ca3af;">Koi transport add nahi kiya gaya.</td></tr>';
      return;
    }
    tbody.innerHTML = '';
    transports.forEach((t) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(t.name)}</td>
        <td>${escapeHtml(t.mobile)}</td>
        <td>${escapeHtml(t.vehicle_no || '—')}</td>
        <td>${escapeHtml(t.gstin || '—')}</td>
        <td>${escapeHtml(t.address || '—')}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error loading transports:', err);
  }
}

// ===== LOGIN: ACTIVE FIRM / PAID LICENSE SELECTION =====
function initFirmSelection() {
  const firmSelect = document.getElementById('firmSelect');
  const firmTrigger = document.getElementById('firmSelectTrigger');
  const firmOptions = document.getElementById('firmSelectOptions');
  const firmPlaceholder = document.getElementById('firmSelectPlaceholder');
  if (!firmSelect || !firmTrigger || !firmOptions || !firmPlaceholder) return;

  const closeFirmDropdown = () => {
    firmOptions.classList.remove('open');
    firmTrigger.classList.remove('open');
  };

  firmTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = firmOptions.classList.contains('open');
    if (isOpen) {
      closeFirmDropdown();
    } else {
      firmOptions.classList.add('open');
      firmTrigger.classList.add('open');
    }
  });

  firmOptions.addEventListener('click', (e) => {
    const option = e.target.closest('.select-option');
    if (!option) return;

    const id = parseInt(option.getAttribute('data-firm-id'), 10);
    if (!id) return;

    selectedFirmId = id;
    firmPlaceholder.textContent = option.textContent.trim();
    firmOptions.querySelectorAll('.select-option').forEach((el) => el.classList.remove('selected'));
    option.classList.add('selected');
    closeFirmDropdown();
  });

  document.addEventListener('click', (e) => {
    if (!firmSelect.contains(e.target)) closeFirmDropdown();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeFirmDropdown();
  });

  loadFirmOptions();
}

async function loadFirmOptions() {
  const firmOptions = document.getElementById('firmSelectOptions');
  const firmPlaceholder = document.getElementById('firmSelectPlaceholder');
  const firmHint = document.getElementById('firmSelectHint');
  if (!firmOptions || !firmPlaceholder) return;

  try {
    const res = await fetch('/api/firms/active');
    const result = await res.json();
    const firms = (result.success && Array.isArray(result.data)) ? result.data : [];

    firmOptions.innerHTML = '';
    selectedFirmId = null;

    if (firms.length === 0) {
      firmPlaceholder.textContent = 'Koi active firm license nahi';
      if (firmHint) firmHint.textContent = 'Admin pehle Firm & License Management se firm create kare.';
      return;
    }

    firms.forEach((firm, index) => {
      const option = document.createElement('div');
      option.className = `select-option${index === 0 ? ' selected' : ''}`;
      option.setAttribute('data-firm-id', firm.id);

      const typeLabel = firm.license_type === 'owner'
        ? 'Owner'
        : firm.license_type === 'testing'
          ? 'Testing'
          : 'Lifetime';
      option.textContent = `${firm.firm_name} — ${typeLabel}`;
      firmOptions.appendChild(option);
    });

    selectedFirmId = firms[0].id;
    firmPlaceholder.textContent = firmOptions.firstElementChild.textContent;
    if (firmHint) {
      firmHint.textContent = `${firms.length} active firm license available. Login usi firm ke context mein hoga.`;
    }
  } catch (err) {
    firmPlaceholder.textContent = 'Firm list load nahi hui';
    if (firmHint) firmHint.textContent = 'Server connection check karein.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  applyPricingConfig();
  initFirmSelection();
  initSystemInfo();
  initNavigation();
  initSidebarDrawer();
  initMandatoryAuthGate();
  initAdminFeatures();
  initLedgerCreateForm();
  initLedgerEditDelete();
  initInwardForm();
});

// 1. Fetch system information from backend API
async function initSystemInfo() {
  try {
    const res = await fetch('/api/info');
    if (!res.ok) throw new Error('API network response error');
    
    const result = await res.json();
    if (result.success && result.data) {
      const data = result.data;
      if (data.app_name) {
        document.getElementById('appName').textContent = data.app_name;
        const footerName = document.getElementById('brandFooterName');
        if (footerName) footerName.textContent = data.app_name;
        const firmBrand = document.getElementById('firmBrandName');
        if (firmBrand) firmBrand.textContent = data.app_name;
        firmBrandCache = data.app_name;
      }
      if (data.tagline) document.getElementById('appTagline').textContent = data.tagline;
      if (data.version) document.getElementById('systemVersion').textContent = data.version;
    }
  } catch (error) {
    console.warn('Backend API connection notice:', error.message);
    const statusLabel = document.getElementById('systemStatus');
    if (statusLabel) {
      statusLabel.textContent = 'Offline';
      statusLabel.style.color = '#ef4444';
    }
  }
}

// 2. Load Nav Menus dynamically
async function initNavigation() {
  try {
    const res = await fetch('/api/menus');
    if (!res.ok) throw new Error('Failed to load navigation menus');

    const result = await res.json();
    if (result.success && Array.isArray(result.data)) {
      renderNavMenus(result.data);
    }
  } catch (err) {
    console.error('Menu load error:', err);
  }
}

function renderNavMenus(menus) {
  const navList = document.getElementById('navList');
  if (!navList) return;

  navList.innerHTML = '';

  menus.forEach((menu, index) => {
    const li = document.createElement('li');
    li.className = `nav-item ${index === 0 ? 'active' : ''}`;
    li.setAttribute('data-menu', menu.key_name);

    li.innerHTML = `
      <a href="#${menu.key_name}" class="nav-link">
        <span class="nav-icon">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        </span>
        <span class="nav-label">${menu.label}</span>
      </a>
    `;

    li.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      li.classList.add('active');

      const currentView = document.getElementById('currentViewName');
      if (currentView) currentView.textContent = menu.label;

      switchTab('home');
    });

    navList.appendChild(li);
  });

  // Ledger is admin-only — injected by syncLedgerNavItem() based on role

  // Always append Pricing (visible to everyone, opens standalone page)
  const pricingLi = document.createElement('li');
  pricingLi.className = 'nav-item';
  pricingLi.setAttribute('data-menu', 'pricing');
  pricingLi.innerHTML = `
    <a href="#pricing" class="nav-link">
      <span class="nav-icon">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7.01" y2="7"></line>
        </svg>
      </span>
      <span class="nav-label">Pricing</span>
    </a>
  `;
  pricingLi.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    pricingLi.classList.add('active');
    openPricingPage();
  });
  navList.appendChild(pricingLi);

  // Admin-only sidebar entry (never rendered for employees/customers/guests)
  syncAdminNavItem();
  // Admin-only Ledger placeholder (Dashboard → Ledger → Pricing)
  syncLedgerNavItem();
  syncOpsNavItems();
}

// Ledger and all its future sub-menus are ADMIN ONLY
function syncLedgerNavItem() {
  const navList = document.getElementById('navList');
  if (!navList) return;

  const existing = navList.querySelector('.nav-item[data-menu="ledger"]');
  const isAdmin = !!(currentUser && currentUser.role === 'admin');

  if (!isAdmin) {
    if (existing) existing.remove();
    return;
  }
  if (existing) return;

  const ledgerLi = document.createElement('li');
  ledgerLi.className = 'nav-item ledger-parent expanded';
  ledgerLi.setAttribute('data-menu', 'ledger');
  ledgerLi.innerHTML = `
    <a href="#ledger" class="nav-link">
      <span class="nav-icon">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          <line x1="9" y1="7" x2="16" y2="7"></line>
          <line x1="9" y1="11" x2="16" y2="11"></line>
        </svg>
      </span>
      <span class="nav-label">Ledger</span>
      <span class="nav-soon">Soon</span>
      <svg class="ledger-chevron" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </a>
    <ul class="nav-sublist">
      <li class="nav-subitem" data-sub-menu="ledgerCreate">
        <a href="#ledger-create" class="nav-link">
          <span class="nav-label">Create</span>
          <span class="nav-soon">Soon</span>
        </a>
      </li>
      <li class="nav-subitem" data-sub-menu="ledgerEdit">
        <a href="#ledger-edit" class="nav-link">
          <span class="nav-label">Edit / Alter</span>
          <span class="nav-soon">Soon</span>
        </a>
      </li>
      <li class="nav-subitem" data-sub-menu="ledgerDelete">
        <a href="#ledger-delete" class="nav-link">
          <span class="nav-label">Delete</span>
          <span class="nav-soon">Soon</span>
        </a>
      </li>
    </ul>
  `;
  ledgerLi.addEventListener('click', (e) => {
    if (e.target.closest('.nav-subitem')) return;
    e.preventDefault();
    ledgerLi.classList.toggle('expanded');
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    ledgerLi.classList.add('active');
    switchTab('ledger');
  });

  ledgerLi.querySelectorAll('.nav-subitem').forEach((sub) => {
    sub.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      document.querySelectorAll('.nav-item, .nav-subitem').forEach(el => el.classList.remove('active'));
      ledgerLi.classList.add('active');
      sub.classList.add('active');
      switchTab(sub.getAttribute('data-sub-menu'));
    });
  });

  // Keep the order: Dashboard → Ledger → Pricing → Admin Control Panel
  const pricingLi = navList.querySelector('.nav-item[data-menu="pricing"]');
  if (pricingLi) navList.insertBefore(ledgerLi, pricingLi);
  else navList.appendChild(ledgerLi);
}

// Inward / Outward placeholders — Admin + Employee (Labour) only, after Ledger before Pricing
function syncOpsNavItems() {
  const navList = document.getElementById('navList');
  if (!navList) return;

  const canAccess = !!(currentUser && ['admin', 'employee'].includes(currentUser.role));
  ['inward', 'outward'].forEach((key) => {
    const existing = navList.querySelector(`.nav-item[data-menu="${key}"]`);
    if (!canAccess) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;

    const labels = { inward: 'Inward', outward: 'Outward' };
    const paths = {
      inward: '<line x1="12" y1="3" x2="12" y2="15"></line><polyline points="7 10 12 15 17 10"></polyline><path d="M5 21h14"></path>',
      outward: '<line x1="12" y1="15" x2="12" y2="3"></line><polyline points="7 8 12 3 17 8"></polyline><path d="M5 21h14"></path>'
    };
    const li = document.createElement('li');
    li.className = 'nav-item';
    li.setAttribute('data-menu', key);
    li.innerHTML = `
      <a href="#${key}" class="nav-link">
        <span class="nav-icon">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none">${paths[key]}</svg>
        </span>
        <span class="nav-label">${labels[key]}</span>
        <span class="nav-soon">Soon</span>
      </a>
    `;
    li.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      li.classList.add('active');
      switchTab(key);
    });

    const ledgerLi = navList.querySelector('.nav-item[data-menu="ledger"]');
    const pricingLi = navList.querySelector('.nav-item[data-menu="pricing"]');
    if (ledgerLi) {
      // insert after Ledger, keeping Inward before Outward
      if (key === 'outward') {
        const inwardLi = navList.querySelector('.nav-item[data-menu="inward"]');
        if (inwardLi) inwardLi.after(li);
        else ledgerLi.after(li);
      } else {
        ledgerLi.after(li);
      }
    } else if (pricingLi) {
      navList.insertBefore(li, pricingLi);
    } else {
      navList.appendChild(li);
    }
  });
}

// Add or remove the Admin Control Panel item in the left sidebar based on role
function syncAdminNavItem() {
  const navList = document.getElementById('navList');
  if (!navList) return;

  const existing = navList.querySelector('.nav-item[data-menu="admin-control"]');
  const isAdmin = !!(currentUser && currentUser.role === 'admin');

  if (!isAdmin) {
    if (existing) existing.remove();
    return;
  }
  if (existing) return;

  const adminLi = document.createElement('li');
  adminLi.className = 'nav-item';
  adminLi.setAttribute('data-menu', 'admin-control');
  adminLi.innerHTML = `
    <a href="#admin-control" class="nav-link">
      <span class="nav-icon">
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .66.39 1.26 1 1.51H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </span>
      <span class="nav-label">Admin Control Panel</span>
    </a>
  `;
  adminLi.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    adminLi.classList.add('active');
    const currentView = document.getElementById('currentViewName');
    if (currentView) currentView.textContent = 'Admin Control Panel';
    openAdminControlPanel();
  });
  navList.appendChild(adminLi);
}

// 3. Mobile Sidebar Drawer Handlers
function initSidebarDrawer() {
  const toggleBtn = document.getElementById('menuToggleBtn');
  const closeBtn = document.getElementById('sidebarCloseBtn');
  const backdrop = document.getElementById('sidebarBackdrop');

  if (toggleBtn) toggleBtn.addEventListener('click', () => {
    // Only open if user is logged in
    if (!currentUser) {
      alert('Kripya pehle account login kijiye!');
      return;
    }
    openSidebar();
  });
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);
}

function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (sidebar) sidebar.classList.add('open');
  if (backdrop) backdrop.classList.add('active');
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (sidebar) sidebar.classList.remove('open');
  if (backdrop) backdrop.classList.remove('active');
}

// 4. MANDATORY LOGIN GATE (App start hamesha login screen se hoga)
async function initMandatoryAuthGate() {
  const form = document.getElementById('mainLoginForm');

  // Handle Login submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const identifier = document.getElementById('mainLoginIdentifier').value;
      const password = document.getElementById('mainLoginPassword').value;
      const errorMsg = document.getElementById('mainLoginErrorMsg');
      const submitBtn = document.getElementById('mainLoginSubmitBtn');

      errorMsg.style.display = 'none';

      if (!selectedFirmId) {
        errorMsg.textContent = 'Kripya pehle firm select karein.';
        errorMsg.style.display = 'block';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Verifying credentials...';

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password, firmId: selectedFirmId })
        });

        const data = await res.json();

        if (data.success && data.token) {
          sessionStorage.setItem('packing_orbit_session', data.token);
          currentUser = data.user;
          renderAppUI(currentUser);
        } else {
          errorMsg.textContent = data.message || 'Login failed';
          errorMsg.style.display = 'block';
        }
      } catch (err) {
        errorMsg.textContent = 'Server error: ' + err.message;
        errorMsg.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = 'Login to Account';
      }
    });
  }

  // Handle Logout (delegated from header pill so it survives re-render)
  const authHeaderContainerLogout = document.getElementById('authHeaderContainer');
  if (authHeaderContainerLogout) {
    authHeaderContainerLogout.addEventListener('click', async (e) => {
      const logoutBtn = e.target.closest('#logoutBtn');
      if (!logoutBtn) return;
      const token = sessionStorage.getItem('packing_orbit_session');
      if (token) {
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          });
        } catch (e) {
          console.warn('Logout API err:', e);
        }
      }
      sessionStorage.removeItem('packing_orbit_session');
      currentUser = null;
      renderAppUI(null);
      loadFirmOptions();
    });
  }

  // Silent session restore — refresh par logout na ho
  const savedSession = sessionStorage.getItem('packing_orbit_session');
  if (savedSession) {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${savedSession}` }
      });
      const result = await res.json();
      if (result.authenticated && result.user) {
        currentUser = {
          id: result.user.id,
          identifier: result.user.identifier,
          fullName: result.user.fullName,
          role: result.user.role,
          partyName: result.user.partyName,
          loginTimeIST: result.user.loginTimeIST,
          firmId: result.user.firmId || null,
          firmName: result.user.firmName || null,
          licenseType: result.user.licenseType || null
        };
        sessionStorage.setItem('packing_orbit_session', savedSession);
        renderAppUI(currentUser);
        loadFirmOptions();
        return;
      }
    } catch (err) {
      console.warn('Session restore failed:', err);
    }
  }

  // Clear previous persistent logins so every app launch starts at Login Screen
  sessionStorage.removeItem('packing_orbit_session');
  renderAppUI(null);
}

// ===== LEDGER > CREATE — searchable firm-customer dropdown + form =====
function initLedgerCreateForm() {
  const selectWrap = document.getElementById('ledgerCustomerSelect');
  const trigger = document.getElementById('ledgerCustomerTrigger');
  const options = document.getElementById('ledgerCustomerOptions');
  const search = document.getElementById('ledgerCustomerSearch');
  const list = document.getElementById('ledgerCustomerList');
  const placeholder = document.getElementById('ledgerCustomerPlaceholder');
  const form = document.getElementById('ledgerCreateForm');
  const errBox = document.getElementById('ledgerErrorMsg');
  if (!selectWrap || !trigger || !options || !search || !list || !placeholder || !form) return;

  const closeOptions = () => {
    options.classList.remove('open');
    trigger.classList.remove('open');
  };

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const willOpen = !options.classList.contains('open');
    options.classList.toggle('open', willOpen);
    trigger.classList.toggle('open', willOpen);
    if (willOpen) {
      search.value = '';
      renderLedgerCustomerOptions('');
      search.focus();
    }
  });

  search.addEventListener('input', () => renderLedgerCustomerOptions(search.value.trim()));

  options.addEventListener('click', (e) => {
    const option = e.target.closest('.select-option');
    if (!option || option.classList.contains('disabled')) return;
    selectedLedgerCustomer = {
      id: parseInt(option.getAttribute('data-customer-id'), 10),
      mobile: option.getAttribute('data-mobile'),
      partyName: option.getAttribute('data-party')
    };
    placeholder.textContent = `${selectedLedgerCustomer.mobile} — ${selectedLedgerCustomer.partyName}`;
    placeholder.classList.remove('select-placeholder');
    closeOptions();
  });

  document.addEventListener('click', (e) => {
    if (!selectWrap.contains(e.target)) closeOptions();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOptions();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (errBox) errBox.style.display = 'none';

    if (!selectedLedgerCustomer) {
      if (errBox) { errBox.textContent = 'Customer select karein (searchable dropdown se).'; errBox.style.display = 'block'; }
      return;
    }

    const firmId = (currentUser && currentUser.firmId) ? currentUser.firmId : null;
    const payload = {
      firmId,
      customerId: selectedLedgerCustomer.id,
      customerCode: document.getElementById('ledgerCustomerCode').value.trim(),
      token: document.getElementById('ledgerToken').value.trim(),
      type: document.getElementById('ledgerType').value,
      quality: document.getElementById('ledgerQuality').value.trim(),
      takhaBales: document.getElementById('ledgerTakhaBales').value
    };

    if (!payload.customerCode || !payload.token || !payload.type || !payload.quality || !payload.takhaBales) {
      if (errBox) { errBox.textContent = 'Saari required fields bharin.'; errBox.style.display = 'block'; }
      return;
    }

    const token = sessionStorage.getItem('packing_orbit_session');
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    try {
      const res = await fetch('/api/admin/ledger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || 'Ledger entry create ho gayi!');
        form.reset();
        selectedLedgerCustomer = null;
        placeholder.textContent = 'Customer select karein...';
        placeholder.classList.add('select-placeholder');
        closeOptions();
      } else {
        if (errBox) { errBox.textContent = data.message || 'Ledger entry create nahi ho payi.'; errBox.style.display = 'block'; }
      }
    } catch (err) {
      if (errBox) { errBox.textContent = 'Server error: ' + err.message; errBox.style.display = 'block'; }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

function renderLedgerCustomerOptions(query) {
  const list = document.getElementById('ledgerCustomerList');
  if (!list) return;
  const q = String(query || '').toLowerCase();
  const matches = ledgerCustomers.filter((c) => {
    const label = `${c.identifier} ${c.party_name || c.full_name}`.toLowerCase();
    return label.includes(q);
  });

  if (!matches.length) {
    list.innerHTML = '<div class="select-option disabled">Koi customer nahi mila.</div>';
    return;
  }

  list.innerHTML = '';
  matches.forEach((c) => {
    const option = document.createElement('div');
    option.className = 'select-option';
    option.setAttribute('data-customer-id', c.id);
    option.setAttribute('data-mobile', c.identifier);
    option.setAttribute('data-party', c.party_name || c.full_name);
    option.textContent = `${c.identifier} — ${c.party_name || c.full_name}`;
    list.appendChild(option);
  });
}

async function loadLedgerCustomers() {
  const token = sessionStorage.getItem('packing_orbit_session');
  const placeholder = document.getElementById('ledgerCustomerPlaceholder');
  if (!token) return;
  const firmId = (currentUser && currentUser.firmId) ? currentUser.firmId : null;
  const query = firmId ? `?firmId=${encodeURIComponent(firmId)}` : '';

  try {
    const res = await fetch(`/api/admin/customers${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    ledgerCustomers = (result.success && Array.isArray(result.data)) ? result.data : [];
    if (placeholder) placeholder.textContent = ledgerCustomers.length ? 'Customer select karein...' : 'Koi registered customer nahi';
    renderLedgerCustomerOptions(document.getElementById('ledgerCustomerSearch')?.value || '');
    renderEditCustomerOptions(document.getElementById('editLedgerCustomerSearch')?.value || '');
  } catch (err) {
    console.error('Ledger customer load error:', err);
  }
}

// ===== LEDGER > EDIT / ALTER + DELETE =====
async function loadLedgerEntries() {
  const token = sessionStorage.getItem('packing_orbit_session');
  if (!token) return;
  const firmId = (currentUser && currentUser.firmId) ? currentUser.firmId : null;
  const query = firmId ? `?firmId=${encodeURIComponent(firmId)}` : '';

  try {
    const res = await fetch(`/api/admin/ledger${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    ledgerEntries = (result.success && Array.isArray(result.data)) ? result.data : [];
    renderLedgerTables();
  } catch (err) {
    console.error('Ledger entries load error:', err);
  }
}

function renderLedgerTables() {
  const build = (action) => {
    if (!ledgerEntries.length) {
      return '<p style="color:#9ca3af; text-align:center;">Is firm ki koi ledger entry nahi.</p>';
    }
    let html = '<table class="data-table"><thead><tr>' +
      '<th>Customer</th><th>Code</th><th>Token</th><th>Type</th><th>Quality</th><th>Takha / Bales</th><th>Records</th><th>Action</th>' +
      '</tr></thead><tbody>';
    ledgerEntries.forEach((e) => {
      const count = e.record_count || 0;
      html += `<tr>
        <td>${escapeHtml(e.mobile)}<br><span style="font-size:0.68rem; color:#9ca3af;">${escapeHtml(e.party_name)}</span></td>
        <td>${escapeHtml(e.customer_code)}</td>
        <td>${escapeHtml(e.token)}</td>
        <td>${escapeHtml(e.type)}</td>
        <td>${escapeHtml(e.quality)}</td>
        <td>${escapeHtml(e.takha_bales)}</td>
        <td>${count > 0 ? `<strong style="color:#fbbf24;">${count}</strong>` : '<span style="color:#9ca3af;">0</span>'}</td>
        <td>${action === 'edit'
          ? `<button class="btn-action-reinstate" onclick="openLedgerEdit(${e.id})">Edit</button>
             <button class="btn-action-reinstate" onclick="addLedgerRecord(${e.id})">+ Record</button>
             ${count > 0 ? `<button class="btn-action-reinstate" onclick="manageLedgerRecords(${e.id})">Records (${count})</button>` : ''}`
          : (count > 0
            ? `<span style="font-size:0.65rem; color:#f87171;">Records hain — delete blocked</span>`
            : `<button class="btn-action-remove" onclick="deleteLedgerEntry(${e.id})">Delete</button>`)}</td>
      </tr>`;
    });
    return html + '</tbody></table>';
  };

  const editList = document.getElementById('ledgerEditList');
  const deleteList = document.getElementById('ledgerDeleteList');
  if (editList) editList.innerHTML = build('edit');
  if (deleteList) deleteList.innerHTML = build('delete');
}

function renderEditCustomerOptions(query) {
  const list = document.getElementById('editLedgerCustomerList');
  if (!list) return;
  const q = String(query || '').toLowerCase();
  const matches = ledgerCustomers.filter((c) =>
    `${c.identifier} ${c.party_name || c.full_name}`.toLowerCase().includes(q)
  );
  if (!matches.length) {
    list.innerHTML = '<div class="select-option disabled">Koi customer nahi mila.</div>';
    return;
  }
  list.innerHTML = '';
  matches.forEach((c) => {
    const option = document.createElement('div');
    option.className = 'select-option';
    option.setAttribute('data-customer-id', c.id);
    option.textContent = `${c.identifier} — ${c.party_name || c.full_name}`;
    list.appendChild(option);
  });
}

function initLedgerEditDelete() {
  const selectWrap = document.getElementById('editLedgerCustomerSelect');
  const trigger = document.getElementById('editLedgerCustomerTrigger');
  const options = document.getElementById('editLedgerCustomerOptions');
  const search = document.getElementById('editLedgerCustomerSearch');
  const placeholder = document.getElementById('editLedgerCustomerPlaceholder');
  const form = document.getElementById('ledgerEditForm');
  const errBox = document.getElementById('editLedgerErrorMsg');
  const wrap = document.getElementById('ledgerEditFormWrap');
  const cancelBtn = document.getElementById('editLedgerCancelBtn');

  if (selectWrap && trigger && options && search && placeholder) {
    const close = () => { options.classList.remove('open'); trigger.classList.remove('open'); };
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !options.classList.contains('open');
      options.classList.toggle('open', willOpen);
      trigger.classList.toggle('open', willOpen);
      if (willOpen) { search.value = ''; renderEditCustomerOptions(''); search.focus(); }
    });
    search.addEventListener('input', () => renderEditCustomerOptions(search.value.trim()));
    options.addEventListener('click', (e) => {
      const option = e.target.closest('.select-option');
      if (!option || option.classList.contains('disabled')) return;
      const id = parseInt(option.getAttribute('data-customer-id'), 10);
      const customer = ledgerCustomers.find((c) => c.id === id);
      selectedEditCustomer = customer || null;
      placeholder.textContent = option.textContent;
      placeholder.classList.remove('select-placeholder');
      close();
    });
    document.addEventListener('click', (e) => { if (!selectWrap.contains(e.target)) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

  if (cancelBtn && wrap) cancelBtn.addEventListener('click', () => { wrap.style.display = 'none'; });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (errBox) errBox.style.display = 'none';
      if (!selectedEditCustomer) {
        if (errBox) { errBox.textContent = 'Customer select karein.'; errBox.style.display = 'block'; }
        return;
      }
      const payload = {
        id: document.getElementById('editLedgerId').value,
        firmId: (currentUser && currentUser.firmId) ? currentUser.firmId : null,
        customerId: selectedEditCustomer.id,
        customerCode: document.getElementById('editLedgerCustomerCode').value.trim(),
        token: document.getElementById('editLedgerToken').value.trim(),
        type: document.getElementById('editLedgerType').value,
        quality: document.getElementById('editLedgerQuality').value.trim(),
        takhaBales: document.getElementById('editLedgerTakhaBales').value
      };
      const token = sessionStorage.getItem('packing_orbit_session');
      try {
        const res = await fetch('/api/admin/ledger/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          if (wrap) wrap.style.display = 'none';
          alert(data.message || 'Ledger entry update ho gayi!');
          loadLedgerEntries();
        } else if (errBox) {
          errBox.textContent = data.message || 'Update nahi ho paya.';
          errBox.style.display = 'block';
        }
      } catch (err) {
        if (errBox) { errBox.textContent = 'Server error: ' + err.message; errBox.style.display = 'block'; }
      }
    });
  }
}

window.openLedgerEdit = function(id) {
  const entry = ledgerEntries.find((e) => e.id === id);
  const wrap = document.getElementById('ledgerEditFormWrap');
  if (!entry || !wrap) return;

  document.getElementById('editLedgerId').value = entry.id;
  document.getElementById('editLedgerCustomerCode').value = entry.customer_code || '';
  document.getElementById('editLedgerToken').value = entry.token || '';
  document.getElementById('editLedgerType').value = entry.type || '';
  document.getElementById('editLedgerQuality').value = entry.quality || '';
  document.getElementById('editLedgerTakhaBales').value = entry.takha_bales || '';

  const customer = ledgerCustomers.find((c) => c.id === entry.customer_id);
  selectedEditCustomer = customer || {
    id: entry.customer_id,
    identifier: entry.mobile,
    party_name: entry.party_name
  };
  const placeholder = document.getElementById('editLedgerCustomerPlaceholder');
  if (placeholder) {
    placeholder.textContent = `${entry.mobile} — ${entry.party_name}`;
    placeholder.classList.remove('select-placeholder');
  }
  const errBox = document.getElementById('editLedgerErrorMsg');
  if (errBox) errBox.style.display = 'none';

  wrap.style.display = 'block';
  wrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

window.deleteLedgerEntry = async function(id) {
  const entry = ledgerEntries.find((e) => e.id === id);
  if (entry && (entry.record_count || 0) > 0) {
    alert(`Yeh ledger delete nahi ho sakta — iske andar ${entry.record_count} record(s) hain. Pehle records hatayein.`);
    return;
  }
  if (!confirm('Kya ye ledger entry delete karni hai? Ye wapas nahi aayegi.')) return;
  const token = sessionStorage.getItem('packing_orbit_session');
  const firmId = (currentUser && currentUser.firmId) ? currentUser.firmId : null;
  try {
    const res = await fetch('/api/admin/ledger/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ id, firmId })
    });
    const data = await res.json();
    alert(data.message || (data.success ? 'Entry delete ho gayi!' : 'Delete nahi ho paya.'));
    if (data.success) loadLedgerEntries();
  } catch (err) {
    alert('Server error: ' + err.message);
  }
};

window.addLedgerRecord = async function(id) {
  const note = prompt('Is ledger ke under record ka detail (optional):');
  if (note === null) return;
  const token = sessionStorage.getItem('packing_orbit_session');
  const firmId = (currentUser && currentUser.firmId) ? currentUser.firmId : null;
  try {
    const res = await fetch('/api/admin/ledger/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ledgerId: id, firmId, note })
    });
    const data = await res.json();
    alert(data.message || (data.success ? 'Record add ho gaya!' : 'Record add nahi ho paya.'));
    if (data.success) loadLedgerEntries();
  } catch (err) {
    alert('Server error: ' + err.message);
  }
};

window.manageLedgerRecords = async function(id) {
  const token = sessionStorage.getItem('packing_orbit_session');
  const firmId = (currentUser && currentUser.firmId) ? currentUser.firmId : null;
  try {
    const res = await fetch(`/api/admin/ledger/records?ledgerId=${id}&firmId=${firmId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!data.success || !data.data.length) { alert('Is ledger ke under koi record nahi.'); return; }
    const lines = data.data.map((r) => `ID ${r.id}: ${r.note || '(no note)'}`).join('\n');
    const input = prompt(`Is ledger ke records:\n${lines}\n\nDelete karne ka record ID (blank = cancel):`);
    if (!input || !input.trim()) return;
    const del = await fetch('/api/admin/ledger/records/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ id: parseInt(input.trim(), 10), firmId })
    });
    const result = await del.json();
    alert(result.message || 'Record delete nahi ho paya.');
    if (result.success) loadLedgerEntries();
  } catch (err) {
    alert('Server error: ' + err.message);
  }
};

// ===== INWARD ENTRY — searchable dropdowns powered by Ledger Create data =====
let inwardCustomers = [];
let inwardRows = [];
let inwardEntryCache = [];
const inwardSelection = { customer: null, code: null, token: null, type: null, quality: null, takhaPerBale: 0 };
let inwardCustomerCtrl = null;
let inwardCodeCtrl = null;

function makeInwardDropdown(key, onSelect) {
  const wrap = document.getElementById(`inward${key}Select`);
  const trigger = document.getElementById(`inward${key}Trigger`);
  const options = document.getElementById(`inward${key}Options`);
  const search = document.getElementById(`inward${key}Search`);
  const list = document.getElementById(`inward${key}List`);
  const placeholder = document.getElementById(`inward${key}Placeholder`);
  if (!wrap || !trigger || !options || !search || !list || !placeholder) return null;

  let values = [];
  let selected = null;

  const close = () => {
    options.classList.remove('open');
    trigger.classList.remove('open');
    wrap.style.zIndex = '';
  };

  const render = (q) => {
    const query = String(q || '').toLowerCase();
    const matches = values.filter((v) => String(v).toLowerCase().includes(query));
    if (!matches.length) {
      list.innerHTML = '<div class="select-option disabled">Koi option nahi mila.</div>';
      return;
    }
    list.innerHTML = '';
    matches.forEach((v) => {
      const option = document.createElement('div');
      option.className = 'select-option';
      option.setAttribute('data-inward-value', v);
      option.textContent = v;
      list.appendChild(option);
    });
  };

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const willOpen = !options.classList.contains('open');
    options.classList.toggle('open', willOpen);
    trigger.classList.toggle('open', willOpen);
    // Active dropdown must sit above sibling fields so options are clickable
    wrap.style.zIndex = willOpen ? '1000' : '';
    if (willOpen) { search.value = ''; render(''); search.focus(); }
  });
  search.addEventListener('input', () => render(search.value.trim()));
  options.addEventListener('click', (e) => {
    const option = e.target.closest('.select-option');
    if (!option || option.classList.contains('disabled')) return;
    e.stopPropagation();
    selected = option.getAttribute('data-inward-value');
    placeholder.textContent = selected;
    placeholder.classList.remove('select-placeholder');
    close();
    if (typeof onSelect === 'function') onSelect(selected);
  });
  document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  return {
    setValues(arr, hint) {
      values = arr || [];
      selected = null;
      placeholder.textContent = hint || 'Select karein...';
      placeholder.classList.add('select-placeholder');
      render('');
    },
    clear(hint) {
      values = [];
      selected = null;
      placeholder.textContent = hint || 'Select karein...';
      placeholder.classList.add('select-placeholder');
      list.innerHTML = '';
      close();
    },
    get value() { return selected; }
  };
}

function initInwardForm() {
  const form = document.getElementById('inwardForm');
  if (!form) return;
  const errBox = document.getElementById('inwardErrorMsg');

  inwardCustomerCtrl = makeInwardDropdown('Customer', (value) => {
    inwardSelection.customer = inwardCustomers.find((c) => `${c.mobile} — ${c.partyName}` === value) || null;
    inwardSelection.code = inwardSelection.token = inwardSelection.type = inwardSelection.quality = null;
    inwardSelection.takhaPerBale = 0;
    updateTakhaSummary();
    inwardCodeCtrl.clear('Code select karein');
    tokenCtrl.clear('Pehle code select karein');
    typeCtrl.clear('Pehle token select karein');
    qualityCtrl.clear('Pehle type select karein');
    if (inwardSelection.customer) loadInwardOptions(inwardSelection.customer.id);
  });

  inwardCodeCtrl = makeInwardDropdown('Code', (value) => {
    inwardSelection.code = value;
    inwardSelection.token = inwardSelection.type = inwardSelection.quality = null;
    inwardSelection.takhaPerBale = 0;
    updateTakhaSummary();
    tokenCtrl.clear('Token select karein');
    typeCtrl.clear('Pehle token select karein');
    qualityCtrl.clear('Pehle type select karein');
    const tokens = [...new Set(inwardRows.filter((r) => r.customer_code === value).map((r) => r.token).filter(Boolean))];
    tokenCtrl.setValues(tokens, 'Token select karein');
  });

  const tokenCtrl = makeInwardDropdown('Token', (value) => {
    inwardSelection.token = value;
    inwardSelection.type = inwardSelection.quality = null;
    inwardSelection.takhaPerBale = 0;
    updateTakhaSummary();
    typeCtrl.clear('Type select karein');
    qualityCtrl.clear('Pehle type select karein');
    const types = [...new Set(inwardRows.filter((r) => r.customer_code === inwardSelection.code && r.token === value).map((r) => r.type).filter(Boolean))];
    typeCtrl.setValues(types, 'Type select karein');
  });

  const typeCtrl = makeInwardDropdown('Type', (value) => {
    inwardSelection.type = value;
    inwardSelection.quality = null;
    inwardSelection.takhaPerBale = 0;
    updateTakhaSummary();
    qualityCtrl.clear('Quality select karein');
    const qualities = [...new Set(inwardRows
      .filter((r) => r.customer_code === inwardSelection.code && r.token === inwardSelection.token && r.type === value)
      .map((r) => r.quality).filter(Boolean))];
    qualityCtrl.setValues(qualities, 'Quality select karein');
  });

  const qualityCtrl = makeInwardDropdown('Quality', (value) => {
    inwardSelection.quality = value;
    const match = inwardRows.find((r) =>
      r.customer_code === inwardSelection.code && r.token === inwardSelection.token &&
      r.type === inwardSelection.type && r.quality === value);
    inwardSelection.takhaPerBale = match ? (match.takha_bales || 0) : 0;
    updateTakhaSummary();
  });

  function updateTakhaSummary() {
    const totalEl = document.getElementById('inwardTotalTakhaInput');
    if (!totalEl) return;
    const count = baleRows ? baleRows.querySelectorAll('.inward-bale-input').length : 0;
    totalEl.value = String((inwardSelection.takhaPerBale || 0) * count);
  }

  // Bale rows — each bale entered separately (min 1, max 30)
  const baleRows = document.getElementById('inwardBaleRows');
  const addBaleBtn = document.getElementById('inwardAddBaleBtn');
  const baleCount = document.getElementById('inwardBaleCount');

  const updateBaleCount = () => {
    if (!baleRows || !baleCount) return;
    const count = baleRows.querySelectorAll('.inward-bale-input').length;
    baleCount.textContent = `${count} / 30 bales`;
    if (addBaleBtn) addBaleBtn.disabled = count >= 30;
    baleRows.querySelectorAll('.bale-remove').forEach((btn) => {
      btn.disabled = count <= 1;
    });
    updateTakhaSummary();
  };

  const addBaleRow = (value = '') => {
    if (!baleRows) return null;
    const rows = baleRows.querySelectorAll('.bale-row');
    if (rows.length >= 30) return null;
    const row = document.createElement('div');
    row.className = 'bale-row';
    row.innerHTML = `
      <input type="text" inputmode="numeric" class="form-input-plain inward-bale-input" placeholder="Bale ${rows.length + 1}" maxlength="12">
      <button type="button" class="btn-action-remove bale-remove" title="Remove">&times;</button>
    `;
    const input = row.querySelector('input');
    input.value = value;
    baleRows.appendChild(row);
    updateBaleCount();
    return input;
  };

  if (addBaleBtn && baleRows) {
    addBaleBtn.addEventListener('click', () => {
      const next = addBaleRow();
      if (next) next.focus();
    });

    // FAST MODE: Enter par turant agla bale box khul jayega
    baleRows.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || !e.target.classList.contains('inward-bale-input')) return;
      e.preventDefault();
      const next = addBaleRow();
      if (next) next.focus();
    });

    // FAST MODE: "1,2,3,4" type karte hi alag-alag rows ban jayengi
    baleRows.addEventListener('input', (e) => {
      const input = e.target;
      if (!input.classList.contains('inward-bale-input') || !input.value.includes(',')) return;
      const parts = input.value.split(',').map((v) => v.trim()).filter(Boolean);
      if (parts.length < 2) return;
      input.value = parts[0];
      let last = input;
      for (let i = 1; i < parts.length; i++) {
        const next = addBaleRow(parts[i]);
        if (!next) break;
        last = next;
      }
      last.focus();
    });

    baleRows.addEventListener('click', (e) => {
      const btn = e.target.closest('.bale-remove');
      if (!btn) return;
      const rows = baleRows.querySelectorAll('.bale-row');
      if (rows.length <= 1) return;
      btn.closest('.bale-row').remove();
      updateBaleCount();
    });
    updateBaleCount();
  }

  const collectBales = () => Array.from(document.querySelectorAll('.inward-bale-input'))
    .flatMap((input) => input.value.split(','))
    .map((v) => v.trim())
    .filter(Boolean);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (errBox) errBox.style.display = 'none';

    const baleList = collectBales();
    if (!inwardSelection.customer || !inwardSelection.code || !inwardSelection.token || !inwardSelection.type || !inwardSelection.quality) {
      if (errBox) { errBox.textContent = 'Saare 5 dropdown fields select karein.'; errBox.style.display = 'block'; }
      return;
    }
    if (baleList.length < 1 || baleList.length > 30) {
      if (errBox) { errBox.textContent = 'Minimum 1 aur maximum 30 bale numbers daalein.'; errBox.style.display = 'block'; }
      return;
    }
    if (new Set(baleList).size !== baleList.length) {
      if (errBox) { errBox.textContent = 'Bale numbers unique hone chahiye.'; errBox.style.display = 'block'; }
      return;
    }

    const token = sessionStorage.getItem('packing_orbit_session');
    const payload = {
      firmId: (currentUser && currentUser.firmId) ? currentUser.firmId : null,
      customerId: inwardSelection.customer.id,
      customerCode: inwardSelection.code,
      token: inwardSelection.token,
      type: inwardSelection.type,
      quality: inwardSelection.quality,
      baleNumbers: baleList
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    try {
      const res = await fetch('/api/inward/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        const resultBox = document.getElementById('inwardResult');
        const noEl = document.getElementById('inwardNoValue');
        const atEl = document.getElementById('inwardAtValue');
        const entry = data.data && data.data.entry ? data.data.entry : {};
        if (resultBox) resultBox.style.display = 'block';
        if (noEl) noEl.textContent = entry.inward_no || '—';
        if (atEl) atEl.textContent = entry.inward_at || '—';
        const shareBtn = document.getElementById('shareNewInwardBtn');
        if (shareBtn && entry.id) {
          const savedCustomer = inwardSelection.customer;
          inwardEntryCache.push({
            id: entry.id,
            inward_no: entry.inward_no,
            inward_at: entry.inward_at,
            customer_code: entry.customer_code,
            token: entry.token,
            quality: entry.quality,
            bale_numbers: entry.bale_numbers,
            total_takha: entry.total_takha,
            bales: (data.data && data.data.bales) || [],
            mobile: savedCustomer ? savedCustomer.mobile : '',
            party_name: savedCustomer ? savedCustomer.partyName : ''
          });
          shareBtn.onclick = () => window.shareInwardOnWhatsApp(entry.id);
        }
        alert(data.message || 'Inward entry save ho gayi!');
        form.reset();
        inwardSelection.customer = inwardSelection.code = inwardSelection.token = inwardSelection.type = inwardSelection.quality = null;
        inwardSelection.takhaPerBale = 0;
        updateTakhaSummary();
        inwardCustomerCtrl.clear('Customer select karein...');
        inwardCodeCtrl.clear('Pehle customer select karein');
        tokenCtrl.clear('Pehle code select karein');
        typeCtrl.clear('Pehle token select karein');
        qualityCtrl.clear('Pehle type select karein');
        if (baleRows) {
          baleRows.innerHTML = `
            <div class="bale-row">
              <input type="text" inputmode="numeric" class="form-input-plain inward-bale-input" placeholder="Bale 1" maxlength="12">
              <button type="button" class="btn-action-remove bale-remove" title="Remove">&times;</button>
            </div>
          `;
          updateBaleCount();
        }
        loadInwardList();
      } else {
        if (errBox) { errBox.textContent = data.message || 'Inward save nahi ho paya.'; errBox.style.display = 'block'; }
      }
    } catch (err) {
      if (errBox) { errBox.textContent = 'Server error: ' + err.message; errBox.style.display = 'block'; }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

async function loadInwardCustomers() {
  const token = sessionStorage.getItem('packing_orbit_session');
  if (!token) return;
  const firmId = (currentUser && currentUser.firmId) ? currentUser.firmId : null;
  try {
    const res = await fetch(`/api/inward/customers?firmId=${encodeURIComponent(firmId || '')}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    inwardCustomers = (result.success && Array.isArray(result.data)) ? result.data : [];
    const values = inwardCustomers.map((c) => `${c.mobile} — ${c.partyName}`);
    if (inwardCustomerCtrl) {
      inwardCustomerCtrl.setValues(values, values.length ? 'Customer select karein...' : 'Koi registered customer nahi');
    }
  } catch (err) {
    console.error('Inward customer load error:', err);
  }
}

async function loadInwardOptions(customerId) {
  const token = sessionStorage.getItem('packing_orbit_session');
  const firmId = (currentUser && currentUser.firmId) ? currentUser.firmId : null;
  try {
    const res = await fetch(`/api/inward/options?firmId=${encodeURIComponent(firmId || '')}&customerId=${encodeURIComponent(customerId)}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    inwardRows = (result.success && result.data && Array.isArray(result.data.rows)) ? result.data.rows : [];
    const codes = [...new Set(inwardRows.map((r) => r.customer_code).filter(Boolean))];
    if (inwardCodeCtrl) {
      inwardCodeCtrl.setValues(codes, codes.length ? 'Code select karein' : 'Is customer ke ledger entry nahi');
    }
  } catch (err) {
    console.error('Inward options load error:', err);
  }
}

async function loadInwardList() {
  const token = sessionStorage.getItem('packing_orbit_session');
  const tbody = document.getElementById('inwardListBody');
  if (!token || !tbody) return;
  const firmId = (currentUser && currentUser.firmId) ? currentUser.firmId : null;
  try {
    const res = await fetch(`/api/inward/list?firmId=${encodeURIComponent(firmId || '')}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    const entries = (result.success && Array.isArray(result.data)) ? result.data : [];
    inwardEntryCache = entries;
    if (!entries.length) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; color:#9ca3af;">Koi inward entry nahi.</td></tr>';
      return;
    }
    tbody.innerHTML = '';
    entries.forEach((e) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(e.inward_no || '—')}</td>
        <td>${escapeHtml(e.inward_at || '—')}</td>
        <td>${escapeHtml(e.mobile || '')}<br><span style="font-size:0.68rem;color:#9ca3af;">${escapeHtml(e.party_name || '')}</span></td>
        <td>${escapeHtml(e.customer_code)}</td>
        <td>${escapeHtml(e.token)}</td>
        <td>${escapeHtml(e.bale_numbers)}</td>
        <td><strong>${escapeHtml(e.total_takha != null ? e.total_takha : '—')}</strong></td>
        <td>${(e.bales || []).map(escapeHtml).join(', ')}</td>
        <td><button class="btn-action-reinstate" onclick="shareInwardOnWhatsApp(${e.id})">Share Badge</button></td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Inward list load error:', err);
  }
}

function crc32(bytes) {
  let c = ~0;
  for (let i = 0; i < bytes.length; i++) {
    c ^= bytes[i];
    for (let k = 0; k < 8; k++) {
      c = (c >>> 1) ^ (0xEDB88320 & -(c & 1));
    }
  }
  return (~c) >>> 0;
}

// Inject pHYs chunk so the PNG carries 300 DPI metadata
async function pngWithDpi(blob, dpi) {
  try {
    const src = new Uint8Array(await blob.arrayBuffer());
    if (src.length < 40 || src[0] !== 137 || src[1] !== 80) return blob;
    const ppm = Math.round(dpi / 0.0254);
    const data = new Uint8Array(9);
    data[0] = (ppm >>> 24) & 255; data[1] = (ppm >>> 16) & 255;
    data[2] = (ppm >>> 8) & 255;  data[3] = ppm & 255;
    data[4] = data[0]; data[5] = data[1]; data[6] = data[2]; data[7] = data[3];
    data[8] = 1;
    const type = [112, 72, 89, 115]; // pHYs
    const crcInput = new Uint8Array(type.length + data.length);
    crcInput.set(type, 0);
    crcInput.set(data, type.length);
    const crc = crc32(crcInput);
    const chunk = new Uint8Array(21);
    chunk[0] = 0; chunk[1] = 0; chunk[2] = 0; chunk[3] = 9;
    chunk.set(type, 4);
    chunk.set(data, 8);
    chunk[17] = (crc >>> 24) & 255; chunk[18] = (crc >>> 16) & 255;
    chunk[19] = (crc >>> 8) & 255;  chunk[20] = crc & 255;
    const insertAt = 8 + 25; // signature + IHDR chunk
    const out = new Uint8Array(src.length + chunk.length);
    out.set(src.slice(0, insertAt), 0);
    out.set(chunk, insertAt);
    out.set(src.slice(insertAt), insertAt + chunk.length);
    return new Blob([out], { type: 'image/png' });
  } catch (err) {
    console.warn('DPI metadata skip:', err);
    return blob;
  }
}

function buildInwardBadgeCanvas(e) {
  const canvas = document.createElement('canvas');
  canvas.width = 638;
  canvas.height = 1011;
  const ctx = canvas.getContext('2d');

  // Rounded-corner card — everything below is clipped to this shape
  const radius = 28;
  ctx.clearRect(0, 0, 638, 1011);
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.arcTo(638, 0, 638, 1011, radius);
  ctx.arcTo(638, 1011, 0, 1011, radius);
  ctx.arcTo(0, 1011, 0, 0, radius);
  ctx.arcTo(0, 0, 638, 0, radius);
  ctx.closePath();
  ctx.save();
  ctx.clip();

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 638, 1011);

  const put = (text, x, y, font, color, maxWidth) => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text == null || text === '' ? '—' : String(text), x, y, maxWidth || 560);
  };

  const firmName = (currentUser && currentUser.firmName) ? currentUser.firmName : '—';

  // Watermark — licensed firm name (faint, diagonal)
  ctx.save();
  ctx.translate(319, 560);
  ctx.rotate(-Math.PI / 6);
  ctx.font = 'bold 58px Arial';
  ctx.fillStyle = 'rgba(6, 95, 70, 0.06)';
  ctx.textAlign = 'center';
  ctx.fillText(firmName, 0, 0, 700);
  ctx.restore();

  // Header band with white brand text
  ctx.fillStyle = '#065f46';
  ctx.fillRect(0, 0, 638, 240);
  put('PACKING ORBIT', 32, 58, 'bold 30px Arial', '#ffffff');
  put('Original Brand - License Protected', 32, 80, '15px Arial', '#d1fae5');

  // QR — unique for this record, top-right inside header
  try {
    if (typeof qrcode === 'function') {
      const qrData = [
        'PACKING ORBIT', firmName,
        `Inward: ${e.inward_no || '-'}`,
        `Date: ${e.inward_at || '-'}`,
        `Customer: ${e.party_name || '-'} (${e.mobile || '-'})`,
        `Code: ${e.customer_code || '-'} | Token: ${e.token || '-'}`,
        `Bales: ${e.bale_numbers || '-'} [${(e.bales || []).join(', ')}]`,
        `Total Takha: ${e.total_takha != null ? e.total_takha : '-'}`
      ].join('\n');
      const qr = qrcode(0, 'M');
      qr.addData(qrData);
      qr.make();
      const modules = qr.getModuleCount();
      const boxX = 414, boxY = 20, boxSize = 200, quiet = 3;
      const cell = boxSize / (modules + quiet * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(boxX, boxY, boxSize, boxSize);
      ctx.fillStyle = '#000000';
      for (let r = 0; r < modules; r++) {
        for (let c = 0; c < modules; c++) {
          if (qr.isDark(r, c)) {
            ctx.fillRect(boxX + (c + quiet) * cell, boxY + (r + quiet) * cell, cell + 0.6, cell + 0.6);
          }
        }
      }
    }
  } catch (err) {
    console.error('QR generate error:', err);
  }

  // Headings after the header
  ctx.textAlign = 'center';
  put(firmName, 319, 270, 'bold 32px Arial', '#111827', 560);
  put('INWARD ENTRY', 319, 312, 'bold 25px Arial', '#047857');
  ctx.textAlign = 'left';

  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 330, 590, 520);

  // Compact rows — minimal line spacing
  const compactRows = [
    ['Inward No', e.inward_no],
    ['Date & Time', e.inward_at],
    ['Customer', e.party_name],
    ['Mobile', e.mobile],
    ['Customer Code', e.customer_code],
    ['Token', e.token],
    ['Quality', e.quality]
  ];

  let y = 368;
  compactRows.forEach(([label, value]) => {
    put(label, 44, y, '19px Arial', '#4b5563');
    put(value, 240, y, 'bold 22px Arial', '#111827', 360);
    y += 34;
  });

  // Bale Numbers — split into two clear, larger lines using the free space below
  const bales = (e.bales || []).map(String);
  const half = Math.ceil(bales.length / 2);
  const baleLine1 = bales.slice(0, half).join(', ');
  const baleLine2 = bales.slice(half).join(', ');

  put('Bale Numbers', 44, 640, '19px Arial', '#4b5563');
  put(baleLine1, 240, 640, 'bold 26px Arial', '#111827', 350);
  if (baleLine2) put(baleLine2, 240, 678, 'bold 26px Arial', '#111827', 350);

  // Bales — light cyan patch (just above Total Takha)
  ctx.fillStyle = '#cffafe';
  ctx.fillRect(40, 710, 558, 60);
  put('Bales', 44, 750, '20px Arial', '#4b5563');
  ctx.textAlign = 'right';
  put(e.bale_numbers != null ? e.bale_numbers : '—', 590, 750, 'bold 30px Arial', '#0e7490', 200);
  ctx.textAlign = 'left';

  // Total Takha
  ctx.fillStyle = '#d1fae5';
  ctx.fillRect(40, 780, 558, 60);
  put('Total Takha', 44, 820, '20px Arial', '#4b5563');
  ctx.textAlign = 'right';
  put(e.total_takha != null ? e.total_takha : '—', 590, 820, 'bold 30px Arial', '#065f46', 200);
  ctx.textAlign = 'left';

  ctx.fillStyle = '#e5e7eb';
  ctx.fillRect(24, 875, 590, 1);
  ctx.textAlign = 'center';
  put('Original Brand - License Protected', 319, 915, '16px Arial', '#6b7280');
  ctx.textAlign = 'left';
  ctx.restore();
  return canvas;
}


window.shareInwardOnWhatsApp = async function(id) {
  const e = inwardEntryCache.find((x) => x.id === id);
  if (!e) { alert('Inward entry nahi mila.'); return; }

  const digits = String(e.mobile || '').replace(/\D/g, '');
  const phone = (digits.length === 12 && digits.startsWith('91')) ? digits
    : (digits.length === 10 ? `91${digits}` : digits);

  const canvas = buildInwardBadgeCanvas(e);
  const fileName = `inward-${e.inward_no || 'entry'}.png`;
  const waText = ''; // image badge me saari details hai — extra caption nahi

  canvas.toBlob(async (rawBlob) => {
    if (!rawBlob) { alert('Image ban nahi payi.'); return; }
    // Standard 638x1011 px portrait PNG with 300 DPI metadata
    const blob = await pngWithDpi(rawBlob, 300);

    // APK me native bridge: image directly customer ke WhatsApp chat me attach hoti hai
    if (window.PackingOrbitNative && typeof window.PackingOrbitNative.shareImageToWhatsApp === 'function') {
      try {
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        const shared = window.PackingOrbitNative.shareImageToWhatsApp(dataUrl, phone, waText);
        if (shared) return;
      } catch (err) {
        console.warn('Native WhatsApp share failed:', err);
      }
    }

    // Web par: directly IMAGE share (text-only nahi, koi download nahi)
    const imageFile = new File([blob], fileName, { type: 'image/png' });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [imageFile] })) {
      try {
        await navigator.share({ title: 'Inward Badge', text: waText, files: [imageFile] });
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return;
      }
    }

    alert('Is browser me image share support nahi. Badge image directly customer chat me bhejne ke liye Packing Orbit APK use karein.');
  }, 'image/png');
};

window.openCustomerEdit = function(id) {
  const customer = adminCustomers.find((c) => c.id === id);
  const modal = document.getElementById('editCustomerModal');
  if (!customer || !modal) return;

  document.getElementById('editCustomerId').value = customer.id;
  document.getElementById('editCustomerMobile').value = customer.identifier || '';
  document.getElementById('editCustomerParty').value = customer.party_name || customer.full_name || '';
  document.getElementById('editCustomerPin').value = '';
  const errBox = document.getElementById('editCustomerErrorMsg');
  if (errBox) errBox.style.display = 'none';
  modal.classList.add('open');
};

// RENDER APP STATE BASED ON LOGIN STATUS
function renderAppUI(user) {
  const authGateContainer = document.getElementById('authGateContainer');
  const protectedDashboard = document.getElementById('protectedDashboard');
  const authHeaderContainer = document.getElementById('authHeaderContainer');
  const sidebarUserRoleText = document.getElementById('sidebarUserRoleText');
  const labourControlSection = document.getElementById('labourControlSection');
  const firmRunStatus = document.getElementById('firmRunStatus');

  // Any auth state change should return to the Home tab
  ['pricingPage', 'ledgerPage', 'ledgerCreatePage', 'ledgerEditPage', 'ledgerDeletePage', 'inwardPage', 'outwardPage', 'downloadPage', 'helpPage', 'contactsPage', 'adminControlPanelPage'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  if (protectedDashboard) protectedDashboard.classList.remove('panel-open');
  if (firmRunStatus) firmRunStatus.style.display = 'none';
  setActiveTab('home');

  if (user) {
    // Hide Login Gate, Show Protected Content
    authGateContainer.style.display = 'none';
    protectedDashboard.style.display = 'block';

    // Restore sidebar after login (header was never hidden)
    const sidebarEl = document.getElementById('sidebar');
    if (sidebarEl) sidebarEl.style.display = '';

    const roleClass = `role-${user.role}`;
    let roleTitle = 'Admin';
    if (user.role === 'employee') roleTitle = 'Packing Labour';
    if (user.role === 'customer') roleTitle = 'Grey Cloth Party';

    // Header Profile Pill (with Logout)
    authHeaderContainer.innerHTML = `
      <div class="user-header-pill" id="userProfileHeaderPill" title="Active user">
        <span class="user-header-role ${roleClass}">${user.role.toUpperCase()}</span>
        <span class="user-header-name">${user.fullName}</span>
        <button class="btn-logout" id="logoutBtn" title="Logout">Logout</button>
      </div>
    `;

    // Running Firm indicator (green blinking circle)
    if (firmRunStatus && user.firmName) {
      firmRunStatus.style.display = 'flex';
      const firmNameEl = document.getElementById('firmRunName');
      const firmTypeEl = document.getElementById('firmRunType');
      if (firmNameEl) firmNameEl.textContent = user.firmName;
      if (firmTypeEl) {
        const typeLabel = user.licenseType === 'owner'
          ? 'Owner License'
          : user.licenseType === 'testing'
            ? 'Testing License'
            : user.licenseType === 'lifetime'
              ? 'Lifetime License'
              : '';
        firmTypeEl.textContent = typeLabel;
        firmTypeEl.style.display = typeLabel ? 'inline-block' : 'none';
      }
    }
    if (sidebarUserRoleText) sidebarUserRoleText.textContent = `${user.fullName} (${roleTitle})`;

    // Current Login Status — Blinking Filled Circle
    const loginStatusDot = document.getElementById('loginStatusDot');
    const loginStatusLabel = document.getElementById('loginStatusLabel');
    if (loginStatusDot) {
      loginStatusDot.className = 'login-status-dot active';
    }
    if (loginStatusLabel) {
      loginStatusLabel.className = 'login-status-label active';
      loginStatusLabel.textContent = roleTitle;
    }

    // Role-based Dashboard Views
    if (user.role === 'admin') {
      if (labourControlSection) labourControlSection.style.display = 'none';
      loadAdminLabourList();
      loadAdminLoginLogs();
      loadAdminFirmList();
    } else if (user.role === 'employee') {
      if (labourControlSection) labourControlSection.style.display = 'block';
    } else {
      if (labourControlSection) labourControlSection.style.display = 'none';
    }
  } else {
    // Show Mandatory Login Gate, Hide Protected Content
    authGateContainer.style.display = 'flex';
    protectedDashboard.style.display = 'none';

    // On login screen: hide ONLY sidebar & backdrop; header stays visible
    const sidebarEl = document.getElementById('sidebar');
    const sidebarBackdropEl = document.getElementById('sidebarBackdrop');
    if (sidebarEl) sidebarEl.style.display = 'none';
    if (sidebarBackdropEl) sidebarBackdropEl.style.display = 'none';

    // Reset Header badge to Locked + Live status (for when login completes)
    authHeaderContainer.innerHTML = `
      <div class="user-lock-badge">
        <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <span>Protected</span>
      </div>
      <div class="header-status">
        <span class="status-dot"></span>
        <span class="status-label" id="systemStatus">Live</span>
      </div>
    `;

    if (labourControlSection) labourControlSection.style.display = 'none';
    if (sidebarUserRoleText) sidebarUserRoleText.textContent = 'Malegaon Cluster';

    // Current Login Status — No Active Session (Grey Dot)
    const loginStatusDot = document.getElementById('loginStatusDot');
    const loginStatusLabel = document.getElementById('loginStatusLabel');
    if (loginStatusDot) {
      loginStatusDot.className = 'login-status-dot inactive';
    }
    if (loginStatusLabel) {
      loginStatusLabel.className = 'login-status-label inactive';
      loginStatusLabel.textContent = 'No Active Session';
    }
  }

  // Sync sidebar Admin Control Panel item based on current role (admin only)
  syncAdminNavItem();
  syncLedgerNavItem();
  syncOpsNavItems();
}

// Custom Account Select Dropdown — open/close + auto-fill identifier & password
const customSelect = document.getElementById('customAccountSelect');
const customSelectTrigger = document.getElementById('customSelectTrigger');
const customSelectOptions = document.getElementById('customSelectOptions');
const selectArrow = document.querySelector('.select-arrow');
const selectPlaceholder = document.getElementById('customSelectTrigger')?.querySelector('.select-placeholder');
const mainLoginIdentifier = document.getElementById('mainLoginIdentifier');
const mainLoginPassword = document.getElementById('mainLoginPassword');

if (customSelect && customSelectTrigger && customSelectOptions && mainLoginIdentifier && mainLoginPassword) {
  // Toggle dropdown open/close
  customSelectTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = customSelectOptions.classList.contains('open');
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  // Option selection
  customSelectOptions.addEventListener('click', (e) => {
    const option = e.target.closest('.select-option');
    if (!option) return;

    const identifier = option.getAttribute('data-identifier');
    const password = option.getAttribute('data-password');

    if (identifier) {
      mainLoginIdentifier.value = identifier;
      mainLoginPassword.value = password || '';
      mainLoginPassword.focus();

      if (selectPlaceholder) selectPlaceholder.textContent = option.textContent;
      
      // Mark selected visually
      document.querySelectorAll('.select-option').forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
    }

    closeDropdown();
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!customSelect.contains(e.target)) {
      closeDropdown();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDropdown();
  });
}

function openDropdown() {
  customSelectOptions.classList.add('open');
  customSelectTrigger.classList.add('open');
  if (selectArrow) selectArrow.classList.add('open');
}

function closeDropdown() {
  customSelectOptions.classList.remove('open');
  customSelectTrigger.classList.remove('open');
  if (selectArrow) selectArrow.classList.remove('open');
}

// Collapsible card toggle
window.toggleCard = function(cardId, event) {
  // If event came from a button inside header, don't toggle
  if (event && event.target && (event.target.tagName === 'BUTTON' || event.target.closest('button'))) {
    event.stopPropagation();
    return;
  }

  const card = document.getElementById(cardId);
  const content = document.getElementById(cardId + 'Content');
  const arrow = document.getElementById(cardId + 'Arrow');

  if (!card || !content) return;

  const isCollapsed = content.classList.contains('collapsed');

  if (isCollapsed) {
    content.classList.remove('collapsed');
    if (arrow) arrow.classList.add('rotated');
  } else {
    content.classList.add('collapsed');
    if (arrow) arrow.classList.remove('rotated');
  }
};

// Quick fill helper on login gate (kept for backward compatibility)
window.autoFillMainLogin = function(identifier, password) {
  document.getElementById('mainLoginIdentifier').value = identifier;
  document.getElementById('mainLoginPassword').value = password;
  document.getElementById('mainLoginPassword').focus();
};

// 5. Admin Exclusive Features
function initAdminFeatures() {
  const addLabourBtn = document.getElementById('addLabourModalOpenBtn');
  const addLabourCloseBtn = document.getElementById('addLabourModalCloseBtn');
  const addLabourCancelBtn = document.getElementById('addLabourCancelBtn');
  const addLabourModal = document.getElementById('addLabourModal');
  const addLabourForm = document.getElementById('addLabourForm');
  const refreshLogsBtn = document.getElementById('refreshLogsBtn');

  if (addLabourBtn) addLabourBtn.addEventListener('click', () => {
    if (addLabourModal) addLabourModal.classList.add('open');
  });

  if (addLabourCloseBtn) addLabourCloseBtn.addEventListener('click', () => {
    if (addLabourModal) addLabourModal.classList.remove('open');
  });

  if (addLabourCancelBtn) addLabourCancelBtn.addEventListener('click', () => {
    if (addLabourModal) addLabourModal.classList.remove('open');
  });

  if (addLabourModal) {
    addLabourModal.addEventListener('click', (e) => {
      if (e.target === addLabourModal) addLabourModal.classList.remove('open');
    });
  }

  if (addLabourForm) {
    addLabourForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = sessionStorage.getItem('packing_orbit_session');
      const fullName = document.getElementById('labourName').value;
      const mobileNumber = document.getElementById('labourMobile').value;
      const pin = document.getElementById('labourPin').value;
      const errBox = document.getElementById('labourErrorMsg');

      errBox.style.display = 'none';

      try {
        const res = await fetch('/api/admin/employees/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ fullName, mobileNumber, pin })
        });

        const data = await res.json();
        if (data.success) {
          addLabourModal.classList.remove('open');
          addLabourForm.reset();
          loadAdminLabourList();
        } else {
          errBox.textContent = data.message || 'Labour add karne me error.';
          errBox.style.display = 'block';
        }
      } catch (err) {
        errBox.textContent = 'Server error: ' + err.message;
        errBox.style.display = 'block';
      }
    });
  }

  if (refreshLogsBtn) {
    refreshLogsBtn.addEventListener('click', () => loadAdminLoginLogs());
  }

  // ===== FIRM & LICENSE MANAGEMENT =====
  const createFirmBtn = document.getElementById('createFirmModalOpenBtn');
  const createFirmModal = document.getElementById('createFirmModal');
  const createFirmCloseBtn = document.getElementById('createFirmModalCloseBtn');
  const createFirmCancelBtn = document.getElementById('createFirmCancelBtn');
  const createFirmForm = document.getElementById('createFirmForm');
  const firmLicenseType = document.getElementById('firmLicenseType');
  const firmLicenseFee = document.getElementById('firmLicenseFee');
  const firmAmcFee = document.getElementById('firmAmcFee');

  const syncFirmFeeFields = () => {
    if (!firmLicenseType) return;
    const isFree = firmLicenseType.value === 'owner' || firmLicenseType.value === 'testing';
    if (firmLicenseFee) {
      firmLicenseFee.disabled = isFree;
      if (isFree) firmLicenseFee.value = '0';
    }
    if (firmAmcFee) {
      firmAmcFee.disabled = isFree;
      if (isFree) firmAmcFee.value = '0';
    }
  };

  if (firmLicenseType) firmLicenseType.addEventListener('change', syncFirmFeeFields);

  if (createFirmBtn && createFirmModal) {
    createFirmBtn.addEventListener('click', () => {
      if (createFirmForm) createFirmForm.reset();
      const errBox = document.getElementById('firmErrorMsg');
      if (errBox) errBox.style.display = 'none';
      const cityEl = document.getElementById('firmCity');
      if (cityEl) cityEl.value = 'Malegaon';
      const brandEl = document.getElementById('firmBrandName');
      if (brandEl) brandEl.textContent = firmBrandCache;
      syncFirmFeeFields();
      createFirmModal.classList.add('open');
    });
  }

  const closeCreateFirmModal = () => {
    if (createFirmModal) createFirmModal.classList.remove('open');
  };
  if (createFirmCloseBtn) createFirmCloseBtn.addEventListener('click', closeCreateFirmModal);
  if (createFirmCancelBtn) createFirmCancelBtn.addEventListener('click', closeCreateFirmModal);
  if (createFirmModal) {
    createFirmModal.addEventListener('click', (e) => {
      if (e.target === createFirmModal) closeCreateFirmModal();
    });
  }

  if (createFirmForm) {
    createFirmForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = sessionStorage.getItem('packing_orbit_session');
      const errBox = document.getElementById('firmErrorMsg');
      const confirmBrand = document.getElementById('firmConfirmBrand');
      if (errBox) errBox.style.display = 'none';

      if (confirmBrand && !confirmBrand.checked) {
        if (errBox) {
          errBox.textContent = 'Brand permanence confirmation tick karein.';
          errBox.style.display = 'block';
        }
        return;
      }

      const payload = {
        firmName: document.getElementById('firmName').value,
        ownerName: document.getElementById('firmOwnerName').value,
        mobile: document.getElementById('firmMobile').value,
        email: document.getElementById('firmEmail').value,
        address: document.getElementById('firmAddress').value,
        city: document.getElementById('firmCity').value,
        gstin: document.getElementById('firmGstin').value,
        licenseType: firmLicenseType.value,
        licenseFee: firmLicenseFee.value,
        amcFee: firmAmcFee.value,
        amcDueDate: document.getElementById('firmAmcDueDate').value,
        notes: document.getElementById('firmNotes').value
      };

      try {
        const res = await fetch('/api/admin/firms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          closeCreateFirmModal();
          createFirmForm.reset();
          syncFirmFeeFields();
          loadAdminFirmList();
          alert(data.message || 'Firm license create ho gaya!');
        } else if (errBox) {
          errBox.textContent = data.message || 'Firm license create karne me error.';
          errBox.style.display = 'block';
        }
      } catch (err) {
        if (errBox) {
          errBox.textContent = 'Server error: ' + err.message;
          errBox.style.display = 'block';
        }
      }
    });
  }

  // ===== REGISTER FIRM CUSTOMER (Admin only, system-generated PIN) =====
  const registerCustomerBtn = document.getElementById('registerCustomerModalOpenBtn');
  const registerCustomerModal = document.getElementById('registerCustomerModal');
  const registerCustomerCloseBtn = document.getElementById('registerCustomerModalCloseBtn');
  const registerCustomerCancelBtn = document.getElementById('registerCustomerCancelBtn');
  const registerCustomerForm = document.getElementById('registerCustomerForm');
  const customerErrorMsg = document.getElementById('customerErrorMsg');
  let registerCustomerFirmId = null;

  const closeRegisterCustomerModal = () => { if (registerCustomerModal) registerCustomerModal.classList.remove('open'); };

  if (registerCustomerBtn && registerCustomerModal) {
    registerCustomerBtn.addEventListener('click', () => {
      registerCustomerFirmId = (currentUser && currentUser.firmId) ? currentUser.firmId : (firmCache[0] ? firmCache[0].id : null);
      const firmEl = document.getElementById('customerFirmName');
      if (firmEl) {
        firmEl.textContent = (currentUser && currentUser.firmName)
          ? currentUser.firmName
          : (firmCache[0] ? (firmCache[0].firm_name || firmCache[0].firmName) : '—');
      }
      if (registerCustomerForm) registerCustomerForm.reset();
      if (customerErrorMsg) customerErrorMsg.style.display = 'none';
      registerCustomerModal.classList.add('open');
    });
  }
  if (registerCustomerCloseBtn) registerCustomerCloseBtn.addEventListener('click', closeRegisterCustomerModal);
  if (registerCustomerCancelBtn) registerCustomerCancelBtn.addEventListener('click', closeRegisterCustomerModal);
  if (registerCustomerModal) {
    registerCustomerModal.addEventListener('click', (e) => {
      if (e.target === registerCustomerModal) closeRegisterCustomerModal();
    });
  }

  if (registerCustomerForm) {
    registerCustomerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = sessionStorage.getItem('packing_orbit_session');
      const errBox = customerErrorMsg;
      if (errBox) errBox.style.display = 'none';

      const mobile = document.getElementById('customerMobile').value.trim();
      const partyName = document.getElementById('customerPartyName').value.trim();
      if (!/^\d{10}$/.test(mobile)) {
        if (errBox) { errBox.textContent = 'Valid 10-digit mobile number daalein.'; errBox.style.display = 'block'; }
        return;
      }

      try {
        const res = await fetch('/api/admin/customers/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ mobileNumber: mobile, partyName, firmId: registerCustomerFirmId })
        });
        const data = await res.json();
        if (data.success) {
          closeRegisterCustomerModal();
          registerCustomerForm.reset();
          loadAdminCustomerList();
          alert(data.message || `Customer registered. PIN: ${data.pin}`);
        } else if (errBox) {
          errBox.textContent = data.message || 'Customer register nahi ho paya.';
          errBox.style.display = 'block';
        }
      } catch (err) {
        if (errBox) { errBox.textContent = 'Server error: ' + err.message; errBox.style.display = 'block'; }
      }
    });
  }

  // ===== ADD TRANSPORT (Outward transportation detail) =====
  const addTransportBtn = document.getElementById('addTransportModalOpenBtn');
  const addTransportModal = document.getElementById('addTransportModal');
  const addTransportCloseBtn = document.getElementById('addTransportModalCloseBtn');
  const addTransportCancelBtn = document.getElementById('addTransportCancelBtn');
  const addTransportForm = document.getElementById('addTransportForm');
  const transportErrorMsg = document.getElementById('transportErrorMsg');

  const closeAddTransportModal = () => { if (addTransportModal) addTransportModal.classList.remove('open'); };

  if (addTransportBtn && addTransportModal) {
    addTransportBtn.addEventListener('click', () => {
      if (addTransportForm) addTransportForm.reset();
      if (transportErrorMsg) transportErrorMsg.style.display = 'none';
      const firmEl = document.getElementById('transportFirmName');
      if (firmEl) firmEl.textContent = (currentUser && currentUser.firmName) ? currentUser.firmName : '—';
      addTransportModal.classList.add('open');
    });
  }
  if (addTransportCloseBtn) addTransportCloseBtn.addEventListener('click', closeAddTransportModal);
  if (addTransportCancelBtn) addTransportCancelBtn.addEventListener('click', closeAddTransportModal);
  if (addTransportModal) {
    addTransportModal.addEventListener('click', (e) => {
      if (e.target === addTransportModal) closeAddTransportModal();
    });
  }

  if (addTransportForm) {
    addTransportForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = sessionStorage.getItem('packing_orbit_session');
      const errBox = transportErrorMsg;
      if (errBox) errBox.style.display = 'none';

      const name = document.getElementById('transportName').value.trim();
      const mobile = document.getElementById('transportMobile').value.trim();
      if (!name || !/^\d{10}$/.test(mobile)) {
        if (errBox) { errBox.textContent = 'Transport name aur 10-digit mobile zaroori hai.'; errBox.style.display = 'block'; }
        return;
      }

      const payload = {
        firmId: (currentUser && currentUser.firmId) ? currentUser.firmId : null,
        name,
        mobile,
        vehicleNo: document.getElementById('transportVehicle').value.trim(),
        gstin: document.getElementById('transportGstin').value.trim(),
        address: document.getElementById('transportAddress').value.trim()
      };

      try {
        const res = await fetch('/api/admin/transports/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          closeAddTransportModal();
          addTransportForm.reset();
          loadAdminTransportList();
          alert(data.message || 'Transport add ho gaya!');
        } else if (errBox) {
          errBox.textContent = data.message || 'Transport add nahi ho paya.';
          errBox.style.display = 'block';
        }
      } catch (err) {
        if (errBox) { errBox.textContent = 'Server error: ' + err.message; errBox.style.display = 'block'; }
      }
    });
  }

  // ===== EDIT / ALTER FIRM CUSTOMER (Admin only) =====
  const editCustomerModal = document.getElementById('editCustomerModal');
  const editCustomerCloseBtn = document.getElementById('editCustomerCloseBtn');
  const editCustomerCancelBtn = document.getElementById('editCustomerCancelBtn');
  const editCustomerForm = document.getElementById('editCustomerForm');
  const editCustomerErrorMsg = document.getElementById('editCustomerErrorMsg');

  const closeEditCustomerModal = () => { if (editCustomerModal) editCustomerModal.classList.remove('open'); };
  if (editCustomerCloseBtn) editCustomerCloseBtn.addEventListener('click', closeEditCustomerModal);
  if (editCustomerCancelBtn) editCustomerCancelBtn.addEventListener('click', closeEditCustomerModal);
  if (editCustomerModal) {
    editCustomerModal.addEventListener('click', (e) => {
      if (e.target === editCustomerModal) closeEditCustomerModal();
    });
  }

  if (editCustomerForm) {
    editCustomerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const token = sessionStorage.getItem('packing_orbit_session');
      const errBox = editCustomerErrorMsg;
      if (errBox) errBox.style.display = 'none';

      const mobile = document.getElementById('editCustomerMobile').value.trim();
      const partyName = document.getElementById('editCustomerParty').value.trim();
      const pin = document.getElementById('editCustomerPin').value.trim();
      if (!/^\d{10}$/.test(mobile) || !partyName) {
        if (errBox) { errBox.textContent = '10-digit mobile aur party name zaroori hai.'; errBox.style.display = 'block'; }
        return;
      }

      const payload = {
        id: document.getElementById('editCustomerId').value,
        firmId: (currentUser && currentUser.firmId) ? currentUser.firmId : null,
        mobileNumber: mobile,
        partyName,
        pin
      };

      try {
        const res = await fetch('/api/admin/customers/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          closeEditCustomerModal();
          editCustomerForm.reset();
          loadAdminCustomerList();
          alert(data.message || 'Customer update ho gaya!');
        } else if (errBox) {
          errBox.textContent = data.message || 'Update nahi ho paya.';
          errBox.style.display = 'block';
        }
      } catch (err) {
        if (errBox) { errBox.textContent = 'Server error: ' + err.message; errBox.style.display = 'block'; }
      }
    });
  }

  // License certificate modal
  const certModal = document.getElementById('licenseCertificateModal');
  const certCloseBtn = document.getElementById('licenseCertificateCloseBtn');
  const certCloseBtn2 = document.getElementById('licenseCertificateCloseBtn2');
  const certPrintBtn = document.getElementById('licenseCertificatePrintBtn');
  const closeCertModal = () => { if (certModal) certModal.classList.remove('open'); };
  if (certCloseBtn) certCloseBtn.addEventListener('click', closeCertModal);
  if (certCloseBtn2) certCloseBtn2.addEventListener('click', closeCertModal);
  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) closeCertModal();
    });
  }
  if (certPrintBtn) certPrintBtn.addEventListener('click', () => window.print());
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function firmTypeLabel(type) {
  if (type === 'owner') return 'Owner (Free)';
  if (type === 'testing') return 'Testing (Free)';
  return 'Lifetime';
}

function formatINR(amount) {
  return '₹' + Number(amount || 0).toLocaleString('en-IN');
}

async function loadAdminFirmList() {
  const token = sessionStorage.getItem('packing_orbit_session');
  const tbody = document.getElementById('firmTableBody');
  if (!token || !tbody) return;

  try {
    const res = await fetch('/api/admin/firms', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (!result.success) return;

    firmCache = result.data || [];
    if (result.brand) {
      firmBrandCache = result.brand;
      const brandEl = document.getElementById('firmBrandName');
      if (brandEl) brandEl.textContent = result.brand;
    }

    if (firmCache.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#9ca3af;">Koi firm license nahi. "+ Create Firm" se apni Owner/Testing firm banayein.</td></tr>';
      return;
    }

    tbody.innerHTML = '';
    firmCache.forEach((firm) => {
      const isActive = firm.status === 'active';
      const isFree = firm.license_type === 'owner' || firm.license_type === 'testing';
      const feeText = isFree
        ? 'FREE (₹0)'
        : `${formatINR(firm.license_fee)} · AMC ${formatINR(firm.amc_fee)}/yr`;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <strong>${escapeHtml(firm.firm_name)}</strong><br>
          <span style="font-size:0.68rem; color:#9ca3af;">${escapeHtml(firm.owner_name)} · ${escapeHtml(firm.mobile)}</span>
        </td>
        <td><span class="firm-type-badge firm-type-${firm.license_type}">${firmTypeLabel(firm.license_type)}</span></td>
        <td><code class="firm-key-code">${escapeHtml(firm.license_key)}</code></td>
        <td><span class="license-summary">${feeText}</span>${firm.amc_due_date ? `<br><span style="font-size:0.65rem; color:#9ca3af;">AMC due: ${escapeHtml(firm.amc_due_date)}</span>` : ''}</td>
        <td><span class="status-tag ${isActive ? 'status-active' : 'status-inactive'}">${isActive ? 'Active' : 'Suspended'}</span></td>
        <td>
          <button class="btn-action-reinstate" onclick="openFirmCertificate(${firm.id})">License Copy</button>
          <button class="${isActive ? 'btn-action-remove' : 'btn-action-reinstate'}" onclick="toggleFirmStatus(${firm.id}, '${isActive ? 'suspended' : 'active'}')">${isActive ? 'Suspend' : 'Activate'}</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error loading firm licenses:', err);
  }
}

window.openFirmCertificate = function(firmId) {
  const firm = firmCache.find((f) => f.id === firmId);
  const area = document.getElementById('licenseCertificateArea');
  const modal = document.getElementById('licenseCertificateModal');
  if (!firm || !area || !modal) return;

  const isFree = firm.license_type === 'owner' || firm.license_type === 'testing';
  const brand = firm.brand_name || firmBrandCache;
  const feeText = isFree ? 'Free of Charge (₹0)' : formatINR(firm.license_fee);
  const amcText = isFree ? 'Not Applicable (Free)' : `${formatINR(firm.amc_fee)} / year`;
  const issuedOn = firm.created_at ? String(firm.created_at).substring(0, 10) : '—';

  area.innerHTML = `
    <div class="license-cert-brand">
      <div class="license-cert-logo">PO</div>
      <div>
        <h2>${escapeHtml(brand)}</h2>
        <p>Original Software Brand</p>
      </div>
    </div>

    <div class="license-cert-title">Software License Certificate</div>

    <div class="license-cert-grid">
      <div class="license-cert-item"><span class="label">Licensed Firm</span><span class="value">${escapeHtml(firm.firm_name)}</span></div>
      <div class="license-cert-item"><span class="label">Owner / Authorized Person</span><span class="value">${escapeHtml(firm.owner_name)}</span></div>
      <div class="license-cert-item"><span class="label">License Type</span><span class="value">${firmTypeLabel(firm.license_type)}</span></div>
      <div class="license-cert-item"><span class="label">License Key</span><span class="value">${escapeHtml(firm.license_key)}</span></div>
      <div class="license-cert-item"><span class="label">License Fee</span><span class="value">${feeText}</span></div>
      <div class="license-cert-item"><span class="label">Annual AMC</span><span class="value">${amcText}</span></div>
      <div class="license-cert-item"><span class="label">Issued On</span><span class="value">${escapeHtml(issuedOn)}</span></div>
      <div class="license-cert-item"><span class="label">Next AMC Due</span><span class="value">${escapeHtml(firm.amc_due_date || '—')}</span></div>
      <div class="license-cert-item"><span class="label">Mobile</span><span class="value">${escapeHtml(firm.mobile)}</span></div>
      <div class="license-cert-item"><span class="label">City</span><span class="value">${escapeHtml(firm.city || '—')}</span></div>
    </div>

    <div class="license-cert-terms">
      This software copy is licensed to the firm named above for its own packing operations.
      The application may be operated under the licensed firm's own name, however the original brand
      <strong>${escapeHtml(brand)}</strong> shall remain permanently visible on this license copy and within
      the application. The brand name cannot be removed, altered or replaced. This license is
      non-transferable without written permission from ${escapeHtml(brand)}.
    </div>

    <div class="license-cert-sign">
      <div>Issued by: <strong>${escapeHtml(brand)}</strong></div>
      <div class="sign-line">Authorized Signatory</div>
    </div>
  `;

  modal.classList.add('open');
};

window.toggleFirmStatus = async function(firmId, newStatus) {
  const token = sessionStorage.getItem('packing_orbit_session');
  if (!token) return;

  try {
    const res = await fetch('/api/admin/firms/toggle-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ firmId, newStatus })
    });
    const result = await res.json();
    if (result.success) {
      loadAdminFirmList();
    } else {
      alert(result.message || 'Operation failed');
    }
  } catch (err) {
    alert('Server error: ' + err.message);
  }
};

async function loadAdminLabourList() {
  const token = sessionStorage.getItem('packing_orbit_session');
  if (!token) return;

  try {
    const res = await fetch('/api/admin/employees', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (result.success) {
      const tbody = document.getElementById('labourTableBody');
      const countBadge = document.getElementById('labourCountBadge');
      if (countBadge) countBadge.textContent = `${result.activeCount} / 3 Active`;

      if (tbody) {
        tbody.innerHTML = '';
        if (result.data.length === 0) {
          tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#9ca3af;">Koi labour employee nahi mila.</td></tr>';
          return;
        }

        result.data.forEach(labour => {
          const tr = document.createElement('tr');
          const isActive = labour.is_active === 1;

          tr.innerHTML = `
            <td><strong>${labour.full_name}</strong></td>
            <td><code>${labour.identifier}</code></td>
            <td>
              <span class="status-tag ${isActive ? 'status-active' : 'status-inactive'}">
                ${isActive ? 'Active' : 'Left Job'}
              </span>
            </td>
            <td>
              ${isActive ? `
                <button class="btn-action-remove" onclick="toggleLabourStatus(${labour.id}, 0)">
                  Remove / Left
                </button>
              ` : `
                <button class="btn-action-reinstate" onclick="toggleLabourStatus(${labour.id}, 1)">
                  Re-activate
                </button>
              `}
            </td>
          `;
          tbody.appendChild(tr);
        });
      }
    }
  } catch (err) {
    console.error('Error loading labours:', err);
  }
}

window.toggleLabourStatus = async function(employeeId, newStatus) {
  const token = sessionStorage.getItem('packing_orbit_session');
  if (!token) return;

  try {
    const res = await fetch('/api/admin/employees/toggle-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ employeeId, newStatus })
    });
    const result = await res.json();
    if (result.success) {
      loadAdminLabourList();
    } else {
      alert(result.message || 'Operation failed');
    }
  } catch (err) {
    alert('Server error: ' + err.message);
  }
};

async function loadAdminLoginLogs() {
  const token = sessionStorage.getItem('packing_orbit_session');
  if (!token) return;

  try {
    const res = await fetch('/api/admin/login-logs', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();
    if (result.success) {
      const tbody = document.getElementById('loginLogsTableBody');
      if (tbody) {
        tbody.innerHTML = '';
        if (result.data.length === 0) {
          tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#9ca3af;">Abhi koi login logs nahi hain.</td></tr>';
          return;
        }

        result.data.forEach(log => {
          const tr = document.createElement('tr');
          let roleTagClass = 'admin';
          if (log.role === 'employee') roleTagClass = 'employee';
          if (log.role === 'customer') roleTagClass = 'customer';

          tr.innerHTML = `
            <td><strong>${log.full_name}</strong> <small style="color:#9ca3af;">(${log.identifier})</small></td>
            <td><span class="role-tag ${roleTagClass}">${log.role.toUpperCase()}</span></td>
            <td><code style="color:#38bdf8;">${log.login_time_ist}</code></td>
          `;
          tbody.appendChild(tr);
        });
      }
    }
  } catch (err) {
    console.error('Error loading login logs:', err);
  }
}
