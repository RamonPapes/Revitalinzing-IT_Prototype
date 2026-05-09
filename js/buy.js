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
  document.getElementById('badge-received').textContent = db.tradesReceived.length || '';
  document.getElementById('badge-active').textContent   = db.tradesActive.length   || '';
  const alert = document.getElementById('match-alert');
  if (alert) alert.classList.toggle('hidden', db.tradesReceived.length === 0);
}

// ─── Render: Propostas Recebidas ──────────────────────
function renderReceived() {
  const db    = getDB();
  const panel = document.getElementById('panel-received');
  const matchColor = m => m >= 90 ? 'text-green-600' : m >= 80 ? 'text-yellow-600' : 'text-slate-500';

  panel.innerHTML = db.tradesReceived.length === 0
    ? emptyState('fa-inbox', 'Nenhuma proposta recebida no momento.')
    : db.tradesReceived.map(t => `
      <div class="card" id="trade-card-${t.id}">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

          <div class="flex items-start gap-4 flex-1 min-w-0">
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 relative">
              <i class="fa-solid fa-arrows-rotate text-green-600 text-xl"></i>
              <span class="absolute -top-1 -right-1 w-6 h-6 bg-green-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                ${t.match}%
              </span>
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap mb-1">
                <span class="badge badge-blue">Proposta de Troca</span>
                <span class="badge badge-yellow">Pendente</span>
              </div>
              <h3 class="font-bold text-slate-800 mb-0.5">${t.material}</h3>
              <p class="text-sm text-slate-500 mb-2">
                <i class="fa-solid fa-building mr-1"></i>${t.proposer} — <span class="font-mono text-xs">${t.proposerCnpj}</span>
              </p>
              <div class="flex gap-3 text-xs text-slate-500 flex-wrap">
                <span><i class="fa-solid fa-weight-hanging mr-1"></i>${t.qty.toLocaleString('pt-BR')} kg</span>
                <span><i class="fa-solid fa-tag mr-1"></i>R$${fmtBRL(t.price)}/kg</span>
                <span class="font-semibold text-green-700"><i class="fa-solid fa-dollar-sign mr-1"></i>Total: R$${fmtBRL(t.qty * t.price)}</span>
                <span class="${matchColor(t.match)} font-semibold"><i class="fa-solid fa-chart-simple mr-1"></i>Match: ${t.match}%</span>
              </div>
            </div>
          </div>

          <div class="flex gap-2 flex-wrap sm:flex-nowrap flex-shrink-0 sm:flex-col sm:items-end">
            <button onclick="openTradeDetail('${t.id}')" class="btn-secondary text-xs py-2 px-3 w-full sm:w-auto">
              <i class="fa-solid fa-eye mr-1"></i>Detalhes
            </button>
            <div class="flex gap-2 w-full sm:w-auto">
              <button onclick="handleTradeAction('accept','${t.id}')" class="btn-primary text-xs py-2 px-3 flex-1 flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-check"></i>Aceitar
              </button>
              <button onclick="handleTradeAction('refuse','${t.id}')" class="btn-danger text-xs py-2 px-3 flex-1 flex items-center justify-center gap-1.5">
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

  panel.innerHTML = db.tradesSent.length === 0
    ? emptyState('fa-paper-plane', 'Nenhuma proposta enviada no momento.')
    : db.tradesSent.map(t => `
      <div class="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-start gap-4 flex-1 min-w-0">
          <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-paper-plane text-green-600"></i>
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="badge badge-yellow">Aguardando resposta</span>
            </div>
            <h3 class="font-bold text-slate-800 mb-0.5">${t.material}</h3>
            <p class="text-sm text-slate-500 mb-2">
              <i class="fa-solid fa-building mr-1"></i>Para: ${t.target}
            </p>
            <div class="flex gap-3 text-xs text-slate-500">
              <span><i class="fa-solid fa-weight-hanging mr-1"></i>${t.qty.toLocaleString('pt-BR')} kg</span>
              <span><i class="fa-solid fa-tag mr-1"></i>R$${fmtBRL(t.price)}/kg</span>
              <span class="font-semibold text-green-700">Total: R$${fmtBRL(t.qty * t.price)}</span>
            </div>
          </div>
        </div>
        <button onclick="handleTradeAction('cancel','${t.id}')"
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

  panel.innerHTML = db.tradesActive.length === 0
    ? emptyState('fa-arrows-left-right', 'Nenhuma troca ativa no momento.')
    : db.tradesActive.map(t => `
      <div class="card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-start gap-4 flex-1 min-w-0">
          <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <i class="fa-solid fa-arrows-rotate text-green-600"></i>
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="badge ${t.status === 'Em transporte' ? 'badge-blue' : 'badge-yellow'}">${t.status}</span>
            </div>
            <h3 class="font-bold text-slate-800 mb-0.5">${t.material}</h3>
            <p class="text-xs text-slate-500 mb-2">Parceiro: ${t.partner}</p>
            <div class="flex gap-3 text-xs text-slate-500 flex-wrap">
              <span><i class="fa-solid fa-weight-hanging mr-1"></i>${t.qty.toLocaleString('pt-BR')} kg</span>
              <span class="font-semibold text-green-700"><i class="fa-solid fa-dollar-sign mr-1"></i>R$${fmtBRL(t.value)}</span>
              <span class="text-green-600 font-semibold"><i class="fa-solid fa-cloud mr-1"></i>${t.co2} tCO₂ evitadas</span>
            </div>
          </div>
        </div>
        <button onclick="showToast('Rastreamento disponível em breve.','info')"
          class="btn-secondary text-xs py-2 px-4 flex-shrink-0 flex items-center gap-1.5">
          <i class="fa-solid fa-location-dot"></i>Rastrear
        </button>
        <button onclick="concludeTrade('${t.id}')"
          class="btn-primary text-xs py-2 px-4 flex-shrink-0 flex items-center gap-1.5">
          <i class="fa-solid fa-circle-check"></i>Concluir
        </button>
      </div>
    `).join('');
}

// ─── Modal de detalhes ────────────────────────────────
function openTradeDetail(id) {
  const db    = getDB();
  const trade = db.tradesReceived.find(t => t.id === id);
  if (!trade) return;

  document.getElementById('trade-detail-body').innerHTML = `
    <div class="flex items-center gap-2 mb-3">
      <span class="badge badge-blue">Proposta de Troca</span>
      <span class="badge badge-yellow">Pendente</span>
    </div>
    <div class="bg-slate-50 rounded-xl p-4 space-y-2.5 text-sm">
      <div class="flex justify-between">
        <span class="text-slate-500">ID da Proposta</span>
        <span class="font-semibold font-mono text-xs">${trade.id}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-500">Material solicitado</span>
        <span class="font-semibold">${trade.material}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-500">Empresa Proponente</span>
        <span class="font-semibold">${trade.proposer}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-500">CNPJ</span>
        <span class="font-semibold font-mono text-xs">${trade.proposerCnpj}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-500">Quantidade solicitada</span>
        <span class="font-semibold">${trade.qty.toLocaleString('pt-BR')} kg</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-500">Preço por kg</span>
        <span class="font-semibold">R$${fmtBRL(trade.price)}</span>
      </div>
      <div class="flex justify-between border-t border-slate-200 pt-2.5">
        <span class="text-slate-500">Valor Total</span>
        <span class="font-bold text-slate-800 text-base">R$${fmtBRL(trade.qty * trade.price)}</span>
      </div>
      <div class="flex justify-between border-t border-slate-200 pt-2.5">
        <span class="text-slate-500">Compatibilidade</span>
        <span class="font-bold text-green-600">${trade.match}% de match</span>
      </div>
    </div>
    <div class="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-700 flex items-start gap-2">
      <i class="fa-solid fa-leaf text-green-500 mt-0.5 flex-shrink-0"></i>
      <span>Esta troca evitaria aproximadamente
        <strong>${(trade.qty * 0.0012).toFixed(1)} tCO₂</strong> de emissões, contribuindo para o seu score ESG.</span>
    </div>`;

  document.getElementById('trade-detail-actions').innerHTML = `
    <button onclick="closeModal('modal-trade')" class="btn-secondary">Fechar</button>
    <button onclick="handleTradeAction('refuse','${trade.id}'); closeModal('modal-trade')" class="btn-danger">Recusar</button>
    <button onclick="handleTradeAction('accept','${trade.id}'); closeModal('modal-trade')" class="btn-primary">
      <i class="fa-solid fa-check mr-1.5"></i>Aceitar Proposta
    </button>`;

  openModal('modal-trade');
}

// ─── Ações sobre propostas ────────────────────────────
function handleTradeAction(action, id) {
  const db = getDB();

  if (action === 'accept') {
    const idx = db.tradesReceived.findIndex(t => t.id === id);
    if (idx > -1) {
      const t = db.tradesReceived[idx];
      db.tradesActive.unshift({
        id:       t.id,
        material: t.material,
        partner:  t.proposer,
        qty:      t.qty,
        value:    t.qty * t.price,
        co2:      parseFloat((t.qty * 0.0012).toFixed(1)),
        status:   'Aguardando coleta',
      });
      db.tradesReceived.splice(idx, 1);
      saveDB(db);
      showToast('Proposta aceita! O proponente foi notificado.', 'success');
    }
  } else if (action === 'refuse') {
    const idx = db.tradesReceived.findIndex(t => t.id === id);
    if (idx > -1) { db.tradesReceived.splice(idx, 1); saveDB(db); }
    showToast('Proposta recusada. O proponente foi informado.', 'warning');
  } else if (action === 'cancel') {
    const idx = db.tradesSent.findIndex(t => t.id === id);
    if (idx > -1) { db.tradesSent.splice(idx, 1); saveDB(db); }
    showToast('Proposta cancelada. A empresa parceira foi notificada.', 'warning');
  }

  renderAll();
  updateBadges();
}

// ─── Concluir troca ativa ─────────────────────────────
function concludeTrade(id) {
  if (!confirm('Confirmar conclusão desta operação?')) return;
  const db  = getDB();
  const idx = db.tradesActive.findIndex(t => t.id === id);
  if (idx > -1) {
    const t = db.tradesActive[idx];
    db.history.unshift({
      id:       t.id,
      material: t.material,
      partner:  t.partner,
      qty:      t.qty,
      value:    'R$ ' + fmtBRL(t.value),
      co2:      t.co2 + ' tCO₂',
      status:   'Concluída',
    });
    db.tradesActive.splice(idx, 1);
    saveDB(db);
    renderAll();
    updateBadges();
    showToast('Operação concluída e adicionada ao histórico!', 'success');
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
  initLayout('Gestão de Vendas', 'buy');
  renderAll();
  updateBadges();
});
