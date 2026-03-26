async function buscar() {
    const lat = document.getElementById("lat").value;
    const lon = document.getElementById("lon").value;

    const res = await fetch(`/irrigation?lat=${lat}&lon=${lon}`);

    const data = await res.json();

    document.getElementById("resultado").innerHTML =
        `Temperatura: ${data.temperature}°C <br> ${data.advice}`;
}

//FIM