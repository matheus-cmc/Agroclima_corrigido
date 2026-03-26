const request = require("supertest");
const app = require("../backend/server");

jest.mock("../backend/services/weatherService", () => {
    return jest.fn().mockResolvedValue({ 
        temperature: 25  // ← 25°C gera "Irrigação moderada"
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
        
        expect(res.body.temperature).toBe(25);  // ← 25
        expect(res.body.advice).toBe("Irrigação moderada");
    });
    
    test("GET /irrigation sem parâmetros deve retornar erro 400", async () => {
        const res = await request(app)
            .get("/irrigation");
        
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBeDefined();
    });
});