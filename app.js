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

  // ========== Buscar ciudad ==========
  const buscarBtn = document.getElementById('buscarBtn');
  if (buscarBtn) {
    buscarBtn.addEventListener('click', buscarCiudad);
  }

  // Lista de ciudades con sus coordenadas
const ciudades = {
    "Bogotá": { lat: 4.7110, lon: -74.0721 },
    "Nueva York": { lat: 40.7128, lon: -74.0060 },
    "Madrid": { lat: 40.4168, lon: -3.7038 },
    "Tokio": { lat: 35.6762, lon: 139.6503 },
    "Sídney": { lat: -33.8688, lon: 151.2093 },
    "El Cairo": { lat: 30.0444, lon: 31.2357 }
  };
  
  // Función para buscar el clima
  async function buscarCiudad() {
    const ciudad = document.getElementById('buscarCiudad').value.trim();
    if (!ciudad) return alert('Escribe una ciudad');
  
    // Verificar si la ciudad está en la lista
    if (ciudades[ciudad]) {
      const coordenadas = ciudades[ciudad];
      
      try {
        // Llamamos a la API de Open-Meteo con las coordenadas
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordenadas.lat}&longitude=${coordenadas.lon}&current_weather=true&timezone=Europe%2FMadrid`);
        if (!response.ok) throw new Error('No se encontró el clima para la ciudad');
        
        const data = await response.json();
        mostrarClima(data);
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert('Ciudad no encontrada en la lista');
    }
  }
  
  function mostrarClima(data) {
    const contenedor = document.getElementById('resultadoClima');
    contenedor.innerHTML = `
      <h3>${data.name}</h3>
      <p>Temperatura: ${data.current_weather.temperature} °C</p>
      <p>Clima: ${data.current_weather.weathercode}</p>
      <button onclick='agregarFavorito("${data.name}")'>💛 Agregar a favoritos</button>
    `;
  }

  // ========== Filtro por condición climática ==========
  const filtroClima = document.getElementById('filtroClima');
  if (filtroClima) {
    filtroClima.addEventListener('change', aplicarFiltro);
  }

  function aplicarFiltro() {
    const valor = document.getElementById('filtroClima').value;
    alert(`Filtro aplicado: ${valor}`);
  }

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

  function mostrarFavoritos() {
    const contenedor = document.getElementById('listaFavoritos');
    if (!contenedor) return;
  
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    if (favoritos.length === 0) {
      contenedor.innerHTML = "<p>No hay ciudades favoritas aún 💔</p>";
      return;
    }
  
    contenedor.innerHTML = favoritos.map(ciudad => `
      <li>${ciudad} <button onclick="eliminarFavorito('${ciudad}')">❌</button></li>
    `).join('');
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

});