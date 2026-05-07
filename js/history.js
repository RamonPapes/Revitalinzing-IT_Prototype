function renderHistory() {
  const db = getDB();
  const statusBadge = s => s === 'Concluída' ? 'badge-green' : 'badge-red';

  // Resumo ESG
  const concluded = db.history.filter(h => h.status === 'Concluída');
  const totalQty  = db.history.reduce((sum, h) => sum + h.qty, 0);
  document.getElementById('esg-co2').textContent       = concluded.length + ' registros';
  document.getElementById('esg-concluded').textContent = concluded.length + ' de ' + db.history.length;
  document.getElementById('esg-volume').textContent    = totalQty.toLocaleString('pt-BR') + ' kg';

  document.getElementById('history-body').innerHTML = db.history.length === 0
    ? `<tr><td colspan="7" class="py-10 text-center text-slate-400">Nenhuma troca registrada no histórico.</td></tr>`
    : db.history.map(h => `
      <tr class="table-row border-b border-slate-50">
        <td class="py-3 px-3 font-mono text-xs text-slate-400">${h.id}</td>
        <td class="py-3 px-3 font-medium text-slate-800">${h.material}</td>
        <td class="py-3 px-3 text-slate-500 hidden sm:table-cell">${h.partner}</td>
        <td class="py-3 px-3">${h.qty.toLocaleString('pt-BR')}</td>
        <td class="py-3 px-3 font-semibold hidden md:table-cell">${h.value}</td>
        <td class="py-3 px-3 text-green-600 font-semibold hidden md:table-cell">${h.co2}</td>
        <td class="py-3 px-3"><span class="badge ${statusBadge(h.status)}">${h.status}</span></td>
      </tr>
    `).join('');
}

function exportCSV() {
  const db   = getDB();
  const rows = [
    ['ID', 'Material', 'Empresa Parceira', 'Quantidade (kg)', 'Valor', 'CO2 Evitado', 'Status'],
    ...db.history.map(h => [h.id, h.material, h.partner, h.qty, h.value, h.co2, h.status]),
  ];
  const csv  = rows.map(r => r.join(';')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href  = URL.createObjectURL(blob);
  link.download = `rit-historico-${today().replace(/\//g, '-')}.csv`;
  link.click();
  showToast('Histórico exportado em CSV com sucesso!', 'success');
}

document.addEventListener('DOMContentLoaded', () => {
  initLayout('Histórico de Trocas', 'history');
  renderHistory();
});
