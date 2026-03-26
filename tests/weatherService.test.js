const axios = require("axios");
const getWeather = require("../backend/services/weatherService");

jest.mock("axios");

describe("Testes do serviço de clima", () => {
    test("Deve retornar a temperatura corretamente após parse do JSON", async () => {
        // Mock da resposta correta da API
        const mockResponse = {
            data: {
                current_weather: {
                    temperature: 28,
                    windspeed: 10,
                    winddirection: 180
                }
            }
        };
        
        axios.get.mockResolvedValue(mockResponse);
        
        const result = await getWeather(-12, -38);
        
        // Este teste vai falhar porque o serviço está acessando 'current' ao invés de 'current_weather'
        expect(result.temperature).toBe(28);
    });
});