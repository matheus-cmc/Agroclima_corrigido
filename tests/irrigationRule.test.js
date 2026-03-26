const getIrrigationAdvice = require("../backend/utils/irrigationRule");

describe("Testes de regra de irrigação", () => {
    test("Temperatura 35°C deve retornar Irrigação URGENTE", () => {
        expect(getIrrigationAdvice(35)).toBe("Irrigação URGENTE");
    });

    test("Temperatura 25°C deve retornar Irrigação moderada", () => {
        expect(getIrrigationAdvice(25)).toBe("Irrigação moderada");
    });

    test("Temperatura 10°C deve retornar Não irrigar", () => {
        expect(getIrrigationAdvice(10)).toBe("Não irrigar");
    });
});