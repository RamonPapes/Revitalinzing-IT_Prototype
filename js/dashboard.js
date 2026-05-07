function renderStockTable() {
  const db = getDB();
  const statusBadge = s =>
    s === 'Disponível' ? 'badge-green' :
    s === 'Reservado'  ? 'badge-yellow' : 'badge-blue';

  document.getElementById('stock-table-body').innerHTML = db.stock.slice(0, 5).map(item => `
    <tr class="table-row border-b border-slate-50">
      <td class="py-3 px-3 font-medium text-slate-800">${item.name}</td>
      <td class="py-3 px-3 text-slate-500 hidden sm:table-cell">${item.category}</td>
      <td class="py-3 px-3 font-semibold">${item.qty.toLocaleString('pt-BR')}</td>
      <td class="py-3 px-3 text-slate-500 hidden md:table-cell">${item.updated}</td>
      <td class="py-3 px-3"><span class="badge ${statusBadge(item.status)}">${item.status}</span></td>
    </tr>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  initLayout('Dashboard', 'dashboard');
  renderStockTable();
});
