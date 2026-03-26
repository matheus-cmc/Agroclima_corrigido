# 🌱 AgroClima Inteligente

![Status](https://img.shields.io/badge/status-concluído-success)
![Node.js](https://img.shields.io/badge/Node.js-v22.17.1-green)
![Express](https://img.shields.io/badge/Express-v5.2.1-blue)
![Jest](https://img.shields.io/badge/Jest-v30.3.0-red)

## 📋 Sobre o Projeto

O **AgroClima Inteligente** é um sistema de recomendação de irrigação que utiliza dados de temperatura em tempo real para sugerir a necessidade de irrigação. O projeto foi desenvolvido como parte de uma atividade de testes automatizados, demonstrando a importância dos testes no desenvolvimento de software.

### 🎯 Objetivos da Atividade

1. Criar testes automatizados (unitários e de integração)
2. Usar os testes para identificar falhas no sistema
3. Corrigir o código até que todos os testes passem

---

## 🏗️ Estrutura do Projeto

```
agroclima2/
├── backend/
│   ├── server.js
│   ├── utils/
│   │   └── irrigationRule.js
│   └── services/
│       └── weatherService.js
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── tests/
│   ├── irrigationRule.test.js
│   ├── weatherService.test.js
│   └── integration.test.js
├── package.json
├── jest.config.js
└── DOCUMENTACAO.md
```

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

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js instalado (v22 ou superior)

### Passos para execução

**1. Instalar as dependências**
```bash
npm install
```

**2. Iniciar o servidor**
```bash
cd backend
node server.js
```

**3. Acessar a aplicação**
```
http://localhost:3000
```

**4. Executar os testes**
```bash
npx jest
```

---

## 🧪 Testes Manuais Recomendados

| Cenário | Latitude | Longitude | Recomendação Esperada |
|---------|----------|-----------|---------------------|
| 🔥 Irrigação URGENTE | `33.4484` | `-112.0740` | Irrigação URGENTE |
| 🌤️ Irrigação moderada | `-23.5505` | `-46.6333` | Irrigação moderada |
| ❄️ Não irrigar | `-54.8019` | `-68.3030` | Não irrigar |

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

 FAIL  tests/weatherService.test.js
  Testes do serviço de clima
    × Deve retornar a temperatura corretamente após parse do JSON (4 ms)

 FAIL  tests/irrigationRule.test.js
  Testes de regra de irrigação
    × Temperatura 35°C deve retornar Irrigação URGENTE (2 ms)
    × Temperatura 25°C deve retornar Irrigação moderada (2 ms)
    × Temperatura 10°C deve retornar Não irrigar (1 ms)

Test Suites: 3 failed, 3 total
Tests:       6 failed, 6 total
Time:        0.614 s
```

---

## 📌 Análise Detalhada dos Erros

### ❌ Erro 1: Lógica de Irrigação Incorreta (`irrigationRule.js`)

| Temperatura | Comportamento Errado | Comportamento Correto |
|-------------|---------------------|---------------------|
| 35°C (quente) | "Irrigação moderada" ❌ | "Irrigação URGENTE" ✅ |
| 25°C (moderado) | "Não irrigar" ❌ | "Irrigação moderada" ✅ |
| 10°C (frio) | "Irrigação URGENTE" ❌ | "Não irrigar" ✅ |

**Causa:** Condicionais escritas na ordem errada (`if temp < 20`, `else if temp < 30`, `else`)

---

### ❌ Erro 2: Campo Incorreto na API (`weatherService.js`)

- **Problema:** `response.data.current.temperature` retornava `undefined`
- **Causa:** A API Open-Meteo retorna os dados no campo `current_weather`, não `current`
- **Impacto:** Serviço não conseguia extrair a temperatura correta

---

### ❌ Erro 3: Nome do Campo no JSON (`server.js`)

- **Problema:** O endpoint retornava `{ temp: temperature }` mas os testes esperavam `temperature`
- **Impacto:** Testes recebiam `undefined` ao acessar `res.body.temperature`

---

### ❌ Erro 4: Ausência de Validação de Parâmetros (`server.js`)

- **Problema:** Endpoint aceitava requisições sem latitude e longitude
- **Impacto:** Sistema não retornava erro adequado quando parâmetros estavam ausentes

---

### ❌ Erro 5: Servidor Iniciando nos Testes (`server.js`)

- **Problema:** Servidor Express iniciava automaticamente ao rodar os testes
- **Causa:** Faltava a condição `if (require.main === module)` para controle de execução
- **Impacto:** Causava conflitos de porta e logs desnecessários durante os testes

---

### ❌ Erro 6: Mock com Temperatura Incompatível (`integration.test.js`)

- **Problema:** Mock usava 32°C que gerava "Irrigação URGENTE" mas o teste esperava "Irrigação moderada"
- **Impacto:** Teste falhava mesmo com a lógica correta

---

## ✅ Correções Aplicadas

### 1. `irrigationRule.js` - Lógica corrigida

```javascript
function getIrrigationAdvice(temp) {
    if (temp > 30) return "Irrigação URGENTE";
    if (temp >= 20) return "Irrigação moderada";
    return "Não irrigar";
}

module.exports = getIrrigationAdvice;
```

### 2. `weatherService.js` - Campo da API corrigido

```javascript
const axios = require("axios");

module.exports = async function getWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const response = await axios.get(url);
  
    return {
        temperature: response.data.current_weather.temperature
    };
};
```

### 3. `server.js` - Correções completas

```javascript
const express = require("express");
const cors = require("cors");
const path = require("path");
const getWeather = require("./services/weatherService");
const getIrrigationAdvice = require("./utils/irrigationRule");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/irrigation", async (req, res) => {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude e longitude são obrigatórias" });
    }
    
    try {
        const weatherData = await getWeather(lat, lon);
        const temperature = weatherData.temperature;
        const advice = getIrrigationAdvice(temperature);
        
        res.json({
            temperature: temperature,
            advice: advice
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao obter dados climáticos" });
    }
});

if (require.main === module) {
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log("=".repeat(50));
        console.log(`🚀 Servidor AgroClima Inteligente rodando!`);
        console.log(`📱 Acesse: http://localhost:${PORT}`);
        console.log("=".repeat(50));
    });
}

module.exports = app;
```

### 4. `integration.test.js` - Mock ajustado

```javascript
const request = require("supertest");
const app = require("../backend/server");

jest.mock("../backend/services/weatherService", () => {
    return jest.fn().mockResolvedValue({ 
        temperature: 25
    });
});

describe("Testes de integração - Endpoint /irrigation", () => {
    test("GET /irrigation deve retornar status 200 e estrutura correta", async () => {
        const res = await request(app)
            .get("/irrigation?lat=-12&lon=-38");
        
        expect(res.statusCode).toBe(200);
        expect(res.body.temperature).toBeDefined();
        expect(res.body.advice).toBeDefined();
    });
    
    test("GET /irrigation deve retornar os dados corretos", async () => {
        const res = await request(app)
            .get("/irrigation?lat=-12&lon=-38");
        
        expect(res.body.temperature).toBe(25);
        expect(res.body.advice).toBe("Irrigação moderada");
    });
    
    test("GET /irrigation sem parâmetros deve retornar erro 400", async () => {
        const res = await request(app)
            .get("/irrigation");
        
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBeDefined();
    });
});
```

### 5. `script.js` - Frontend corrigido

```javascript
async function buscar() {
    const lat = document.getElementById("lat").value;
    const lon = document.getElementById("lon").value;

    const res = await fetch(`/irrigation?lat=${lat}&lon=${lon}`);
    
    const data = await res.json();

    document.getElementById("resultado").innerHTML =
        `Temperatura: ${data.temperature}°C <br> ${data.advice}`;
}
```

---

## 📊 Resultado Final dos Testes

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
```

---

## 📈 Estatísticas do Projeto

| Métrica | Valor |
|---------|-------|
| Testes Unitários | 3 cenários |
| Testes de Integração | 3 cenários |
| Testes de Serviço | 1 cenário |
| Total de Testes | 7 testes |
| Cobertura | 100% dos cenários críticos |
| Status | ✅ Todos os testes passando |

---

## 🎯 Conclusão

Os testes automatizados foram fundamentais para identificar e corrigir os problemas no sistema. Através do Jest, foi possível:

1. ✅ Identificar lógica de negócio incorreta (regras de irrigação invertidas)
2. ✅ Detectar erros de integração com API externa (campo incorreto na resposta)
3. ✅ Encontrar inconsistências na API (nomes de campos diferentes)
4. ✅ Validar tratamento de erros (parâmetros obrigatórios)
5. ✅ Garantir qualidade do código (todos os testes passando)

O projeto agora está **100% funcional** e pode ser executado com:

```bash
cd backend
node server.js
```

Acesse `http://localhost:3000` no navegador para utilizar o sistema.

---

## 📝 Considerações Finais

O **AgroClima Inteligente** demonstra a importância dos testes automatizados no desenvolvimento de software. Através do TDD (Test-Driven Development) ou simplesmente utilizando testes para validar o código, é possível:

- **Reduzir bugs** antes da produção
- **Aumentar a confiança** no código
- **Facilitar manutenções** futuras
- **Documentar o comportamento** esperado do sistema
- **Prevenir regressões** ao adicionar novas funcionalidades

---

*Documentação gerada em: Março 2026*  
*Projeto desenvolvido para atividade de testes automatizados* 🌱
