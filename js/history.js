let activeHistTab = 'sales';

function switchHistTab(tab) {
  activeHistTab = tab;
  ['sales', 'barters'].forEach(t => {
    document.getElementById('panel-' + t).classList.toggle('hidden', t !== tab);
    document.getElementById('tab-' + t).className = t === tab
      ? 'px-4 py-2 rounded-lg text-sm font-semibold bg-white shadow text-slate-800 transition-all'
      : 'px-4 py-2 rounded-lg text-sm font-semibold text-slate-500 transition-all';
  });
}

function renderSummary() {
  const db = getDB();
  const concludedSales   = db.history.filter(h => h.status === 'Concluída').length;
  const concludedBarters = (db.barterHistory || []).filter(b => b.status === 'Concluída').length;
  const totalVolSales    = db.history.reduce((s, h) => s + h.qty, 0);
  const totalVolBarters  = (db.barterHistory || []).reduce((s, b) => s + (b.myQty || 0) + (b.theirQty || 0), 0);
  document.getElementById('sum-sales').textContent   = concludedSales + ' de ' + db.history.length;
  document.getElementById('sum-barters').textContent = concludedBarters + ' de ' + (db.barterHistory || []).length;
  document.getElementById('sum-volume').textContent  = (totalVolSales + totalVolBarters).toLocaleString('pt-BR') + ' kg';

  const co2Sales = db.history.reduce((s, h) => {
    const m = (h.co2 || '').toString().replace(',', '.').match(/[\d.]+/);
    return s + (m ? parseFloat(m[0]) : 0);
  }, 0);
  const co2Barters = (db.barterHistory || []).reduce((s, b) => {
    const m = (b.co2 || '').toString().replace(',', '.').match(/[\d.]+/);
    return s + (m ? parseFloat(m[0]) : 0);
  }, 0);
  document.getElementById('sum-co2').textContent = (co2Sales + co2Barters).toFixed(1).replace('.', ',') + ' tCO2';
}

function renderHistory() {
  const db = getDB();
  const statusBadge = s => s === 'Concluída' ? 'badge-green' : 'badge-red';

  document.getElementById('history-body').innerHTML = db.history.length === 0
    ? '<tr><td colspan="7" class="py-10 text-center text-slate-400">Nenhuma venda registrada no histórico.</td></tr>'
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

function renderBarterHistory() {
  const db = getDB();
  const bh = db.barterHistory || [];
  const statusBadge = s => s === 'Concluída' ? 'badge-green' : 'badge-red';

  document.getElementById('barter-history-body').innerHTML = bh.length === 0
    ? '<tr><td colspan="6" class="py-10 text-center text-slate-400">Nenhuma troca registrada no histórico.</td></tr>'
    : bh.map(b => `
      <tr class="table-row border-b border-slate-50">
        <td class="py-3 px-3 font-mono text-xs text-slate-400">${b.id}</td>
        <td class="py-3 px-3">
          <p class="font-medium text-slate-800">${b.myMaterial}</p>
          <p class="text-xs text-slate-400">${b.myQty.toLocaleString('pt-BR')} kg</p>
        </td>
        <td class="py-3 px-3">
          <p class="font-medium text-slate-800">${b.theirMaterial}</p>
          <p class="text-xs text-slate-400">${b.theirQty.toLocaleString('pt-BR')} kg</p>
        </td>
        <td class="py-3 px-3 text-slate-500 hidden sm:table-cell">${b.partner}</td>
        <td class="py-3 px-3 text-green-600 font-semibold hidden md:table-cell">${b.co2}</td>
        <td class="py-3 px-3"><span class="badge ${statusBadge(b.status)}">${b.status}</span></td>
      </tr>
    `).join('');
}

function exportCSV(type) {
  const db = getDB();
  let rows, filename;
  if (type === 'barters') {
    rows = [
      ['ID', 'Material Enviado', 'Qtd. Enviada (kg)', 'Material Recebido', 'Qtd. Recebida (kg)', 'Parceiro', 'CO2 Evitado', 'Concluido em', 'Status'],
      ...(db.barterHistory || []).map(b => [b.id, b.myMaterial, b.myQty, b.theirMaterial, b.theirQty, b.partner, b.co2, b.concluded || '', b.status]),
    ];
    filename = 'rit-trocas-' + today().replace(/\//g, '-') + '.csv';
  } else {
    rows = [
      ['ID', 'Material', 'Empresa Parceira', 'Quantidade (kg)', 'Valor', 'CO2 Evitado', 'Status'],
      ...db.history.map(h => [h.id, h.material, h.partner, h.qty, h.value, h.co2, h.status]),
    ];
    filename = 'rit-vendas-' + today().replace(/\//g, '-') + '.csv';
  }
  const csv  = rows.map(r => r.join(';')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href  = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  showToast('Exportado em CSV com sucesso!', 'success');
}

document.addEventListener('DOMContentLoaded', () => {
  initLayout('Histórico', 'history');
  renderSummary();
  renderHistory();
  renderBarterHistory();
});
