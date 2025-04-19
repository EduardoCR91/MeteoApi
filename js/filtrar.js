export function filtrar(){
    const contenedor = document.querySelector('.contenedor');
  
    contenedor.innerHTML = `
  <section id="filtrarPorClima" class="section" style="display:none" >
    <h2>Filtrar</h2>
    <select id="filtroClima">
      <option value="todos">Todos</option>
      <option value="soleado">Soleado</option>
      <option value="lluvia">Lluvia</option>
      <option value="nieve">Nieve</option>
      <option value="niebla">Niebla</option>
      <option value="nublado">Nublado</option>
    </select>
  </section>
    `;
  
}