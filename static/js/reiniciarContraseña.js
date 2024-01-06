const formLogin = document.querySelector("#formulario");

//Se envia la peticion POST con los datos del form para comprobar que exista en la base de datos, si existe, si redirecciona a / con el usuario cargado
formLogin.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const inputsVAlores = JSON.stringify({
      email: document.querySelector("#email").value,
      password: document.querySelector("#password").value,
    });
    const response = await fetch("/api/sessions/cambiarPassword", {
      // /login para hacerlo con session

      method: "PUT",
      headers: { "Content-Type": "application/json" },
      // @ts-ignore
      body: inputsVAlores,
    });
    const res = await response.json(); // si el status es Success vuelve a / a ver los productos, sino envia una alert
    if (res.status === "success") {
      window.location.href = `/`;
    }
  } catch (error) {
    alert(error.message);
  }
});
