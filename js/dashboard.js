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
  // Compute and display ESG score preview
  try {
    const db = getDB();
    const concludedSales   = db.history.filter(h => h.status === 'Concluída').length;
    const concludedBarters = (db.barterHistory || []).filter(b => b.status === 'Concluída').length;
    const activeAnn        = db.announcements.filter(a => a.status === 'Ativo').length;
    const stockItems       = db.stock.filter(s => s.status === 'Disponível').length;
    const openDemands      = db.demands.filter(d => d.status !== 'Encerrada').length;
    const co2 = [...db.history, ...(db.barterHistory || [])].reduce((s, h) => {
      const m = ((h.co2 || '').toString()).replace(',', '.').match(/[\d.]+/);
      return s + (m ? parseFloat(m[0]) : 0);
    }, 0);
    const score = Math.min(concludedSales*5,25) + Math.min(concludedBarters*8,32) +
                  Math.min(Math.floor(co2),20) + Math.min(activeAnn*3,9) +
                  Math.min(stockItems*2,8) + Math.min(openDemands*2,6);
    const grades = [{min:90,l:'A+'},{min:80,l:'A'},{min:70,l:'B'},{min:60,l:'C'},{min:0,l:'D'}];
    const grade  = (grades.find(g => score >= g.min) || grades[grades.length-1]).l;
    document.getElementById('dash-esg-grade').textContent = grade;
    document.getElementById('dash-esg-score').textContent = score;
  } catch(e) {}
});
