function renderDemands() {
  const db = getDB();
  const urgencyBadge = u =>
    u === 'Alta'  ? 'badge-red'    :
    u === 'Média' ? 'badge-yellow' : 'badge-gray';
  const statusBadge = s =>
    s === 'Aberta'     ? 'badge-blue'  :
    s === 'Com Match'  ? 'badge-green' : 'badge-gray';

  const grid = document.getElementById('demands-grid');

  if (db.demands.length === 0) {
    grid.innerHTML = `
      <div class="col-span-3 card text-center py-12 text-slate-400">
        <i class="fa-solid fa-magnifying-glass-dollar text-3xl mb-3 block"></i>
        <p class="font-medium">Nenhuma demanda registrada.</p>
        <button onclick="openModal('modal-demand')" class="btn-primary mt-4 mx-auto">
          Registrar primeira demanda
        </button>
      </div>`;
    return;
  }

  grid.innerHTML = db.demands.map(d => `
    <div class="card flex flex-col">
      <div class="flex items-center justify-between mb-3">
        <span class="badge ${statusBadge(d.status)}">${d.status}</span>
        <span class="badge ${urgencyBadge(d.urgency)}">Urgência: ${d.urgency}</span>
      </div>
      <h3 class="font-bold text-slate-800 mb-1">${d.name}</h3>
      <p class="text-slate-500 text-xs mb-3">
        <i class="fa-solid fa-tag mr-1"></i>${d.category}
      </p>
      <div class="flex gap-3 text-xs mb-4">
        <div class="flex-1 bg-slate-50 rounded-lg p-2 text-center">
          <p class="text-slate-400">Volume</p>
          <p class="font-bold text-slate-800 mt-0.5">${d.qty.toLocaleString('pt-BR')} kg</p>
        </div>
        <div class="flex-1 bg-slate-50 rounded-lg p-2 text-center">
          <p class="text-slate-400">Estado</p>
          <p class="font-bold text-slate-800 mt-0.5">${d.uf}</p>
        </div>
      </div>
      ${d.status === 'Com Match' ? `
        <div class="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700 font-semibold mb-3 flex items-center gap-2">
          <i class="fa-solid fa-bolt text-green-500"></i>Match automático encontrado!
        </div>` : ''}
      <div class="mt-auto flex gap-2">
        <button onclick="closeDemand(${d.id})" class="btn-secondary flex-1 text-xs py-2">
          Encerrar
        </button>
        ${d.status === 'Com Match' ? `
          <a href="./trades.html" class="btn-primary flex-1 text-center text-xs py-2 no-underline">
            Ver Matches
          </a>` : ''}
      </div>
    </div>
  `).join('');
}

function closeDemand(id) {
  if (!confirm('Deseja encerrar esta demanda?')) return;
  const db  = getDB();
  const idx = db.demands.findIndex(d => d.id === id);
  if (idx > -1) {
    db.demands.splice(idx, 1);
    saveDB(db);
    renderDemands();
    showToast('Demanda encerrada.', 'warning');
  }
}

function handleAddDemand(e) {
  e.preventDefault();
  const name    = document.getElementById('demand-name').value.trim();
  const cat     = document.getElementById('demand-cat').value;
  const qty     = parseInt(document.getElementById('demand-qty').value);
  const urgency = document.getElementById('demand-urgency').value;
  const uf      = document.getElementById('demand-uf').value;

  if (!name || !cat || !qty) {
    showToast('Preencha todos os campos obrigatórios.', 'error');
    return;
  }

  const db = getDB();
  db.demands.unshift({ id: Date.now(), name, category: cat, qty, uf, urgency, status: 'Aberta' });
  saveDB(db);
  renderDemands();
  closeModal('modal-demand');
  e.target.reset();
  showToast(`Demanda por "${name}" registrada com sucesso!`, 'success');
}

document.addEventListener('DOMContentLoaded', () => {
  initLayout('Minhas Demandas', 'demands');
  renderDemands();
});
