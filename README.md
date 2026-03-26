# 📊 Documentação do Projeto AgroClima Inteligente

## 📋 Descrição do Projeto

O **AgroClima Inteligente** é um sistema de recomendação de irrigação que utiliza dados de temperatura em tempo real para sugerir a necessidade de irrigação. O projeto foi desenvolvido como parte de uma atividade de testes automatizados.

### Objetivos da Atividade

1. Criar testes automatizados (unitários e de integração)
2. Usar os testes para identificar falhas no sistema
3. Corrigir o código até que todos os testes passem

---

## 🏗️ Estrutura do Projeto
agroclima2/
├── backend/
│ ├── server.js
│ ├── utils/
│ │ └── irrigationRule.js
│ └── services/
│ └── weatherService.js
├── tests/
│ ├── irrigationRule.test.js
│ ├── weatherService.test.js
│ └── integration.test.js
├── package.json
├── jest.config.js
└── DOCUMENTACAO.md


---


---

## 🔧 Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| Node.js | v22.17.1 | Runtime JavaScript |
| Express | 5.2.1 | Servidor web |
| Axios | 1.13.6 | Cliente HTTP para API externa |
| Jest | 30.3.0 | Framework de testes |
| Supertest | 7.2.2 | Testes de requisições HTTP |
| CORS | 2.8.5 | Compartilhamento de recursos entre origens |

---

## 🔍 Erros Identificados pelos Testes

### Execução dos Testes (antes das correções)

```bash
npx jest

PS C:\Users\aluno.fsa\Documents\agroclima2> npx jest
  console.log
    Servidor rodando na porta 3000

      at Server.log (backend/server.js:34:13)

 FAIL  tests/integration.test.js
  Testes de integração - Endpoint /irrigation
    × GET /irrigation deve retornar status 200 e estrutura correta (37 ms)
    × GET /irrigation deve retornar os dados corretos (7 ms)

  ● Testes de integração - Endpoint /irrigation › GET /irrigation deve retornar status 200 e estrutura correta

    expect(received).toBeDefined()

    Received: undefined

      15 |
      16 |         expect(res.statusCode).toBe(200);
    > 17 |         expect(res.body.temperature).toBeDefined();
         |                                      ^
      18 |         expect(res.body.advice).toBeDefined();
      19 |     });
      20 |     

      at Object.toBeDefined (tests/integration.test.js:17:38)

  ● Testes de integração - Endpoint /irrigation › GET /irrigation deve retornar os dados corretos

    expect(received).toBe(expected) // Object.is equality

    Expected: 32
    Received: undefined

      23 |             .get("/irrigation?lat=-12&lon=-38");
      24 |
    > 25 |         expect(res.body.temperature).toBe(32);
         |                                      ^
      26 |         expect(res.body.advice).toBe("Irrigação moderada");
      27 |     });
      28 | });

      at Object.toBe (tests/integration.test.js:25:38)

 FAIL  tests/weatherService.test.js
  Testes do serviço de clima
    × Deve retornar a temperatura corretamente após parse do JSON (4 ms)

  ● Testes do serviço de clima › Deve retornar a temperatura corretamente após parse do JSON

    TypeError: Cannot read properties of undefined (reading 'temperature')

       8 |
       9 |     return {
    > 10 |         temperature: response.data.current.temperature
         |                                            ^
      11 |     };
      12 | };

      at temperature (backend/services/weatherService.js:10:44)
      at Object.<anonymous> (tests/weatherService.test.js:21:24)

 FAIL  tests/irrigationRule.test.js
  Testes de regra de irrigação
    × Temperatura 35°C deve retornar Irrigação URGENTE (2 ms)
    × Temperatura 25°C deve retornar Irrigação moderada (2 ms)
    × Temperatura 10°C deve retornar Não irrigar (1 ms)

  ● Testes de regra de irrigação › Temperatura 35°C deve retornar Irrigação URGENTE

    expect(received).toBe(expected) // Object.is equality

    Expected: "Irrigação URGENTE"
    Received: "Irrigação moderada"

      3 | describe("Testes de regra de irrigação", () => {
      4 |     test("Temperatura 35°C deve retornar Irrigação URGENTE", () => {
    > 5 |         expect(getIrrigationAdvice(35)).toBe("Irrigação URGENTE");
        |                                         ^
      6 |     });
      7 |
      8 |     test("Temperatura 25°C deve retornar Irrigação moderada", () => {

      at Object.toBe (tests/irrigationRule.test.js:5:41)

  ● Testes de regra de irrigação › Temperatura 25°C deve retornar Irrigação moderada

    expect(received).toBe(expected) // Object.is equality

    Expected: "Irrigação moderada"
    Received: "Não irrigar"

       7 |
       8 |     test("Temperatura 25°C deve retornar Irrigação moderada", () => {
    >  9 |         expect(getIrrigationAdvice(25)).toBe("Irrigação moderada");
         |                                         ^
      10 |     });
      11 |
      12 |     test("Temperatura 10°C deve retornar Não irrigar", () => {

      at Object.toBe (tests/irrigationRule.test.js:9:41)

  ● Testes de regra de irrigação › Temperatura 10°C deve retornar Não irrigar

    expect(received).toBe(expected) // Object.is equality

    Expected: "Não irrigar"
    Received: "Irrigação URGENTE"

      11 |
      12 |     test("Temperatura 10°C deve retornar Não irrigar", () => {
    > 13 |         expect(getIrrigationAdvice(10)).toBe("Não irrigar");
         |                                         ^
      14 |     });
      15 | });

      at Object.toBe (tests/irrigationRule.test.js:13:41)

Test Suites: 3 failed, 3 total
Tests:       6 failed, 6 total
Snapshots:   0 total
Time:        0.614 s, estimated 1 s
Ran all test suites.

📌 Análise Detalhada dos Erros
Erro 1: Lógica de Irrigação Incorreta (irrigationRule.js)
Problema: As condições estavam invertidas

35°C (muito quente) retornava "Irrigação moderada" ❌

25°C (moderado) retornava "Não irrigar" ❌

10°C (frio) retornava "Irrigação URGENTE" ❌

Causa: Condicionais escritas na ordem errada (if temp < 20, else if temp < 30, else)

Impacto: Sistema recomendava irrigação em temperaturas frias e não irrigava em temperaturas quentes

Erro 2: Campo Incorreto na API (weatherService.js)
Problema: response.data.current.temperature retornava undefined

Causa: A API Open-Meteo retorna os dados no campo current_weather, não current

Impacto: O serviço não conseguia extrair a temperatura correta da resposta da API

Erro 3: Nome do Campo no JSON (server.js)
Problema: O endpoint retornava { temp: temperature } mas os testes esperavam temperature

Causa: Inconsistência entre o nome do campo retornado e o esperado pelos testes

Impacto: Os testes de integração recebiam undefined ao tentar acessar res.body.temperature

Erro 4: Ausência de Validação de Parâmetros (server.js)
Problema: O endpoint aceitava requisições sem latitude e longitude

Causa: Faltava validação dos parâmetros obrigatórios

Impacto: O sistema não retornava erro adequado quando parâmetros estavam ausentes

Erro 5: Servidor Iniciando nos Testes (server.js)
Problema: O servidor Express iniciava automaticamente ao rodar os testes

Causa: Faltava a condição if (require.main === module) para controle de execução

Impacto: Causava conflitos de porta e logs desnecessários durante os testes

Erro 6: Mock com Temperatura Incompatível (integration.test.js)
Problema: O mock usava 32°C que gerava "Irrigação URGENTE" mas o teste esperava "Irrigação moderada"

Causa: Inconsistência entre o valor mockado e a expectativa do teste

Impacto: Teste falhava mesmo com a lógica correta


✅ Correções Aplicadas e Resultado Final

### Correções Realizadas

**1. irrigationRule.js** - Invertida a lógica das condições:
- Antes: 35°C → "Irrigação moderada" | Depois: 35°C → "Irrigação URGENTE"
- Antes: 25°C → "Não irrigar" | Depois: 25°C → "Irrigação moderada"  
- Antes: 10°C → "Irrigação URGENTE" | Depois: 10°C → "Não irrigar"

**2. weatherService.js** - Corrigido o campo da API:
- Antes: `response.data.current.temperature`
- Depois: `response.data.current_weather.temperature`

**3. server.js** - Corrigido o nome da chave no JSON:
- Antes: `{ temp: temperature, advice: advice }`
- Depois: `{ temperature: temperature, advice: advice }`
- Adicionada validação de parâmetros obrigatórios (lat e lon)
- Adicionada condição `if (require.main === module)` para não iniciar servidor nos testes

**4. integration.test.js** - Ajustado o mock:
- Antes: `temperature: 32` (gerava "Irrigação URGENTE")
- Depois: `temperature: 25` (gera "Irrigação moderada")

---

-Códigos corrigidos:

### Códigos Corrigidos

**irrigationRule.js**
```javascript
function getIrrigationAdvice(temp) {
    if (temp > 30) return "Irrigação URGENTE";
    if (temp >= 20) return "Irrigação moderada";
    return "Não irrigar";
}

module.exports = getIrrigationAdvice;

weatherService.js

javascript
const axios = require("axios");

module.exports = async function getWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const response = await axios.get(url);
  
    return {
        temperature: response.data.current_weather.temperature
    };
};
text

### 3. **Adicionar seção de Como Executar**:

```markdown
## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js instalado (v22+)
- NPM ou Yarn

### Passos

1. **Instalar dependências**
```bash
npm install
Iniciar o servidor

bash
cd backend
node server.js
Acessar a aplicação

text
http://localhost:3000
Executar os testes

bash
npx jest
text

### 4. **Adicionar seção de Testes Manuais**:

```markdown
## 🧪 Testes Manuais Recomendados

| Cenário | Latitude | Longitude | Recomendação Esperada |
|---------|----------|-----------|---------------------|
| Irrigação URGENTE | `33.4484` | `-112.0740` | Irrigação URGENTE |
| Irrigação moderada | `-23.5505` | `-46.6333` | Irrigação moderada |
| Não irrigar | `-54.8019` | `-68.3030` | Não irrigar |


### Resultado Final dos Testes

```bash
PS C:\Users\aluno.fsa\Documents\agroclima2> npx jest

PASS tests/irrigationRule.test.js
  Testes de regra de irrigação
    √ Temperatura 35°C deve retornar Irrigação URGENTE (4 ms)
    √ Temperatura 25°C deve retornar Irrigação moderada (1 ms)
    √ Temperatura 10°C deve retornar Não irrigar (1 ms)

PASS tests/weatherService.test.js
  Testes do serviço de clima
    √ Deve retornar a temperatura corretamente após parse do JSON (5 ms)

PASS tests/integration.test.js
  Testes de integração - Endpoint /irrigation
    √ GET /irrigation deve retornar status 200 e estrutura correta (21 ms)
    √ GET /irrigation deve retornar os dados corretos (3 ms)
    √ GET /irrigation sem parâmetros deve retornar erro 400 (3 ms)

Test Suites: 3 passed, 3 total
Tests:       7 passed, 7 total
Time:        0.938 s
Ran all test suites.
