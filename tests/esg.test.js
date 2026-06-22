const test = require('node:test');
const assert = require('node:assert');

// Importa os itens exportados do nosso arquivo do ecossistema
const { GRADES, getGrade } = require('../js/esg.js');

test('Classificação ESG (getGrade) - Testes de Unidade', async (t) => {
    
    await t.test('Deve retornar classificação "A+" para score igual ou maior que 90', () => {
        const grade = getGrade(95);
        assert.strictEqual(grade.letter, 'A+');
        assert.strictEqual(grade.title, 'Verde Certificado');
    });

    await t.test('Deve retornar classificação "B" para score 70', () => {
        const grade = getGrade(70);
        assert.strictEqual(grade.letter, 'B');
        assert.strictEqual(grade.title, 'Sustentável');
    });

    await t.test('Deve retornar a pior classificação ("D") para score muito baixo', () => {
        const grade = getGrade(25);
        assert.strictEqual(grade.letter, 'D');
        assert.strictEqual(grade.title, 'Iniciante');
    });

    // 🔴 TESTE PARA SIMULAR FALHA (Para o Integrante D)
    // Na hora da demonstração, se quebrar a lógica de 'getGrade'
    // este teste vai estourar e ficar "vermelho" provando que os testes funcionam.
    await t.test('Valida falha: Score de transição deve calcular corretamente (80 é A)', () => {
        const grade = getGrade(80);
        // Esperamos 'A'. Se alguém mexer na lógica (ex: score > 80 ao invés de score >= 80), o teste quebra.
        assert.strictEqual(grade.letter, 'A', 'A nota 80 exata deveria classificar no grupo A');
    });
});