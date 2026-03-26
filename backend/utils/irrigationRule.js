function getIrrigationAdvice(temp) {
    if (temp > 30) return "Irrigação URGENTE";
    if (temp >= 20) return "Irrigação moderada";
    return "Não irrigar";
}

module.exports = getIrrigationAdvice;