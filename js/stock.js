function renderStock() {
  const db = getDB();
  const statusBadge = s =>
    s === 'Disponível' ? 'badge-green'  :
    s === 'Reservado'  ? 'badge-yellow' : 'badge-blue';

  document.getElementById('stock-body').innerHTML = db.stock.length === 0
    ? `<tr><td colspan="7" class="py-10 text-center text-slate-400">Nenhum item no estoque.</td></tr>`
    : db.stock.map(item => `
      <tr class="table-row border-b border-slate-50">
        <td class="py-3 px-3 font-medium text-slate-800">${item.name}</td>
        <td class="py-3 px-3 text-slate-500 hidden sm:table-cell">${item.category}</td>
        <td class="py-3 px-3 font-semibold">${item.qty.toLocaleString('pt-BR')}</td>
        <td class="py-3 px-3 text-slate-500 hidden md:table-cell">${item.location}</td>
        <td class="py-3 px-3 text-slate-500 hidden md:table-cell">${item.updated}</td>
        <td class="py-3 px-3"><span class="badge ${statusBadge(item.status)}">${item.status}</span></td>
        <td class="py-3 px-3">
          <div class="flex gap-1.5">
            <a href="./publish.html"
              class="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-600 text-xs"
              title="Publicar anúncio">
              <i class="fa-solid fa-bullhorn"></i>
            </a>
            <button onclick="editStock(${item.id})"
              class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-xs"
              title="Editar">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button onclick="removeStock(${item.id})"
              class="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 text-xs"
              title="Remover">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
}

function editStock(id) {
  showToast('Edição de estoque disponível em breve.', 'info');
}

function removeStock(id) {
  if (!confirm('Deseja remover este item do estoque?')) return;
  const db  = getDB();
  const idx = db.stock.findIndex(s => s.id === id);
  if (idx > -1) {
    db.stock.splice(idx, 1);
    saveDB(db);
    renderStock();
    showToast('Item removido do estoque.', 'warning');
  }
}

function handleAddStock(e) {
  e.preventDefault();
  const name = document.getElementById('stock-name').value.trim();
  const cat  = document.getElementById('stock-cat').value;
  const qty  = parseInt(document.getElementById('stock-qty').value);
  const uf   = document.getElementById('stock-uf').value;

  if (!name || !cat || !qty || !uf) {
    showToast('Preencha todos os campos obrigatórios.', 'error');
    return;
  }

  const db = getDB();
  db.stock.unshift({
    id:        Date.now(),
    name,
    category:  cat,
    qty,
    unit:      'kg',
    location:  uf,
    updated:   today(),
    status:    'Disponível',
  });
  saveDB(db);
  renderStock();
  closeModal('modal-stock');
  e.target.reset();
  showToast(`"${name}" adicionado ao estoque com sucesso!`, 'success');
}

document.addEventListener('DOMContentLoaded', () => {
  initLayout('Estoque', 'stock');
  renderStock();
});
