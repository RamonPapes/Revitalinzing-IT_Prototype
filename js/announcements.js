function renderAnnouncements() {
  const db = getDB();
  const statusBadge = s =>
    s === 'Ativo'     ? 'badge-green'  :
    s === 'Pendente'  ? 'badge-yellow' : 'badge-gray';

  document.getElementById('announcements-body').innerHTML = db.announcements.length === 0
    ? `<tr><td colspan="7" class="py-10 text-center text-slate-400">Nenhum anúncio encontrado.</td></tr>`
    : db.announcements.map(a => `
      <tr class="table-row border-b border-slate-50">
        <td class="py-3 px-3 font-medium text-slate-800">${a.name}</td>
        <td class="py-3 px-3 text-slate-500 hidden sm:table-cell">${a.category}</td>
        <td class="py-3 px-3">${a.qty}</td>
        <td class="py-3 px-3 font-semibold">${a.price}</td>
        <td class="py-3 px-3 text-slate-500 hidden md:table-cell">${a.published}</td>
        <td class="py-3 px-3"><span class="badge ${statusBadge(a.status)}">${a.status}</span></td>
        <td class="py-3 px-3">
          <div class="flex gap-1.5">
            <button onclick="showToast('Edição disponível em breve.','info')"
              class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 text-xs" title="Editar">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button onclick="closeAnnouncement(${a.id})"
              class="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 text-xs" title="Encerrar">
              <i class="fa-solid fa-ban"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
}

function closeAnnouncement(id) {
  if (!confirm('Deseja encerrar este anúncio? Esta ação não pode ser desfeita.')) return;

  const db  = getDB();
  const idx = db.announcements.findIndex(a => a.id === id);
  if (idx > -1) {
    db.announcements[idx].status = 'Encerrado';
    saveDB(db);
    renderAnnouncements();
    showToast('Anúncio encerrado com sucesso.', 'warning');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initLayout('Meus Anúncios', 'announcements');
  renderAnnouncements();
});
