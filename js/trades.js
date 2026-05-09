let activeTab = 'received';

// ─── Tabs ─────────────────────────────────────────────
function switchTab(tab) {
  activeTab = tab;
  ['received', 'sent', 'active'].forEach(t => {
    document.getElementById('panel-' + t).classList.toggle('hidden', t !== tab);
    document.getElementById('tab-' + t).className = t === tab
      ? 'px-4 py-2 rounded-lg text-sm font-semibold bg-white shadow text-slate-800 transition-all'
      : 'px-4 py-2 rounded-lg text-sm font-semibold text-slate-500 transition-all';
  });
  updateBadges();
}

function updateBadges() {
  const db = getDB();
  const recBadge = document.getElementById('badge-received');
  const actBadge = document.getElementById('badge-active');
  recBadge.textContent = db.barterReceived.length || '';
  actBadge.textContent = db.barterActive.length   || '';
  const alert = document.getElementById('barter-alert');
  if (alert) alert.classList.toggle('hidden', db.barterReceived.length === 0);
}

// ─── Render: Propostas Recebidas ─────────────────────
function renderReceived() {
  const db    = getDB();
  const panel = document.getElementById('panel-received');
  const matchColor = m => m >= 90 ? 'text-green-600' : m >= 80 ? 'text-yellow-600' : 'text-slate-500';

  panel.innerHTML = db.barterReceived.length === 0
    ? emptyState('fa-inbox', 'Nenhuma proposta de troca recebida no momento.')
    : db.barterReceived.map(b => `
      <div class="card" id="barter-card-${b.id}">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

          <div class="flex items-start gap-4 flex-1 min-w-0">
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 relative">
              <i class="fa-solid fa-arrows-rotate text-blue-600 text-xl"></i>
              <span class="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                ${b.match}%
              </span>
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap mb-2">
                <span class="badge badge-blue">Proposta de Troca</span>
                <span class="badge badge-yellow">Pendente</span>
              </div>

              <!-- O que eles querem do meu estoque -->
              <div class="flex items-center gap-2 mb-2">
                <div class="flex-1 bg-slate-50 rounded-lg p-2.5 text-xs">
                  <p class="text-slate-400 mb-0.5">Querem de você</p>
                  <p class="font-bold text-slate-800">${b.wantedMaterial}</p>
                  <p class="text-slate-500 mt-0.5"><i class="fa-solid fa-weight-hanging mr-1"></i>${b.wantedQty.toLocaleString('pt-BR')} kg</p>
                </div>
                <div class="flex-shrink-0 w-8 flex items-center justify-center">
                  <i class="fa-solid fa-right-left text-slate-400"></i>
                </div>
                <!-- O que eles oferecem -->
                <div class="flex-1 bg-green-50 rounded-lg p-2.5 text-xs border border-green-200">
                  <p class="text-green-600 mb-0.5">Oferecem em troca</p>
                  <p class="font-bold text-slate-800">${b.offeredMaterial}</p>
                  <p class="text-slate-500 mt-0.5"><i class="fa-solid fa-weight-hanging mr-1"></i>${b.offeredQty.toLocaleString('pt-BR')} kg</p>
                </div>
              </div>

              <p class="text-xs text-slate-500">
                <i class="fa-solid fa-building mr-1"></i>${b.proposer}
                <span class="font-mono ml-1">${b.proposerCnpj}</span>
              </p>
              ${b.message ? `<p class="text-xs text-slate-400 mt-1 italic">"${b.message}"</p>` : ''}
              <p class="${matchColor(b.match)} text-xs font-semibold mt-1">
                <i class="fa-solid fa-chart-simple mr-1"></i>Compatibilidade: ${b.match}%
              </p>
            </div>
          </div>

          <div class="flex gap-2 flex-wrap sm:flex-nowrap flex-shrink-0 sm:flex-col sm:items-end">
            <button onclick="openBarterDetail('${b.id}')" class="btn-secondary text-xs py-2 px-3 w-full sm:w-auto">
              <i class="fa-solid fa-eye mr-1"></i>Detalhes
            </button>
            <div class="flex gap-2 w-full sm:w-auto">
              <button onclick="handleBarterAction('accept','${b.id}')" class="btn-primary text-xs py-2 px-3 flex-1 flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-check"></i>Aceitar
              </button>
              <button onclick="handleBarterAction('refuse','${b.id}')" class="btn-danger text-xs py-2 px-3 flex-1 flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-xmark"></i>Recusar
              </button>
            </div>
          </div>

        </div>
      </div>
    `).join('');
}

// ─── Render: Propostas Enviadas ───────────────────────
function renderSent() {
  const db    = getDB();
  const panel = document.getElementById('panel-sent');

  panel.innerHTML = db.barterSent.length === 0
    ? emptyState('fa-paper-plane', 'Nenhuma proposta de troca enviada no momento.')
    : db.barterSent.map(b => `
      <div class="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-start gap-4 flex-1 min-w-0">
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-paper-plane text-blue-600"></i>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="badge badge-yellow">Aguardando resposta</span>
            </div>

            <div class="flex items-center gap-2 mb-2">
              <div class="flex-1 bg-slate-50 rounded-lg p-2.5 text-xs">
                <p class="text-slate-400 mb-0.5">Você quer</p>
                <p class="font-bold text-slate-800">${b.wantedMaterial}</p>
                <p class="text-slate-500 mt-0.5"><i class="fa-solid fa-weight-hanging mr-1"></i>${b.wantedQty.toLocaleString('pt-BR')} kg</p>
              </div>
              <div class="flex-shrink-0 w-8 flex items-center justify-center">
                <i class="fa-solid fa-right-left text-slate-400"></i>
              </div>
              <div class="flex-1 bg-green-50 rounded-lg p-2.5 text-xs border border-green-200">
                <p class="text-green-600 mb-0.5">Você oferece</p>
                <p class="font-bold text-slate-800">${b.offeredMaterial}</p>
                <p class="text-slate-500 mt-0.5"><i class="fa-solid fa-weight-hanging mr-1"></i>${b.offeredQty.toLocaleString('pt-BR')} kg</p>
              </div>
            </div>

            <p class="text-xs text-slate-500"><i class="fa-solid fa-building mr-1"></i>Para: ${b.target}</p>
          </div>
        </div>
        <button onclick="handleBarterAction('cancel','${b.id}')"
          class="btn-secondary text-xs py-2 px-4 flex-shrink-0 flex items-center gap-1.5 self-start sm:self-auto">
          <i class="fa-solid fa-ban"></i>Cancelar
        </button>
      </div>
    `).join('');
}

// ─── Render: Trocas Ativas ────────────────────────────
function renderActive() {
  const db    = getDB();
  const panel = document.getElementById('panel-active');

  panel.innerHTML = db.barterActive.length === 0
    ? emptyState('fa-arrows-left-right', 'Nenhuma troca ativa no momento.')
    : db.barterActive.map(b => `
      <div class="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-start gap-4 flex-1 min-w-0">
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-arrows-rotate text-blue-600"></i>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="badge ${b.status === 'Em transporte' ? 'badge-blue' : 'badge-yellow'}">${b.status}</span>
            </div>

            <div class="flex items-center gap-2 mb-2">
              <div class="flex-1 bg-slate-50 rounded-lg p-2.5 text-xs">
                <p class="text-slate-400 mb-0.5">Você envia</p>
                <p class="font-bold text-slate-800">${b.myMaterial}</p>
                <p class="text-slate-500 mt-0.5"><i class="fa-solid fa-weight-hanging mr-1"></i>${b.myQty.toLocaleString('pt-BR')} kg</p>
              </div>
              <div class="flex-shrink-0 w-8 flex items-center justify-center">
                <i class="fa-solid fa-right-left text-slate-400"></i>
              </div>
              <div class="flex-1 bg-blue-50 rounded-lg p-2.5 text-xs border border-blue-200">
                <p class="text-blue-600 mb-0.5">Você recebe</p>
                <p class="font-bold text-slate-800">${b.theirMaterial}</p>
                <p class="text-slate-500 mt-0.5"><i class="fa-solid fa-weight-hanging mr-1"></i>${b.theirQty.toLocaleString('pt-BR')} kg</p>
              </div>
            </div>

            <div class="flex gap-3 text-xs text-slate-500 flex-wrap">
              <span><i class="fa-solid fa-building mr-1"></i>Parceiro: ${b.partner}</span>
              <span class="text-green-600 font-semibold"><i class="fa-solid fa-cloud mr-1"></i>${b.co2} tCO₂ evitadas</span>
            </div>
          </div>
        </div>
        <button onclick="showToast('Rastreamento disponível em breve.','info')"
          class="btn-secondary text-xs py-2 px-4 flex-shrink-0 flex items-center gap-1.5">
          <i class="fa-solid fa-location-dot"></i>Rastrear
        </button>
        <button onclick="concludeBarter('${b.id}')"
          class="btn-primary text-xs py-2 px-4 flex-shrink-0 flex items-center gap-1.5">
          <i class="fa-solid fa-circle-check"></i>Concluir
        </button>
      </div>
    `).join('');
}

// ─── Modal de detalhes ────────────────────────────────
function openBarterDetail(id) {
  const db    = getDB();
  const b     = db.barterReceived.find(t => t.id === id);
  if (!b) return;

  document.getElementById('barter-detail-body').innerHTML = `
    <div class="flex items-center gap-2 mb-3">
      <span class="badge badge-blue">Proposta de Troca</span>
      <span class="badge badge-yellow">Pendente</span>
    </div>

    <div class="bg-slate-50 rounded-xl p-4 space-y-2.5 text-sm">
      <div class="flex justify-between">
        <span class="text-slate-500">ID da Proposta</span>
        <span class="font-semibold font-mono text-xs">${b.id}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-500">Empresa Proponente</span>
        <span class="font-semibold">${b.proposer}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-500">CNPJ</span>
        <span class="font-semibold font-mono text-xs">${b.proposerCnpj}</span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="bg-slate-50 rounded-xl p-4 text-sm">
        <p class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Querem de você</p>
        <p class="font-bold text-slate-800 mb-1">${b.wantedMaterial}</p>
        <p class="text-slate-500"><i class="fa-solid fa-weight-hanging mr-1"></i>${b.wantedQty.toLocaleString('pt-BR')} kg</p>
      </div>
      <div class="bg-green-50 border border-green-200 rounded-xl p-4 text-sm">
        <p class="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">Oferecem em troca</p>
        <p class="font-bold text-slate-800 mb-1">${b.offeredMaterial}</p>
        <p class="text-slate-500"><i class="fa-solid fa-weight-hanging mr-1"></i>${b.offeredQty.toLocaleString('pt-BR')} kg</p>
      </div>
    </div>

    ${b.message ? `
    <div class="bg-slate-50 rounded-xl p-3 text-sm">
      <p class="text-xs text-slate-400 mb-1">Mensagem do proponente</p>
      <p class="text-slate-600 italic">"${b.message}"</p>
    </div>` : ''}

    <div class="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700 flex items-start gap-2">
      <i class="fa-solid fa-leaf text-blue-500 mt-0.5 flex-shrink-0"></i>
      <span>Compatibilidade de <strong>${b.match}%</strong>. Esta troca evitaria aproximadamente
        <strong>${((b.wantedQty + b.offeredQty) * 0.0006).toFixed(1)} tCO₂</strong> de emissões.</span>
    </div>`;

  document.getElementById('barter-detail-actions').innerHTML = `
    <button onclick="closeModal('modal-barter')" class="btn-secondary">Fechar</button>
    <button onclick="handleBarterAction('refuse','${b.id}'); closeModal('modal-barter')" class="btn-danger">Recusar</button>
    <button onclick="handleBarterAction('accept','${b.id}'); closeModal('modal-barter')" class="btn-primary">
      <i class="fa-solid fa-check mr-1.5"></i>Aceitar Troca
    </button>`;

  openModal('modal-barter');
}

// ─── Ações sobre propostas ────────────────────────────
function handleBarterAction(action, id) {
  const db = getDB();

  if (action === 'accept') {
    const idx = db.barterReceived.findIndex(b => b.id === id);
    if (idx > -1) {
      const b = db.barterReceived[idx];
      db.barterActive.unshift({
        id:            b.id,
        myMaterial:    b.wantedMaterial,
        myQty:         b.wantedQty,
        theirMaterial: b.offeredMaterial,
        theirQty:      b.offeredQty,
        partner:       b.proposer,
        co2:           parseFloat(((b.wantedQty + b.offeredQty) * 0.0006).toFixed(1)),
        status:        'Aguardando coleta',
      });
      db.barterReceived.splice(idx, 1);
      saveDB(db);
      showToast('Proposta de troca aceita! O proponente foi notificado.', 'success');
    }
  } else if (action === 'refuse') {
    const idx = db.barterReceived.findIndex(b => b.id === id);
    if (idx > -1) { db.barterReceived.splice(idx, 1); saveDB(db); }
    showToast('Proposta de troca recusada. O proponente foi informado.', 'warning');
  } else if (action === 'cancel') {
    const idx = db.barterSent.findIndex(b => b.id === id);
    if (idx > -1) { db.barterSent.splice(idx, 1); saveDB(db); }
    showToast('Proposta de troca cancelada.', 'warning');
  }

  renderAll();
  updateBadges();
}

// ─── Concluir troca ativa ────────────────────────
function concludeBarter(id) {
  if (!confirm('Confirmar conclusão desta troca?')) return;
  const db  = getDB();
  const idx = db.barterActive.findIndex(b => b.id === id);
  if (idx > -1) {
    const b = db.barterActive[idx];
    if (!db.barterHistory) db.barterHistory = [];
    db.barterHistory.unshift({
      id:            b.id,
      myMaterial:    b.myMaterial,
      myQty:         b.myQty,
      theirMaterial: b.theirMaterial,
      theirQty:      b.theirQty,
      partner:       b.partner,
      co2:           b.co2 + ' tCO₂',
      concluded:     today(),
      status:        'Concluída',
    });
    db.barterActive.splice(idx, 1);
    saveDB(db);
    renderAll();
    updateBadges();
    showToast('Troca concluída e adicionada ao histórico!', 'success');
  }
}

// ─── Auxiliares ───────────────────────────────────────
function renderAll() {
  renderReceived();
  renderSent();
  renderActive();
}

function emptyState(icon, msg) {
  return `<div class="card text-center py-12 text-slate-400">
    <i class="fa-solid ${icon} text-3xl mb-3 block"></i>
    <p class="font-medium">${msg}</p>
  </div>`;
}

document.addEventListener('DOMContentLoaded', () => {
  initLayout('Gestão de Trocas', 'trades');
  renderAll();
  updateBadges();
});
