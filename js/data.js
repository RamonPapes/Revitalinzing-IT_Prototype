// ─── Dados iniciais (seed) ───────────────────────────
const INITIAL_DATA = {
  stock: [
    { id: 1, name: 'Aparas de Papel Branco',       category: 'Papel / Papelão', qty: 2500, unit: 'kg', location: 'SP', updated: '02/05/2026', status: 'Disponível' },
    { id: 2, name: 'Resíduos PET Transparente',     category: 'Plástico',        qty:  800, unit: 'kg', location: 'SP', updated: '28/04/2026', status: 'Disponível' },
    { id: 3, name: 'Sucata de Aço Carbono',         category: 'Metal / Sucata',  qty: 4200, unit: 'kg', location: 'MG', updated: '30/04/2026', status: 'Reservado'  },
    { id: 4, name: 'Serragem de Madeira de Pinus',  category: 'Madeira',         qty: 1100, unit: 'kg', location: 'SC', updated: '01/05/2026', status: 'Disponível' },
    { id: 5, name: 'Óleo Vegetal Saturado',         category: 'Óleo',            qty:  320, unit: 'kg', location: 'PR', updated: '25/04/2026', status: 'Publicado'  },
  ],

  marketplace: [
    { id: 1, name: 'Aparas de Papel Kraft',          category: 'Papel / Papelão', qty: 5000, price: 0.35, company: 'Indústria Alfa S.A.',   uf: 'SP', condition: 'Puro',               cert: true  },
    { id: 2, name: 'PET Pós-Consumo Moído',          category: 'Plástico',        qty: 2000, price: 1.20, company: 'Recicla Brasil Ltda.',   uf: 'RJ', condition: 'Baixa contaminação', cert: false },
    { id: 3, name: 'Sucata de Cobre',                category: 'Metal / Sucata',  qty:  750, price:18.50, company: 'MetalWaste Co.',          uf: 'MG', condition: 'Puro',               cert: true  },
    { id: 4, name: 'Resíduo de MDF',                 category: 'Madeira',         qty: 3200, price: 0.10, company: 'Movelaria Delta',         uf: 'SC', condition: 'Requer triagem',     cert: false },
    { id: 5, name: 'Óleo de Motor Usado',            category: 'Óleo',            qty: 1200, price: 0.80, company: 'AutoPark Ltda.',          uf: 'SP', condition: 'Requer triagem',     cert: false },
    { id: 6, name: 'Borracha Vulcanizada Triturada', category: 'Borracha',        qty: 4800, price: 0.55, company: 'Pneus do Sul S.A.',       uf: 'RS', condition: 'Puro',               cert: true  },
    { id: 7, name: 'Papelão Ondulado OCC',           category: 'Papel / Papelão', qty: 8000, price: 0.28, company: 'Pack Solutions',          uf: 'PR', condition: 'Puro',               cert: true  },
    { id: 8, name: 'PEAD Soprado Pós-Industrial',    category: 'Plástico',        qty: 1500, price: 1.80, company: 'ChemPack Ind.',           uf: 'SP', condition: 'Puro',               cert: true  },
    { id: 9, name: 'Resíduo Têxtil de Algodão',      category: 'Têxtil',          qty:  900, price: 0.45, company: 'Tecelagem Ômega',         uf: 'MG', condition: 'Baixa contaminação', cert: false },
  ],

  announcements: [
    { id: 1, name: 'Aparas de Papel Branco',    category: 'Papel / Papelão', qty: '2.500 kg', price: 'R$ 0,40/kg', published: '01/05/2026', status: 'Ativo'     },
    { id: 2, name: 'Resíduos PET Transparente', category: 'Plástico',        qty: '800 kg',   price: 'R$ 1,10/kg', published: '28/04/2026', status: 'Pendente'  },
    { id: 3, name: 'Óleo Vegetal Saturado',     category: 'Óleo',            qty: '320 kg',   price: 'R$ 0,75/kg', published: '25/04/2026', status: 'Encerrado' },
  ],

  demands: [
    { id: 1, name: 'PET Reciclado Transparente', category: 'Plástico', qty: 2000, uf: 'SP',          urgency: 'Alta',  status: 'Aberta'    },
    { id: 2, name: 'Borracha Triturada',          category: 'Borracha', qty:  500, uf: 'Indiferente', urgency: 'Média', status: 'Com Match' },
  ],

  tradesReceived: [
    {
      id: 'TR-2024-001',
      material: 'Aparas de Papel Branco',
      proposer: 'Recicla Brasil Ltda.', proposerCnpj: '98.765.432/0001-10',
      qty: 1200, price: 0.40,
      status: 'Pendente', match: 92,
    },
    {
      id: 'TR-2024-002',
      material: 'Resíduos PET Transparente',
      proposer: 'GreenPack Reciclagem', proposerCnpj: '56.789.012/0001-34',
      qty: 600, price: 1.15,
      status: 'Pendente', match: 87,
    },
  ],

  tradesSent: [
    {
      id: 'TR-2024-003',
      material: 'PET Pós-Consumo Moído',
      target: 'Recicla Brasil Ltda.',
      qty: 500, price: 1.20,
      status: 'Aguardando',
    },
    {
      id: 'TR-2024-004',
      material: 'Borracha Vulcanizada Triturada',
      target: 'Pneus do Sul S.A.',
      qty: 200, price: 0.55,
      status: 'Aguardando',
    },
  ],

  tradesActive: [
    {
      id: 'TR-2023-098',
      material: 'Sucata de Cobre', partner: 'MetalWaste Co.',
      qty: 300, value: 5550,
      co2: 0.9, status: 'Em transporte',
    },
    {
      id: 'TR-2023-099',
      material: 'Papelão OCC', partner: 'Pack Solutions',
      qty: 2000, value: 560,
      co2: 2.1, status: 'Aguardando coleta',
    },
    {
      id: 'TR-2023-100',
      material: 'Borracha Vulcanizada', partner: 'Pneus do Sul S.A.',
      qty: 800, value: 440,
      co2: 1.2, status: 'Em transporte',
    },
  ],

  history: [
    { id: 'TR-2023-077', material: 'Sucata de Aço',       partner: 'MetalWaste Co.',       qty: 1500, value: 'R$ 12.750', co2: '3,8 tCO₂', status: 'Concluída' },
    { id: 'TR-2023-060', material: 'Aparas de Papel',     partner: 'Recicla Brasil Ltda.', qty: 3000, value: '—',         co2: '5,1 tCO₂', status: 'Concluída' },
    { id: 'TR-2023-048', material: 'Resíduo PET',         partner: 'GreenPack Reciclagem', qty:  400, value: 'R$ 480',    co2: '0,6 tCO₂', status: 'Cancelada' },
    { id: 'TR-2023-031', material: 'Serragem de Madeira', partner: 'Movelaria Delta',      qty: 2000, value: '—',         co2: '1,2 tCO₂', status: 'Concluída' },
    { id: 'TR-2023-018', material: 'Óleo Vegetal',        partner: 'BioFuel Ltda.',        qty:  200, value: 'R$ 160',    co2: '0,3 tCO₂', status: 'Concluída' },
  ],

  // ─── Gestão de Trocas (Barter) ────────────────────
  barterReceived: [
    {
      id: 'BT-2024-001',
      wantedMaterial:   'Aparas de Papel Branco',
      wantedQty:        1000,
      offeredMaterial:  'PET Pós-Consumo Moído',
      offeredQty:       800,
      proposer:         'Recicla Brasil Ltda.',
      proposerCnpj:     '98.765.432/0001-10',
      message:          'Temos PET de alta qualidade, pós-industrial, podemos negociar quantidade.',
      status:           'Pendente',
      match:            91,
    },
    {
      id: 'BT-2024-002',
      wantedMaterial:   'Resíduos PET Transparente',
      wantedQty:        500,
      offeredMaterial:  'Borracha Vulcanizada Triturada',
      offeredQty:       600,
      proposer:         'Pneus do Sul S.A.',
      proposerCnpj:     '11.222.333/0001-44',
      message:          '',
      status:           'Pendente',
      match:            84,
    },
  ],

  barterSent: [
    {
      id: 'BT-2024-003',
      wantedMaterial:   'Papelão Ondulado OCC',
      wantedQty:        1500,
      offeredMaterial:  'Aparas de Papel Branco',
      offeredQty:       1200,
      target:           'Pack Solutions',
      status:           'Aguardando',
    },
  ],

  barterActive: [
    {
      id: 'BT-2023-090',
      myMaterial:    'Serragem de Madeira de Pinus',
      myQty:         500,
      theirMaterial: 'Resíduo de MDF',
      theirQty:      400,
      partner:       'Movelaria Delta',
      co2:           0.7,
      status:        'Aguardando coleta',
    },
  ],

  // ─── Histórico de Trocas ──────────────────────────
  barterHistory: [
    {
      id: 'BT-2023-071',
      myMaterial:    'Óleo Vegetal Saturado',
      myQty:         200,
      theirMaterial: 'Óleo de Motor Usado',
      theirQty:      180,
      partner:       'AutoPark Ltda.',
      co2:           '0,2 tCO₂',
      concluded:     '15/04/2026',
      status:        'Concluída',
    },
    {
      id: 'BT-2023-055',
      myMaterial:    'Aparas de Papel Branco',
      myQty:         800,
      theirMaterial: 'Papelão Ondulado OCC',
      theirQty:      750,
      partner:       'Pack Solutions',
      co2:           '1,1 tCO₂',
      concluded:     '02/04/2026',
      status:        'Concluída',
    },
    {
      id: 'BT-2023-039',
      myMaterial:    'Resíduos PET Transparente',
      myQty:         300,
      theirMaterial: 'PET Pós-Consumo Moído',
      theirQty:      250,
      partner:       'Recicla Brasil Ltda.',
      co2:           '0,3 tCO₂',
      concluded:     '20/03/2026',
      status:        'Cancelada',
    },
  ],
};

// ─── Persistência via localStorage ───────────────────
function initDB() {
  const stored = localStorage.getItem('rit_db');
  if (!stored) {
    localStorage.setItem('rit_db', JSON.stringify(INITIAL_DATA));
  } else {
    // Migrate: add barter collections if missing
    try {
      const db = JSON.parse(stored);
      let dirty = false;
      if (!db.barterReceived) { db.barterReceived = INITIAL_DATA.barterReceived; dirty = true; }
      if (!db.barterSent)     { db.barterSent     = INITIAL_DATA.barterSent;     dirty = true; }
      if (!db.barterActive)   { db.barterActive   = INITIAL_DATA.barterActive;   dirty = true; }
      if (!db.barterHistory)  { db.barterHistory  = INITIAL_DATA.barterHistory;  dirty = true; }
      if (dirty) localStorage.setItem('rit_db', JSON.stringify(db));
    } catch { localStorage.setItem('rit_db', JSON.stringify(INITIAL_DATA)); }
  }
}

function getDB() {
  try {
    const saved = localStorage.getItem('rit_db');
    return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(INITIAL_DATA));
  } catch {
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }
}

function saveDB(db) {
  localStorage.setItem('rit_db', JSON.stringify(db));
}

function resetDB() {
  localStorage.setItem('rit_db', JSON.stringify(INITIAL_DATA));
}

initDB();
