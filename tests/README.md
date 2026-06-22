# 📋 Testes Unitários - RevitalizingIT Prototype

## Visão Geral
Este diretório contém testes unitários seguindo o padrão estabelecido para o projeto. Os testes validam funções críticas do sistema e incluem casos que permitem simular falhas para demonstração ao vivo.

---

## 📊 Estrutura de Testes

### 1️⃣ **esg.test.js** - Classificação ESG (4 testes)
**Módulo testado:** [js/esg.js](../js/esg.js)

**Função vital:** `getGrade(score)`
- Classifica empresas em categorias ESG (A+, A, B, C, D)
- Regra crítica: Fronteiras de transição entre categorias

**Casos testados:**
- ✅ Score 95 → "A+" (Verde Certificado)
- ✅ Score 70 → "B" (Sustentável)  
- ✅ Score 25 → "D" (Iniciante)
- 🔴 **Teste de Falha:** Score 80 deve ser "A" (para demonstração ao vivo)

---

### 2️⃣ **stock.test.js** - Gestão de Estoque (10 testes)
**Módulo testado:** [js/stock.js](../js/stock.js)

**Funções vitais:**
- `validateStockInput(data)` - Valida entrada de novo item
- `createStockItem(data)` - Cria novo item com dados validados

**Casos testados:**

#### Validação de Entrada
- ✅ Entrada completa e válida
- ❌ Rejeita nome vazio
- ❌ Rejeita categoria vazia
- ❌ Rejeita quantidade ≤ 0
- ❌ Rejeita UF vazio
- 🔴 **Teste de Falha:** Quantidade = 1 deve ser válida

#### Criação de Item
- ✅ Cria item com status "Disponível"
- ✅ Gera IDs únicos por timestamp

---

### 3️⃣ **buy.test.js** - Gestão de Compras (16 testes)
**Módulo testado:** [js/buy.js](../js/buy.js)

**Funções vitais:**
- `calculateTradeTotal(qty, price)` - Calcula valor total (qty × price)
- `validateTradeData(data)` - Valida dados de transação
- `calculateMatch(requested, offered)` - Calcula compatibilidade entre ofertas

**Casos testados:**

#### Cálculo de Valor Total (5 testes)
- ✅ 100kg × R$50 = R$5.000
- ✅ 250kg × R$12,75 = R$3.187,50 (com centavos)
- ✅ 0kg × R$50 = R$0
- ✅ 10.000kg × R$100 = R$1.000.000
- 🔴 **Teste de Falha:** 1kg × R$1 = R$1 (teste de arredondamento)

#### Validação de Dados (4 testes)
- ✅ Dados válidos são aceitos
- ❌ Rejeita quantidade negativa
- ❌ Rejeita preço negativo
- ❌ Rejeita material vazio

#### Cálculo de Compatibilidade (4 testes)
- ✅ 100 vs 100 = 100% match
- ✅ 100 vs 110 = 91% match
- ✅ 100 vs 1000 = 10% match (fora da faixa)
- 🔴 **Teste de Falha:** Match deve ser simétrico (A→B = B→A)

---

## 🚀 Como Executar

### Rodar um arquivo de teste específico
```bash
node --test tests/stock.test.js
node --test tests/buy.test.js
node --test tests/esg.test.js
```

### Rodar todos os testes
```bash
node --test tests/*.test.js
```

### Resultado esperado
```
✔ 31 testes passando
✔ 0 falhas
✔ 100% de sucesso
```

---

## 🎯 Roteiro para Demonstração Ao Vivo

### Integrante C (Arquitetura + Teste)
1. Apresentar a função crítica (ex: `calculateTradeTotal`)
2. Explicar a regra de negócio (multiplicação exata)
3. Mostrar o teste passando com sucesso

### Integrante D (QA + Demo de Falha)
1. **Reproduzir teste com sucesso:**
   ```bash
   node --test tests/buy.test.js
   ```
   
2. **Simular falha propositalmente:** Editar [js/buy.js](../js/buy.js) linha ~297:
   ```javascript
   // ❌ ERRO: Quebrar propositalmente a lógica
   function calculateTradeTotal(qty, price) {
     return qty * price + 0.01;  // Adiciona 1 centavo intencionalmente
   }
   ```

3. **Rodar testes novamente:**
   ```bash
   node --test tests/buy.test.js
   ```
   → 🔴 **Resultado:** Teste falha, mostrando que a validação detectou o erro

---

## 📝 Padrão de Testes

Todos os testes seguem este padrão:

```javascript
const test = require('node:test');
const assert = require('node:assert');
const { functionToTest } = require('../js/module.js');

test('Descrição do Teste Suite', async (t) => {
    await t.test('Caso 1: Comportamento esperado', () => {
        const result = functionToTest(input);
        assert.strictEqual(result, expected, 'Mensagem clara');
    });
    
    // 🔴 TESTE DE FALHA (para demonstração)
    await t.test('Valida regra crítica: ...', () => {
        const result = functionToTest(input);
        assert.strictEqual(result, expected, 'Se quebrar a lógica, este teste falha');
    });
});
```

---

## 🔧 Integração com o Projeto

Cada arquivo de teste importa funções dos módulos principais e as exporta via `module.exports` apenas em ambiente Node.js:

```javascript
// No final de cada js/*.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { functionA, functionB };
}

// Interface web (navegador) protegida
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Código do navegador
  });
}
```

---

## 📞 Contato

Para dúvidas sobre os testes, consulte:
- 👤 **Integrante C:** Preparação da arquitetura e seleção de funções
- 👤 **Integrante D:** Execução dos testes e simulação de falhas

