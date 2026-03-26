async function buscar() {
    const lat = document.getElementById("lat").value;
    const lon = document.getElementById("lon").value;

    const res = await fetch(`/irrigation?lat=${lat}&lon=${lon}`);

    
    const data = res.json();

    document.getElementById("resultado").innerHTML =
        ` Temperatura: ${data.temp}°C <br>  ${data.advice}`;
}