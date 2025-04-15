// Importa los módulos de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";


document.addEventListener('DOMContentLoaded', () => {
  // ========== Navegación entre pestañas ==========
  const tabs = document.querySelectorAll('.tab');
  const sections = document.querySelectorAll('.section');

  function mostrarSeccion(id) {
    sections.forEach(s => s.style.display = 'none');
    const target = document.getElementById(id);
    if (target) target.style.display = 'block';
  
    tabs.forEach(t => t.classList.remove('active'));
    const selectedTab = Array.from(tabs).find(t => t.dataset.target === id);
    if (selectedTab) selectedTab.classList.add('active');
  
    if (id === 'inicio') {
      const nombresCiudades = Object.keys(ciudades).slice(0, 100); // Hasta 100
      mostrarTodasLasCiudades(nombresCiudades);
    }
  }

  window.mostrarSeccion = mostrarSeccion;

  function irAInicio() {
    // Mostrar la sección
    mostrarSeccion('inicio');
  
    // Limpiar campo de búsqueda si existe
    const inputBusqueda = document.getElementById('buscarCiudad');
    if (inputBusqueda) inputBusqueda.value = '';
  
    // Resetear filtro si existe
    const filtro = document.getElementById('filtroClima');
    if (filtro) filtro.selectedIndex = 0;
  
    // Limpiar resultados de clima si existe
    const resultado = document.getElementById('resultadoClima');
    if (resultado) resultado.innerHTML = '';
  }
  
  window.irAInicio = irAInicio;

  // Tu configuración personalizada
  const firebaseConfig = {
    apiKey: "AIzaSyB1XBJlbdm3QFBU18cUbmfCO4wnImIXTjE",
    authDomain: "weather-aa2ba.firebaseapp.com",
    projectId: "weather-aa2ba",
    storageBucket: "weather-aa2ba.appspot.com",
    messagingSenderId: "355646859576",
    appId: "1:355646859576:web:8a8e7420b1056293edf9cd"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Hacer accesible globalmente
  window.firebaseDB = db;
  window.firebaseAddDoc = addDoc;
  window.firebaseCollection = collection;

  // Inicializar pestañas
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      mostrarSeccion(tab.dataset.target);
    });
  });

 
  // Lista de ciudades con sus coordenadas
  const ciudades = {
    "Bogota": { lat: 4.7110, lon: -74.0721 },
    "Nueva York": { lat: 40.7128, lon: -74.0060 },
    "Madrid": { lat: 40.4168, lon: -3.7038 },
    "Tokio": { lat: 35.6762, lon: 139.6503 },
    "Sídney": { lat: -33.8688, lon: 151.2093 },
    "El Cairo": { lat: 30.0444, lon: 31.2357 },
    "París": { lat: 48.8566, lon: 2.3522 },
    "Londres": { lat: 51.5074, lon: -0.1278 },
    "Roma": { lat: 41.9028, lon: 12.4964 },
    "Berlín": { lat: 52.5200, lon: 13.4050 },
    "Moscú": { lat: 55.7558, lon: 37.6173 },
    "Pekín": { lat: 39.9042, lon: 116.4074 },
    "Seúl": { lat: 37.5665, lon: 126.9780 },
    "Bangkok": { lat: 13.7563, lon: 100.5018 },
    "Delhi": { lat: 28.6139, lon: 77.2090 },
    "Estambul": { lat: 41.0082, lon: 28.9784 },
    "Dubái": { lat: 25.2048, lon: 55.2708 },
    "Singapur": { lat: 1.3521, lon: 103.8198 },
    "Hong Kong": { lat: 22.3193, lon: 114.1694 },
    "Toronto": { lat: 43.6510, lon: -79.3470 },
    "Chicago": { lat: 41.8781, lon: -87.6298 },
    "Los Ángeles": { lat: 34.0522, lon: -118.2437 },
    "San Francisco": { lat: 37.7749, lon: -122.4194 },
    "Ciudad de México": { lat: 19.4326, lon: -99.1332 },
    "Buenos Aires": { lat: -34.6037, lon: -58.3816 },
    "Santiago": { lat: -33.4489, lon: -70.6693 },
    "Lima": { lat: -12.0464, lon: -77.0428 },
    "Caracas": { lat: 10.4806, lon: -66.9036 },
    "Quito": { lat: -0.1807, lon: -78.4678 },
    "La Paz": { lat: -16.5000, lon: -68.1500 },
    "Montevideo": { lat: -34.9011, lon: -56.1645 },
    "Asunción": { lat: -25.2637, lon: -57.5759 },
    "Brasilia": { lat: -15.7939, lon: -47.8828 },
    "Río de Janeiro": { lat: -22.9068, lon: -43}
  };

  const codigosClima = {
    0: "Despejado",
    1: "Principalmente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Niebla",
    48: "Niebla con escarcha",
    51: "Llovizna-ligera",
    53: "Llovizna-moderada",
    55: "Llovizna-intensa",
    61: "Lluvia-ligera",
    63: "Lluvia-moderada",
    65: "Lluvia-intensa",
    71: "Nevada-ligera",
    73: "Nevada-moderada",
    75: "Nevada intensa",
    80: "Chubascos-ligeros",
    81: "Chubascos-moderados",
    82: "Chubascos-violentos",
    // puedes agregar más si quieres
  };


  async function obtenerClima(nombreCiudad) {
    const { lat, lon } = ciudades[nombreCiudad];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
  
    const temperatura = Math.round(datos.current_weather.temperature);
  
    // aquí te aseguras que estadoClima sea texto y en minúsculas
    /*let estadoClima = datos.current_weather.weathercode.toString().toLowerCase();
    estadoClima = codigosClima[estadoClima];*/

    const codigo = datos.current_weather.weathercode;

    const tiempoActual = datos.current_weather.time;

    // Validamos si existe en el mapa codigosClima
    const estadoClima = codigosClima[codigo] ?? "desconocido";
  
    return { temperatura, estadoClima, tiempoActual };
  }


  function clasificarClima(estadoClima) {
    const estado = estadoClima.toLowerCase();
  
    if (estado.includes("lluvia") || estado.includes("llviz") || estado.includes("chubasco")) return "lluvia";
    if (estado.includes("nieve")) return "nieve";
    if (estado.includes("nublado") || estado.includes("nublado")) return "nublado";
    if (estado.includes("niebla") || estado.includes("niebla")) return "niebla";
    if (estado.includes("soleado") || estado.includes("despejado") || estado.includes("claro")) return "soleado";
    
    return "otros"; // categoría por defecto
  }

  async function mostrarTodasLasCiudades(ciudades) {
    const contenedor = document.getElementById('ciudadesContainer');
    contenedor.innerHTML = '<p>Cargando clima...</p>';
  
    const cards = await Promise.all(ciudades.map(async ciudad => {
      const datos = await obtenerClima(ciudad); // Función que ya debes tener

      const climaClasificado = clasificarClima(datos.estadoClima);
      return `
        <div class="card ${datos.estadoClima.toLowerCase()}" data-nombre="${ciudad.toLowerCase()}" data-estado="${climaClasificado}">
          <video class="bg-video" autoplay muted loop playsinline>
            <source src="/videos/${datos.estadoClima.toLowerCase()}.mp4" type="video/mp4">
          </video>
          
            <h3>${ciudad}</h3>
            <p>${datos.temperatura}°C</p>
            <p>${datos.estadoClima.toLowerCase()}</p>
            <p>${datos.tiempoActual}</p>
            <button onclick='agregarFavorito("${ciudad}")'>💛 Agregar a favoritos</button>
          </div>
        </div>
      `;
    }));
  
    contenedor.innerHTML = cards.join('');
  }



 // ========== Buscar ciudad ==========
 const buscarBtn = document.getElementById('buscarBtn');
 if (buscarBtn) {
   buscarBtn.addEventListener('click', buscarCiudad);
 }

  
  document.getElementById('buscarCiudad').addEventListener('input', function () {
    const termino = this.value.toLowerCase();
    const cards = document.querySelectorAll('.card');
  
    cards.forEach(card => {
      const nombre = card.dataset.nombre || "";
      const estado = card.dataset.estado || "";
      const visible = nombre.includes(termino) || estado.includes(termino);
      card.style.display = visible ? 'block' : 'none';
    });
  });
  

  // ========== Registro de usuario ==========
  const formRegistro = document.getElementById('formRegistro');
  if (formRegistro) {
    formRegistro.addEventListener('submit', registrarUsuario);
  }

  async function registrarUsuario(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const direccion = document.querySelector("input[placeholder='Dirección']").value;
    const ciudad = document.querySelector("input[placeholder='Ciudad']").value;
    const telefono = document.querySelector("input[placeholder='Teléfono']").value;
    const nacimiento = document.querySelector("input[placeholder='Fecha de nacimiento']").value;

    const datos = {
      nombre, email, password, direccion, ciudad, telefono, nacimiento, fechaRegistro: new Date()
    };

    try {
      const ref = await window.firebaseAddDoc(
        window.firebaseCollection(window.firebaseDB, "usuarios"),
        datos
      );
      alert("Registro exitoso ✅ ID: " + ref.id);
    } catch (e) {
      console.error("Error al registrar:", e);
      alert("Hubo un error al registrar 😢");
    }
  }

  // ========== Favoritos localStorage ==========
  function agregarFavorito(ciudad) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    if (!favoritos.includes(ciudad)) {
      favoritos.push(ciudad);
      localStorage.setItem('favoritos', JSON.stringify(favoritos));
      mostrarFavoritos();
    }
  }

  async function mostrarFavoritos() {
    const contenedor = document.getElementById('listaFavoritos');
    if (!contenedor) return;
  
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
  
    if (favoritos.length === 0) {
      contenedor.innerHTML = "<p>No hay ciudades favoritas aún 💔</p>";
      return;
    }
  
      // Cambiamos el HTML para que sea un contenedor de cards
      contenedor.innerHTML = '<div class="favoritos-container" id="favoritosCards"></div>';
      
      // Mostramos las cards de favoritos
      await mostrarCardsFavoritos(favoritos);
  }


  async function mostrarCardsFavoritos(ciudadesFavoritas) {
    const contenedor = document.getElementById('favoritosCards');
    contenedor.innerHTML = '<p>Cargando tus ciudades favoritas...</p>';
  
    const cards = await Promise.all(ciudadesFavoritas.map(async ciudad => {
      if (!ciudades[ciudad]) {
        return `<div class="card error">
          <p>${ciudad} - Datos no disponibles</p>
          <button class="btn-eliminar" data-ciudad="${encodeURIComponent(ciudad)}">❌ Eliminar</button>
        </div>`;
      }
  
      try {
        const datos = await obtenerClima(ciudad);
        const climaClasificado = clasificarClima(datos.estadoClima);
        
        return `
          <div class="card ${datos.estadoClima.toLowerCase()}" data-nombre="${ciudad.toLowerCase()}" data-estado="${climaClasificado}">
            <video class="bg-video" autoplay muted loop playsinline>
              <source src="/videos/${datos.estadoClima.toLowerCase()}.mp4" type="video/mp4">
            </video>
            <div class="card-content">
              <h3>${ciudad}</h3>
              <p>${datos.temperatura}°C</p>
              <p>${datos.estadoClima.toLowerCase()}</p>
              <p>${datos.tiempoActual}</p>
              <button class="btn-eliminar" data-ciudad="${encodeURIComponent(ciudad)}">❌ Eliminar</button>
            </div>
          </div>
        `;
      } catch (error) {
        return `<div class="card error">
          <p>Error cargando ${ciudad}</p>
          <button class="btn-eliminar" data-ciudad="${encodeURIComponent(ciudad)}">❌ Eliminar</button>
        </div>`;
      }
    }));
  
    contenedor.innerHTML = cards.join('');
  
    // Agregar eventos a los botones de eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ciudad = decodeURIComponent(e.target.dataset.ciudad);
        eliminarFavorito(ciudad);
      });
    });
  }



  function eliminarFavorito(ciudad) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    favoritos = favoritos.filter(c => c !== ciudad);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    mostrarFavoritos();
  }

  // Inicializar favoritos
  mostrarFavoritos();
  // Mostrar la primera pestaña
  if (tabs.length > 0) tabs[0].click();

  window.agregarFavorito = agregarFavorito;

  document.getElementById('filtroClima').addEventListener('change', filtrarPorClima);


});

function filtrarPorClima() {
  const climaSeleccionado = document.getElementById("filtroClima").value.toLowerCase();
  const tarjetas = document.querySelectorAll(".card");

  tarjetas.forEach(tarjeta => {
    // Si el clima es "todos", se muestran todas las tarjetas
    if (climaSeleccionado === "todos") {
      tarjeta.style.display = "block";
    } else {
      // Solo se muestran si tienen una clase exacta que coincide
      const estadoTarjeta = tarjeta.dataset.estado.toLowerCase();
      tarjeta.style.display = estadoTarjeta.toLowerCase() === climaSeleccionado.toLowerCase() ? "block" : "none";
    }
  });
}