// ─── Auth ─────────────────────────────────────────────
function getUser() {
  try { return JSON.parse(localStorage.getItem('rit_session')); } catch { return null; }
}

function checkAuth() {
  if (!getUser()) {
    window.location.href = '../index.html';
  }
}

function handleLogout() {
  localStorage.removeItem('rit_session');
  window.location.href = '../index.html';
}

// ─── Toast ────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const icons = {
    success: 'fa-circle-check text-green-500',
    error:   'fa-circle-xmark text-red-500',
    info:    'fa-circle-info text-blue-500',
    warning: 'fa-triangle-exclamation text-yellow-500',
  };
  const borders = {
    success: 'border-green-200',
    error:   'border-red-200',
    info:    'border-blue-200',
    warning: 'border-yellow-200',
  };

  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast pointer-events-auto bg-white border ${borders[type] || borders.info} rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 text-sm font-medium text-slate-700`;
  toast.style.cssText = 'opacity:0; transform:translateX(1rem);';
  toast.innerHTML = `
    <i class="fa-solid ${icons[type] || icons.info} text-lg flex-shrink-0"></i>
    <span class="flex-1">${msg}</span>
    <button onclick="this.parentElement.remove()" class="ml-2 text-slate-400 hover:text-slate-600">
      <i class="fa-solid fa-xmark text-xs"></i>
    </button>`;
  container.appendChild(toast);
  requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateX(0)'; });
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 4000);
}

// ─── Modals ───────────────────────────────────────────
function openModal(id)  { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

// ─── Mobile Sidebar ───────────────────────────────────
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.remove('hidden');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.add('hidden');
}

// ─── Nav definition ───────────────────────────────────
const NAV_ITEMS = [
  { group: 'Principal' },
  { id: 'dashboard',     label: 'Dashboard',          icon: 'fa-house-chimney',           href: 'dashboard.html'     },
  { id: 'marketplace',   label: 'Marketplace',         icon: 'fa-store',                   href: 'marketplace.html'   },
  { group: 'Gestão' },
  { id: 'announcements', label: 'Meus Anúncios',       icon: 'fa-bullhorn',                href: 'announcements.html' },
  { id: 'demands',       label: 'Minhas Demandas',     icon: 'fa-magnifying-glass-dollar', href: 'demands.html'       },
  { id: 'stock',         label: 'Estoque',              icon: 'fa-boxes-stacked',           href: 'stock.html'         },
  { id: 'trades',        label: 'Gestão de Trocas',    icon: 'fa-arrows-left-right',       href: 'trades.html'        },
  { id: 'history',       label: 'Histórico de Trocas', icon: 'fa-clock-rotate-left',       href: 'history.html'       },
  { group: 'Relatórios' },
  { id: 'esg', label: 'Relatório ESG', icon: 'fa-leaf', href: '#', onclick: "showToast('Relatório ESG em desenvolvimento.','info'); return false;" },
];

// ─── Layout builders ──────────────────────────────────
function buildSidebar(user, activeNav) {
  const initials = (user.name || '')
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const navHtml = NAV_ITEMS.map(item => {
    if (item.group) {
      return `<p class="sidebar-group">${item.group}</p>`;
    }
    const isActive = item.id === activeNav ? 'active' : '';
    const onclickAttr = item.onclick ? `onclick="${item.onclick}"` : '';
    return `
      <a href="${item.href}" class="sidebar-link ${isActive}" ${onclickAttr}>
        <i class="fa-solid ${item.icon} w-5 text-center text-sm"></i>
        <span>${item.label}</span>
      </a>`;
  }).join('');

  return `
    <aside id="sidebar" class="fixed top-0 left-0 h-full w-64 bg-slate-900 z-40 flex flex-col">
      <!-- Logo -->
      <div class="flex items-center gap-3 px-5 py-5 border-b border-slate-700">
        <div class="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <i class="fa-solid fa-recycle text-white"></i>
        </div>
        <div>
          <span class="text-white font-bold text-lg leading-none">R-IT</span>
          <p class="text-slate-400 text-xs">Revitalizing-it</p>
        </div>
        <button onclick="closeSidebar()" class="ml-auto text-slate-400 hover:text-white lg:hidden">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- User info -->
      <div class="px-5 py-4 border-b border-slate-700">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            ${initials}
          </div>
          <div class="min-w-0">
            <p class="text-white text-sm font-semibold truncate">${user.name}</p>
            <p class="text-slate-400 text-xs truncate">${user.cnpj}</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-2 overflow-y-auto space-y-0.5">${navHtml}</nav>

      <!-- Logout -->
      <div class="px-3 py-4 border-t border-slate-700">
        <button onclick="handleLogout()" class="sidebar-link text-red-400 hover:bg-red-900/30 hover:text-red-300">
          <i class="fa-solid fa-right-from-bracket w-5 text-center text-sm"></i>
          <span>Sair da plataforma</span>
        </button>
      </div>
    </aside>
    <div id="sidebar-overlay" class="fixed inset-0 bg-black/50 z-30 hidden lg:hidden" onclick="closeSidebar()"></div>`;
}

function buildHeader(pageTitle) {
  return `
    <header class="sticky top-0 z-20 bg-white border-b border-slate-200 px-5 py-3 flex items-center gap-4 shadow-sm">
      <button onclick="openSidebar()" class="lg:hidden text-slate-500 hover:text-slate-800">
        <i class="fa-solid fa-bars text-xl"></i>
      </button>
      <div class="text-lg font-bold text-slate-800">${pageTitle}</div>
      <div class="ml-auto flex items-center gap-3">
        <a href="./publish.html" class="btn-primary hidden sm:inline-flex items-center gap-2 py-2 px-4 text-sm">
          <i class="fa-solid fa-plus text-xs"></i>Publicar Anúncio
        </a>
        <button
          class="relative w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
          onclick="showToast('Você tem 2 notificações pendentes.','info')"
        >
          <i class="fa-regular fa-bell"></i>
          <span class="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>`;
}

// ─── initLayout ───────────────────────────────────────
function initLayout(pageTitle, activeNav) {
  checkAuth();
  const user = getUser();
  document.getElementById('sidebar-container').innerHTML = buildSidebar(user, activeNav);
  document.getElementById('header-container').innerHTML  = buildHeader(pageTitle);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeSidebar();
      document.querySelectorAll('[id^="modal-"]').forEach(m => m.classList.add('hidden'));
    }
  });
}

// ─── Utilities ────────────────────────────────────────
function fmtBRL(n) {
  return Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function today() {
  return new Date().toLocaleDateString('pt-BR');
}

function validateCNPJ(cnpj) {
  cnpj = cnpj.replace(/\D/g, '');
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  let s = 0, r;
  for (let i = 0; i < 12; i++) s += +cnpj[i] * (i < 4 ? 5 - i : 13 - i);
  r = s % 11 < 2 ? 0 : 11 - s % 11;
  if (+cnpj[12] !== r) return false;
  s = 0;
  for (let i = 0; i < 13; i++) s += +cnpj[i] * (i < 5 ? 6 - i : 14 - i);
  r = s % 11 < 2 ? 0 : 11 - s % 11;
  return +cnpj[13] === r;
}

function maskCNPJ(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 14);
  if (v.length > 12)     v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2}).*/, '$1.$2.$3/$4-$5');
  else if (v.length > 8) v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4}).*/, '$1.$2.$3/$4');
  else if (v.length > 5) v = v.replace(/^(\d{2})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
  else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,3}).*/, '$1.$2');
  input.value = v;
}
