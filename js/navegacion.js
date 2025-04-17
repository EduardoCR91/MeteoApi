import { mostrarTodasLasCiudades } from './weather.js';

export function inicializarNavegacion() {
    const tabs = document.querySelectorAll('.tabs button');
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

  function irAInicio() {
    mostrarSeccion('inicio');
    const inputBusqueda = document.getElementById('buscarCiudad');
    if (inputBusqueda) inputBusqueda.value = '';
    const filtro = document.getElementById('filtroClima');
    if (filtro) filtro.selectedIndex = 0;
    const resultado = document.getElementById('resultadoClima');
    if (resultado) resultado.innerHTML = '';
  }
  
  // Asignar a window para acceso global
  window.mostrarSeccion = mostrarSeccion;
  window.irAInicio = irAInicio;

  // Inicializar pestañas
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      mostrarSeccion(tab.dataset.target);
    });
  });

  // Mostrar la primera pestaña
  if (tabs.length > 0) tabs[0].click();
}