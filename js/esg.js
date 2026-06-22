// ─── ESG Scoring ─────────────────────────────────────
// Max 100 points:
//   Vendas concluídas  : 5 pts each, cap 25
//   Trocas concluídas  : 8 pts each, cap 32
//   CO₂ evitado        : 1 pt per tCO₂, cap 20
//   Anúncios ativos    : 3 pts each, cap 9
//   Itens no estoque   : 2 pts each, cap 8
//   Demandas abertas   : 2 pts each, cap 6

const GRADES = [
  { min: 90, letter: 'A+', title: 'Verde Certificado',  desc: 'Empresa referência em economia circular. Desempenho exemplar em sustentabilidade.', color: 'bg-green-600',  banner: 'bg-gradient-to-r from-green-700 to-emerald-600', text: 'text-green-700' },
  { min: 80, letter: 'A',  title: 'Verde Avançado',     desc: 'Alto comprometimento com práticas sustentáveis e redução de emissões.',            color: 'bg-green-500',  banner: 'bg-gradient-to-r from-green-600 to-teal-500',    text: 'text-green-600' },
  { min: 70, letter: 'B',  title: 'Sustentável',        desc: 'Boas práticas em desenvolvimento. Continue expandindo suas operações circulares.',  color: 'bg-blue-500',   banner: 'bg-gradient-to-r from-blue-600 to-cyan-500',     text: 'text-blue-600'  },
  { min: 60, letter: 'C',  title: 'Em Desenvolvimento', desc: 'Potencial identificado. Mais transações e trocas elevarão seu score rapidamente.',  color: 'bg-yellow-500', banner: 'bg-gradient-to-r from-yellow-500 to-amber-400',  text: 'text-yellow-600'},
  { min:  0, letter: 'D',  title: 'Iniciante',          desc: 'Comece publicando anúncios e realizando trocas para construir seu perfil ESG.',    color: 'bg-red-400',    banner: 'bg-gradient-to-r from-slate-700 to-slate-600',  text: 'text-red-500'   },
];

function calcESG() {
  const db = getDB();

  // Raw data
  const concludedSales   = db.history.filter(h => h.status === 'Concluída').length;
  const concludedBarters = (db.barterHistory || []).filter(b => b.status === 'Concluída').length;
  const activeAnn        = db.announcements.filter(a => a.status === 'Ativo').length;
  const stockItems       = db.stock.filter(s => s.status === 'Disponível').length;
  const openDemands      = db.demands.filter(d => d.status !== 'Encerrada').length;

  // CO₂ from history
  const co2Sales = db.history.reduce((s, h) => {
    const m = (h.co2 || '').toString().replace(',', '.').match(/[\d.]+/);
    return s + (m ? parseFloat(m[0]) : 0);
  }, 0);
  const co2Barters = (db.barterHistory || []).reduce((s, b) => {
    const m = (b.co2 || '').toString().replace(',', '.').match(/[\d.]+/);
    return s + (m ? parseFloat(m[0]) : 0);
  }, 0);
  const totalCO2 = co2Sales + co2Barters;

  // Volume
  const volSales   = db.history.reduce((s, h) => s + h.qty, 0);
  const volBarters = (db.barterHistory || []).reduce((s, b) => s + (b.myQty || 0) + (b.theirQty || 0), 0);
  const totalVol   = volSales + volBarters;

  // Scores per criterion
  const pSales   = Math.min(concludedSales * 5, 25);
  const pBarters = Math.min(concludedBarters * 8, 32);
  const pCO2     = Math.min(Math.floor(totalCO2), 20);
  const pAnn     = Math.min(activeAnn * 3, 9);
  const pStock   = Math.min(stockItems * 2, 8);
  const pDemands = Math.min(openDemands * 2, 6);

  const total = pSales + pBarters + pCO2 + pAnn + pStock + pDemands;

  return {
    score: total,
    criteria: [
      { label: 'Vendas Concluídas',  icon: 'fa-arrows-left-right', pts: pSales,   max: 25, detail: concludedSales + ' vendas × 5 pts' },
      { label: 'Trocas Concluídas',  icon: 'fa-right-left',        pts: pBarters, max: 32, detail: concludedBarters + ' trocas × 8 pts' },
      { label: 'CO₂ Evitado',        icon: 'fa-cloud',             pts: pCO2,     max: 20, detail: totalCO2.toFixed(1) + ' tCO₂ evitadas' },
      { label: 'Anúncios Ativos',    icon: 'fa-bullhorn',          pts: pAnn,     max: 9,  detail: activeAnn + ' anúncios ativos' },
      { label: 'Itens em Estoque',   icon: 'fa-boxes-stacked',     pts: pStock,   max: 8,  detail: stockItems + ' itens disponíveis' },
      { label: 'Demandas Abertas',   icon: 'fa-magnifying-glass',  pts: pDemands, max: 6,  detail: openDemands + ' demandas registradas' },
    ],
    env: {
      co2:     totalCO2.toFixed(1).replace('.', ',') + ' tCO₂',
      volume:  totalVol.toLocaleString('pt-BR') + ' kg',
      barters: concludedBarters + ' trocas',
    },
  };
}

function getGrade(score) {
  return GRADES.find(g => score >= g.min) || GRADES[GRADES.length - 1];
}

function renderESG() {
  const { score, criteria, env } = calcESG();
  const grade = getGrade(score);

  // Banner
  const banner = document.getElementById('esg-banner');
  banner.className = `rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-5 ${grade.banner}`;
  document.getElementById('esg-grade-badge').className = `w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${grade.color}`;
  document.getElementById('esg-grade-letter').textContent = grade.letter;
  document.getElementById('esg-grade-label').className  = 'text-xs font-bold uppercase tracking-widest mb-1 text-white/80';
  document.getElementById('esg-grade-label').textContent = 'Classificação ESG';
  document.getElementById('esg-grade-title').className  = 'text-2xl font-bold text-white mb-1';
  document.getElementById('esg-grade-title').textContent = grade.title;
  document.getElementById('esg-grade-desc').className   = 'text-sm text-white/75 max-w-sm';
  document.getElementById('esg-grade-desc').textContent = grade.desc;

  // Score counter animation
  const scoreEl = document.getElementById('esg-score-num');
  let cur = 0;
  const inc = setInterval(() => {
    cur = Math.min(cur + 2, score);
    scoreEl.textContent = cur;
    if (cur >= score) clearInterval(inc);
  }, 20);

  // Circle progress
  const circumference = 326.7;
  const offset = circumference - (score / 100) * circumference;
  setTimeout(() => {
    document.getElementById('esg-circle').style.strokeDashoffset = offset;
  }, 100);

  // Criteria
  document.getElementById('criteria-list').innerHTML = criteria.map(c => {
    const pct = Math.round((c.pts / c.max) * 100);
    const barColor = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-blue-500' : pct >= 30 ? 'bg-yellow-500' : 'bg-red-400';
    return `
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-2 text-sm font-medium text-slate-700">
            <i class="fa-solid ${c.icon} text-slate-400 w-4 text-center text-xs"></i>${c.label}
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-400">${c.detail}</span>
            <span class="text-sm font-bold text-slate-800">${c.pts}<span class="text-xs text-slate-400 font-normal">/${c.max}</span></span>
          </div>
        </div>
        <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div class="${barColor} h-full rounded-full transition-all duration-700" style="width:${pct}%"></div>
        </div>
      </div>`;
  }).join('');

  // Environmental impact
  document.getElementById('env-co2').textContent     = env.co2;
  document.getElementById('env-volume').textContent  = env.volume;
  document.getElementById('env-barters').textContent = env.barters;

  // Grade scale
  const scaleBg = { 'A+': 'bg-green-50 border-green-200', 'A': 'bg-emerald-50 border-emerald-200', 'B': 'bg-blue-50 border-blue-200', 'C': 'bg-yellow-50 border-yellow-200', 'D': 'bg-slate-50 border-slate-200' };
  document.getElementById('grade-scale').innerHTML = GRADES.slice().reverse().map(g => {
    const isActive = grade.letter === g.letter;
    const baseClass = scaleBg[g.letter] || 'bg-slate-50 border-slate-200';
    return `
      <div class="rounded-xl p-3 text-center border-2 ${isActive ? 'border-green-500 ring-2 ring-green-300 shadow-md' : baseClass}">
        <div class="w-10 h-10 ${g.color} rounded-xl flex items-center justify-center mx-auto mb-2 shadow">
          <span class="text-white font-black text-lg">${g.letter}</span>
        </div>
        <p class="text-xs font-bold text-slate-700 mb-0.5">${g.title}</p>
        <p class="text-xs text-slate-400">${g.min}${g.min === 0 ? '–59' : g.min === 90 ? '–100' : '–' + (g.min + 9)} pts</p>
        ${isActive ? '<p class="text-xs font-bold text-green-600 mt-1">← Você está aqui</p>' : ''}
      </div>`;
  }).join('');

  // Recommendations
  const recs = [];
  const db   = getDB();
  if (db.tradesActive.length > 0)   recs.push({ icon: 'fa-circle-check', color: 'blue',   text: `Você tem ${db.tradesActive.length} operação(ões) ativa(s). Conclua-as para ganhar pontos de vendas.` });
  if (db.barterActive.length > 0)   recs.push({ icon: 'fa-arrows-rotate', color: 'purple', text: `Você tem ${db.barterActive.length} troca(s) ativa(s). Conclua-as para ganhar até 8 pts cada.` });
  if (db.announcements.filter(a => a.status === 'Ativo').length < 3)
    recs.push({ icon: 'fa-bullhorn', color: 'green',  text: 'Publique mais anúncios ativos para aumentar sua visibilidade e pontuação (+3 pts cada, até 9 pts).' });
  if (db.demands.length === 0)
    recs.push({ icon: 'fa-magnifying-glass-dollar', color: 'yellow', text: 'Registre demandas de materiais para demonstrar engajamento com a economia circular (+2 pts cada).' });
  if ((db.barterHistory || []).length < 3)
    recs.push({ icon: 'fa-right-left', color: 'purple', text: 'Trocas têm o maior peso na pontuação (8 pts cada). Use o Marketplace para propor mais trocas.' });

  if (recs.length === 0) {
    recs.push({ icon: 'fa-star', color: 'green', text: 'Excelente desempenho! Continue realizando trocas e vendas para manter sua classificação.' });
  }

  document.getElementById('recommendations').innerHTML = recs.map(r => `
    <div class="flex items-start gap-3 p-3 bg-${r.color}-50 border border-${r.color}-100 rounded-xl">
      <div class="w-8 h-8 bg-${r.color}-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
        <i class="fa-solid ${r.icon} text-${r.color}-600 text-sm"></i>
      </div>
      <p class="text-sm text-slate-700">${r.text}</p>
    </div>
  `).join('');
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initLayout('Relatório ESG', 'esg');
    renderESG();
  });
}

// Exportação para testes (Node.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GRADES, getGrade };
}