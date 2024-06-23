let map;
let autocomplete;
let marker;

function initMap() {
    // Inicializar el mapa
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 4.8087174, lng: -75.690601 },
        zoom: 8,
    });

    // Inicializar el campo de autocomplete
    const input = document.getElementById("location-input");
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            console.error("No hay detalles : '" + place.name + "'");
            return;
        }

        // Centrar el mapa en la ubicación seleccionada
        map.setCenter(place.geometry.location);
        map.setZoom(10);

        // Colocar un marcador en la ubicación seleccionada
        if (marker) {
            marker.setMap(null);
        }
        marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
        });

        // Obtener y mostrar el clima actual en la ubicación seleccionada
        getWeather(place.geometry.location.lat(), place.geometry.location.lng());
    });
}

async function getWeather(lat, lon) {
    // Obtener el clima actual usando la API de Open Meteo
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const data = await response.json();
    
    // Actualizar el contenido del elemento con la temperatura
    const temperatureElement = document.getElementById("temperature");
    const temperature = data.current_weather.temperature;
    temperatureElement.textContent = `${temperature} °C`;
    //const precipitation = document.getElementById("precipitacion");
    
    // Actualizar el icono del clima
    const weatherIcon = document.getElementById("weather-icon");
    if (temperature >= 30) {
        weatherIcon.src = "./sol.png"; // Ruta del icono para clima soleado
    } else if (temperature >= 25) {
        weatherIcon.src = "./parcialmente.png"; // Ruta del icono para clima parcialmente nublado
    } else if (temperature >= 10) {
        weatherIcon.src = "./nublado.png"; // Ruta del icono para clima nublado
    } else {
        weatherIcon.src = "./frio.png"; // Ruta del icono para clima frío
    }
    weatherIcon.alt = "Icono del clima";
}

// Cargar el mapa cuando se carga la página
window.onload = initMap;
