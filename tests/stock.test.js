const test = require('node:test');
const assert = require('node:assert');

// Importa a função de validação e cálculo do estoque
const { validateStockInput, createStockItem } = require('../js/stock.js');

test('Validação de Estoque (validateStockInput) - Testes de Unidade', async (t) => {
    
    await t.test('Deve aceitar entrada válida com todos os campos preenchidos', () => {
        const result = validateStockInput({
            name: 'Plástico PET',
            category: 'Plástico',
            qty: 500,
            uf: 'SP'
        });
        assert.strictEqual(result.isValid, true);
        assert.strictEqual(result.error, null);
    });

    await t.test('Deve rejeitar entrada quando nome está vazio', () => {
        const result = validateStockInput({
            name: '',
            category: 'Plástico',
            qty: 500,
            uf: 'SP'
        });
        assert.strictEqual(result.isValid, false);
        assert.strictEqual(result.error, 'Nome do item é obrigatório');
    });

    await t.test('Deve rejeitar entrada quando categoria está vazia', () => {
        const result = validateStockInput({
            name: 'Plástico PET',
            category: '',
            qty: 500,
            uf: 'SP'
        });
        assert.strictEqual(result.isValid, false);
        assert.strictEqual(result.error, 'Categoria é obrigatória');
    });

    await t.test('Deve rejeitar entrada quando quantidade é inválida (0 ou negativa)', () => {
        const result = validateStockInput({
            name: 'Plástico PET',
            category: 'Plástico',
            qty: 0,
            uf: 'SP'
        });
        assert.strictEqual(result.isValid, false);
        assert.strictEqual(result.error, 'Quantidade deve ser maior que 0');
    });

    await t.test('Deve rejeitar entrada quando UF está vazio', () => {
        const result = validateStockInput({
            name: 'Plástico PET',
            category: 'Plástico',
            qty: 500,
            uf: ''
        });
        assert.strictEqual(result.isValid, false);
        assert.strictEqual(result.error, 'UF é obrigatório');
    });

    // 🔴 TESTE PARA SIMULAR FALHA (Para o Integrante D)
    // Na hora da demonstração, se quebrar a lógica de 'validateStockInput'
    // este teste vai estourar e ficar "vermelho" provando que os testes funcionam.
    await t.test('Valida regra crítica: Quantidade mínima deve ser >= 1 (exatamente 1 é válido)', () => {
        const result = validateStockInput({
            name: 'Plástico PET',
            category: 'Plástico',
            qty: 1,
            uf: 'SP'
        });
        // Esperamos que seja válido. Se alguém mexer na lógica (ex: qty > 1 ao invés de qty >= 1), o teste quebra.
        assert.strictEqual(result.isValid, true, 'Quantidade igual a 1 deveria ser válida no estoque');
    });
});

test('Criação de Item de Estoque (createStockItem) - Testes de Unidade', async (t) => {
    
    await t.test('Deve criar item com dados corretos e status "Disponível"', () => {
        const item = createStockItem({
            name: 'Alumínio',
            category: 'Metal',
            qty: 1000,
            uf: 'MG'
        });
        
        assert.strictEqual(item.name, 'Alumínio');
        assert.strictEqual(item.category, 'Metal');
        assert.strictEqual(item.qty, 1000);
        assert.strictEqual(item.location, 'MG');
        assert.strictEqual(item.status, 'Disponível');
        assert.strictEqual(item.unit, 'kg');
        assert.strictEqual(typeof item.id, 'number');
    });

    await t.test('Deve gerar ID único baseado em timestamp', () => {
        const item1 = createStockItem({
            name: 'Item1',
            category: 'Teste',
            qty: 100,
            uf: 'SP'
        });
        
        // Pequena pausa para garantir ID diferente
        const pause = new Promise(resolve => setTimeout(resolve, 2));
        
        return pause.then(() => {
            const item2 = createStockItem({
                name: 'Item2',
                category: 'Teste',
                qty: 100,
                uf: 'SP'
            });
            
            assert.notStrictEqual(item1.id, item2.id, 'IDs de itens diferentes devem ser únicos');
        });
    });
});
