// ─── Estado ───────────────────────────────────────────
let currentView = 'grid';
let currentItemId = null;

// ─── Filtros e renderização ───────────────────────────
function getFiltered() {
  const db = getDB();
  const search = (document.getElementById('mkt-search').value || '').toLowerCase();
  const type = (document.getElementById('mkt-type').value || '').toLowerCase();
  const state = (document.getElementById('mkt-state').value || '').toLowerCase();
  const vol = parseInt(document.getElementById('mkt-vol').value) || 0;

  return db.marketplace.filter(item =>
    (!search || item.name.toLowerCase().includes(search) || item.company.toLowerCase().includes(search)) &&
    (!type || item.category.toLowerCase().includes(type)) &&
    (!state || item.uf.toLowerCase() === state) &&
    (item.qty >= vol)
  );
}

function renderMarketplace() {
  const items = getFiltered();
  document.getElementById('mkt-count').textContent = items.length;
  renderGrid(items);
  renderList(items);
}

function renderGrid(items) {
  document.getElementById('mkt-grid').innerHTML = items.length === 0
    ? `<div class="col-span-3 card text-center py-12 text-slate-400">
         <i class="fa-solid fa-magnifying-glass text-3xl mb-3 block"></i>
         <p class="font-medium">Nenhum anúncio encontrado com os filtros selecionados.</p>
       </div>`
    : items.map(item => `
      <div class="card flex flex-col">
        <div class="flex items-start justify-between mb-3">
          <span class="badge badge-blue">${item.category}</span>
          ${item.cert ? '<span class="badge badge-green"><i class="fa-solid fa-certificate mr-1"></i>Certificado</span>' : ''}
        </div>
        <h3 class="font-bold text-slate-800 mb-1">${item.name}</h3>
        <p class="text-slate-500 text-xs mb-3 flex items-center gap-1.5">
          <i class="fa-solid fa-building"></i>${item.company}
        </p>
        <div class="grid grid-cols-3 gap-2 mb-3 text-center">
          <div class="bg-slate-50 rounded-lg p-2">
            <p class="text-xs text-slate-400 font-medium">Volume</p>
            <p class="text-sm font-bold text-slate-800 mt-0.5">${item.qty.toLocaleString('pt-BR')} kg</p>
          </div>
          <div class="bg-slate-50 rounded-lg p-2">
            <p class="text-xs text-slate-400 font-medium">Preço/kg</p>
            <p class="text-sm font-bold text-slate-800 mt-0.5">R$${fmtBRL(item.price)}</p>
          </div>
          <div class="bg-slate-50 rounded-lg p-2">
            <p class="text-xs text-slate-400 font-medium">UF</p>
            <p class="text-sm font-bold text-slate-800 mt-0.5">${item.uf}</p>
          </div>
        </div>
        <p class="text-xs text-slate-400 mb-4">
          <i class="fa-solid fa-circle-info mr-1"></i>Condição: ${item.condition}
        </p>
        <div class="mt-auto flex gap-2">
          <button onclick="openInterestModal(${item.id})"
            class="btn-primary flex-1 text-xs py-2">
            <i class="fa-solid fa-paper-plane mr-1.5"></i>Tenho Interesse
          </button>
          <button onclick="showToast('Item salvo nos favoritos.','info')"
            class="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-green-600 hover:border-green-300 transition-all flex-shrink-0"
            title="Favoritar">
            <i class="fa-regular fa-bookmark text-sm"></i>
          </button>
        </div>
      </div>
    `).join('');
}

function renderList(items) {
  document.getElementById('mkt-list-body').innerHTML = items.length === 0
    ? `<tr><td colspan="6" class="py-10 text-center text-slate-400">Nenhum anúncio encontrado.</td></tr>`
    : items.map(item => `
      <tr class="table-row border-b border-slate-50">
        <td class="py-3 px-3 font-medium text-slate-800">${item.name}</td>
        <td class="py-3 px-3 text-slate-500 text-xs">${item.company}</td>
        <td class="py-3 px-3">${item.qty.toLocaleString('pt-BR')}</td>
        <td class="py-3 px-3 text-slate-500">${item.uf}</td>
        <td class="py-3 px-3 font-semibold">R$${fmtBRL(item.price)}</td>
        <td class="py-3 px-3">
          <button onclick="openInterestModal(${item.id})" class="btn-primary py-1.5 px-3 text-xs">
            <i class="fa-solid fa-paper-plane mr-1"></i>Interesse
          </button>
        </td>
      </tr>
    `).join('');
}

function setView(v) {
  currentView = v;
  document.getElementById('mkt-grid').classList.toggle('hidden', v !== 'grid');
  document.getElementById('mkt-list').classList.toggle('hidden', v !== 'list');
  document.getElementById('btn-grid').className = `w-9 h-9 rounded-lg flex items-center justify-center ${v === 'grid' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-500'}`;
  document.getElementById('btn-list').className = `w-9 h-9 rounded-lg flex items-center justify-center ${v === 'list' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-500'}`;
}

// ─── Modal de interesse e Troca ───────────────────────────────

// Nova função: Exibe ou oculta a div de opções de troca
function toggleTradeOptions() {
  const isChecked = document.getElementById('offer-trade').checked;
  const tradeDiv  = document.getElementById('trade-options');
  const submitBtn = document.getElementById('btn-interest-submit');
  if (isChecked) {
    tradeDiv.classList.remove('hidden');
    if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-arrows-rotate mr-1.5"></i>Propor Troca';
  } else {
    tradeDiv.classList.add('hidden');
    if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane mr-1.5"></i>Enviar Interesse';
  }
}

function openInterestModal(id) {
  const db = getDB();
  const item = db.marketplace.find(i => i.id === id);
  if (!item) return;
  currentItemId = id;

  document.getElementById('interest-title').textContent = item.name;
  document.getElementById('interest-subtitle').textContent = `${item.company} — ${item.uf}`;
  document.getElementById('interest-info').innerHTML = `
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
        <i class="fa-solid fa-box-open text-green-600"></i>
      </div>
      <div>
        <p class="font-bold text-slate-800">${item.name}</p>
        <p class="text-xs text-slate-500">${item.category} · Condição: ${item.condition}</p>
      </div>
    </div>
    <div class="flex flex-wrap gap-4 text-xs text-slate-600">
      <span><b>Disponível:</b> ${item.qty.toLocaleString('pt-BR')} kg</span>
      <span><b>Preço/kg:</b> R$${fmtBRL(item.price)}</span>
      <span><b>Local:</b> ${item.uf}</span>
    </div>`;

  // Reseta os campos padrões
  document.getElementById('interest-qty').value = '';
  document.getElementById('interest-msg').value = '';

  // Reseta os campos de troca
  document.getElementById('offer-trade').checked = false;
  document.getElementById('trade-qty').value = '';
  toggleTradeOptions(); // Garante que a div de troca fique oculta

  // Preenche as opções de estoque para a troca
  const tradeSelect = document.getElementById('trade-item');
  const stockItems  = db.stock.filter(s => s.status === 'Disponível');

  if (stockItems.length === 0) {
    tradeSelect.innerHTML = '<option value="">Sem itens disponíveis no estoque</option>';
    tradeSelect.disabled = true;
  } else {
    tradeSelect.disabled = false;
    tradeSelect.innerHTML = '<option value="">Selecione um material...</option>' +
      stockItems.map(s => `<option value="${s.id}">${s.name} — ${s.qty.toLocaleString('pt-BR')} kg disp.</option>`).join('');
  }

  openModal('modal-interest');
}

function handleInterest() {
  const db = getDB();
  const item = db.marketplace.find(i => i.id === currentItemId);
  const qty = parseInt(document.getElementById('interest-qty').value);

  // Validação básica
  if (!qty || qty <= 0) { showToast('Informe uma quantidade válida.', 'error'); return; }
  if (qty > item.qty) { showToast(`Quantidade máxima disponível: ${item.qty.toLocaleString('pt-BR')} kg.`, 'error'); return; }

  // Captura as opções de troca
  const isTradeOffered = document.getElementById('offer-trade').checked;

  if (isTradeOffered) {
    // ── Proposta de TROCA → vai para barterSent / Gestão de Trocas ──
    const tradeItemId = document.getElementById('trade-item').value;
    const tradeQty    = parseInt(document.getElementById('trade-qty').value);

    if (!tradeItemId) { showToast('Selecione um item do estoque para oferecer.', 'error'); return; }
    if (!tradeQty || tradeQty <= 0) { showToast('Informe a quantidade a oferecer.', 'error'); return; }

    const myItem = db.stock.find(s => s.id == tradeItemId);
    if (myItem && tradeQty > myItem.qty) {
      showToast(`Você só possui ${myItem.qty.toLocaleString('pt-BR')} kg de ${myItem.name} no estoque.`, 'error');
      return;
    }

    if (!db.barterSent) db.barterSent = [];
    db.barterSent.unshift({
      id:              `BT-${Date.now()}`,
      wantedMaterial:  item.name,
      wantedQty:       qty,
      offeredMaterial: myItem ? myItem.name : 'Desconhecido',
      offeredQty:      tradeQty,
      target:          item.company,
      status:          'Aguardando',
    });
    saveDB(db);
    closeModal('modal-interest');
    showToast(`Proposta de troca por "${item.name}" enviada! Acompanhe em Gestão de Trocas.`, 'success');
  } else {
    // ── Proposta de COMPRA → vai para tradesSent / Gestão de Compra/Venda ──
    db.tradesSent.unshift({
      id:       `TR-${Date.now()}`,
      material: item.name,
      target:   item.company,
      qty,
      price:    item.price,
      status:   'Aguardando',
    });
    saveDB(db);
    closeModal('modal-interest');
    showToast(`Interesse em "${item.name}" enviado com sucesso!`, 'success');
  }
}

// ─── Init ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initLayout('Marketplace', 'marketplace');
  renderMarketplace();
});
