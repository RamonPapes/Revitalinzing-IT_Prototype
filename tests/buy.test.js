const test = require('node:test');
const assert = require('node:assert');

// Importa as funções de cálculo e validação de compras
const { calculateTradeTotal, validateTradeData, calculateMatch } = require('../js/buy.js');

test('Cálculo de Valor Total em Transações (calculateTradeTotal) - Testes de Unidade', async (t) => {
    
    await t.test('Deve calcular corretamente o valor total: qty x price', () => {
        const total = calculateTradeTotal(100, 50.00);
        assert.strictEqual(total, 5000, 'Cálculo de 100 kg × R$50.00 deve dar R$5000.00');
    });

    await t.test('Deve calcular corretamente com preço fracionado (centavos)', () => {
        const total = calculateTradeTotal(250, 12.75);
        assert.strictEqual(total, 3187.50, 'Cálculo de 250 kg × R$12.75 deve dar R$3187.50');
    });

    await t.test('Deve retornar 0 para quantidade 0', () => {
        const total = calculateTradeTotal(0, 50.00);
        assert.strictEqual(total, 0, 'Quantidade zero deve resultar em valor total zero');
    });

    await t.test('Deve calcular corretamente para grandes quantidades', () => {
        const total = calculateTradeTotal(10000, 100.00);
        assert.strictEqual(total, 1000000, 'Cálculo de 10000 kg × R$100.00 deve dar R$1.000.000.00');
    });

    // 🔴 TESTE PARA SIMULAR FALHA (Para o Integrante D)
    // Na hora da demonstração, se quebrar a lógica de 'calculateTradeTotal'
    // este teste vai estourar e ficar "vermelho" provando que os testes funcionam.
    await t.test('Valida regra crítica: Multiplicação exata (1 × 1 = 1, não deve arredondar incorretamente)', () => {
        const total = calculateTradeTotal(1, 1.00);
        // Esperamos 1.00 exato. Se alguém mexer na lógica (ex: Math.round incorretamente), o teste quebra.
        assert.strictEqual(total, 1, 'Cálculo de 1 kg × R$1.00 deve ser exatamente 1, sem erros de arredondamento');
    });
});

test('Validação de Dados de Transação (validateTradeData) - Testes de Unidade', async (t) => {
    
    await t.test('Deve aceitar dados válidos de transação', () => {
        const result = validateTradeData({
            material: 'Plástico PET',
            qty: 500,
            price: 25.50,
            proposer: 'EcoTech Ltd',
            proposerCnpj: '12.345.678/0001-90'
        });
        assert.strictEqual(result.isValid, true);
        assert.strictEqual(result.error, null);
    });

    await t.test('Deve rejeitar quando quantidade é negativa', () => {
        const result = validateTradeData({
            material: 'Plástico PET',
            qty: -100,
            price: 25.50,
            proposer: 'EcoTech Ltd',
            proposerCnpj: '12.345.678/0001-90'
        });
        assert.strictEqual(result.isValid, false);
        assert.strictEqual(result.error, 'Quantidade deve ser positiva');
    });

    await t.test('Deve rejeitar quando preço é negativo', () => {
        const result = validateTradeData({
            material: 'Plástico PET',
            qty: 500,
            price: -10,
            proposer: 'EcoTech Ltd',
            proposerCnpj: '12.345.678/0001-90'
        });
        assert.strictEqual(result.isValid, false);
        assert.strictEqual(result.error, 'Preço deve ser positivo');
    });

    await t.test('Deve rejeitar quando material está vazio', () => {
        const result = validateTradeData({
            material: '',
            qty: 500,
            price: 25.50,
            proposer: 'EcoTech Ltd',
            proposerCnpj: '12.345.678/0001-90'
        });
        assert.strictEqual(result.isValid, false);
        assert.strictEqual(result.error, 'Material é obrigatório');
    });
});

test('Cálculo de Compatibilidade (calculateMatch) - Testes de Unidade', async (t) => {
    
    await t.test('Deve retornar 100% de match para valores idênticos', () => {
        const match = calculateMatch(100, 100);
        assert.strictEqual(match, 100, 'Valores idênticos devem ter 100% de match');
    });

    await t.test('Deve retornar match reduzido para valores diferentes', () => {
        const match = calculateMatch(100, 110);
        // Diferença de 10 em relação ao máximo 110 = 10/110 ≈ 9% = 91% de match
        assert.strictEqual(match, 91, '110 vs 100 deve resultar em 91% de match');
    });

    await t.test('Deve retornar match baixo para diferença muito grande', () => {
        const match = calculateMatch(100, 1000);
        // Diferença de 900 em relação ao máximo 1000 = 900/1000 = 90% = 10% de match
        assert.strictEqual(match, 10, '1000 vs 100 deve resultar em 10% de match (fora de faixa aceitável)');
    });

    // 🔴 TESTE PARA SIMULAR FALHA (Para o Integrante D)
    // Na hora da demonstração, se quebrar a lógica de 'calculateMatch'
    // este teste vai estourar e ficar "vermelho" provando que os testes funcionam.
    await t.test('Valida regra crítica: Simetria no cálculo (A→B deve ter mesmo match que B→A)', () => {
        const matchAB = calculateMatch(100, 90);
        const matchBA = calculateMatch(90, 100);
        // Esperamos que sejam iguais. Se a lógica for assimétrica, o teste quebra.
        assert.strictEqual(matchAB, matchBA, 'Match deve ser simétrico: 100→90 = 90→100');
    });
});
