function populateStockSelect() {
  const db  = getDB();
  const sel = document.getElementById('ann-stock-link');
  sel.innerHTML = '<option value="">Selecionar item do estoque...</option>' +
    db.stock
      .filter(s => s.status === 'Disponível')
      .map(s => `<option value="${s.id}">${s.name} — ${s.qty.toLocaleString('pt-BR')} kg disponíveis</option>`)
      .join('');
}

function prefillFromStock(id) {
  if (!id) return;
  const db   = getDB();
  const item = db.stock.find(s => s.id === parseInt(id));
  if (!item) return;

  document.getElementById('ann-name').value     = item.name;
  document.getElementById('ann-category').value = item.category;
  document.getElementById('ann-qty').value      = item.qty;
  document.getElementById('ann-uf').value       = item.location;
  showToast('Campos preenchidos a partir do estoque.', 'info');
}

function handlePublish(e) {
  e.preventDefault();

  const qty   = parseInt(document.getElementById('ann-qty').value);
  const errEl = document.getElementById('ann-qty-error');

  if (!qty || qty <= 0) {
    errEl.classList.add('show');
    document.getElementById('ann-qty').classList.add('error');
    return;
  }
  errEl.classList.remove('show');
  document.getElementById('ann-qty').classList.remove('error');

  const name     = document.getElementById('ann-name').value.trim();
  const category = document.getElementById('ann-category').value;
  const unit     = document.getElementById('ann-unit').value;
  const price    = parseFloat(document.getElementById('ann-price').value) || 0;

  const db = getDB();
  db.announcements.unshift({
    id:        Date.now(),
    name,
    category,
    qty:       `${qty.toLocaleString('pt-BR')} ${unit}`,
    price:     `R$ ${fmtBRL(price)}/${unit}`,
    published: today(),
    status:    'Pendente',
  });
  saveDB(db);

  showToast(`Anúncio "${name}" publicado com sucesso!`, 'success');
  setTimeout(() => { window.location.href = './announcements.html'; }, 1200);
}

document.addEventListener('DOMContentLoaded', () => {
  initLayout('Publicar Anúncio', 'announcements');
  populateStockSelect();

  document.getElementById('ann-qty').addEventListener('input', () => {
    document.getElementById('ann-qty-error').classList.remove('show');
    document.getElementById('ann-qty').classList.remove('error');
  });
});
