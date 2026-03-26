const axios = require("axios");

module.exports = async function getWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const response = await axios.get(url);
  
    return {
        temperature: response.data.current_weather.temperature
    };
};