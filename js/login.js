// ─── Tab switcher ─────────────────────────────────────
function switchTab(tab) {
  document.getElementById('form-login').classList.toggle('hidden', tab !== 'login');
  document.getElementById('form-register').classList.toggle('hidden', tab !== 'register');

  const active   = 'flex-1 py-2 rounded-lg text-sm font-semibold bg-white shadow text-slate-900 transition-all';
  const inactive = 'flex-1 py-2 rounded-lg text-sm font-semibold text-slate-500 transition-all';

  document.getElementById('tab-login').className    = tab === 'login'    ? active : inactive;
  document.getElementById('tab-register').className = tab === 'register' ? active : inactive;
}

// ─── Login ────────────────────────────────────────────
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');

  if (email === 'admin@techcorp.com' && pass === '123456') {
    errEl.classList.add('hidden');
    localStorage.setItem('rit_session', JSON.stringify({
      name:  'TechCorp Industries',
      cnpj:  '12.345.678/0001-90',
      email: 'admin@techcorp.com',
    }));
    window.location.href = './pages/dashboard.html';
  } else {
    errEl.classList.remove('hidden');
  }
}

// ─── Register ─────────────────────────────────────────
function handleRegister(e) {
  e.preventDefault();

  const cnpj  = document.getElementById('reg-cnpj').value;
  const pass  = document.getElementById('reg-pass').value;
  const pass2 = document.getElementById('reg-pass2').value;
  const cnpjErr = document.getElementById('cnpj-error');

  // Validate CNPJ
  if (!validateCNPJ(cnpj)) {
    cnpjErr.classList.add('show');
    document.getElementById('reg-cnpj').classList.add('error');
    return;
  }
  cnpjErr.classList.remove('show');
  document.getElementById('reg-cnpj').classList.remove('error');

  // Validate passwords
  if (pass !== pass2) {
    showToast('As senhas não coincidem.', 'error');
    return;
  }

  showToast('Empresa cadastrada com sucesso! Aguardando aprovação.', 'success');
  switchTab('login');
  e.target.reset();
}

// ─── Utilities ────────────────────────────────────────
function togglePass(id) {
  const el = document.getElementById(id);
  el.type = el.type === 'password' ? 'text' : 'password';
}

// Se já está logado, redireciona direto para o dashboard
document.addEventListener('DOMContentLoaded', () => {
  if (getUser()) {
    window.location.href = './pages/dashboard.html';
  }
});
