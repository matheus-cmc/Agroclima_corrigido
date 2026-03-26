const express = require("express");
const cors = require("cors");
const getWeather = require("./services/weatherService");
const getIrrigationAdvice = require("./utils/irrigationRule");

const app = express();

app.use(cors());
app.use(express.json());

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
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

module.exports = app;