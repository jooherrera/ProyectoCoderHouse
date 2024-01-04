const usserName = "unUsuario";
const ordenDeProduct = document.querySelector("#ordenar");
const botonBuscar = document.querySelector("#botonBuscar");
const botonDesc = document.querySelectorAll("#botonDescripcon");
const socket = io("http://localhost:8080/", {
  auth: {
    usserName,
  },
});

let ordenar = true;
function irPagina(limit) {
  const pagDeseada = document.querySelector("input").value || 1;
  window.location = `/?limit=${limit}&page=${pagDeseada}&sort=${ordenar}`;
}
ordenDeProduct.addEventListener("change", function cambioOrden(limit) {
  try {
    ordenar = document.querySelector("#ordenar").value;
    console.log(ordenar);
    window.location = `/?sort=${ordenar}`;
  } catch (error) {
    console.log(error.message);
  }
});

async function descripcionProducto(button) {
  window.location = `/${button.parentNode.childNodes[1].textContent}`;
}

async function volver() {
  window.location = `/`;
}
