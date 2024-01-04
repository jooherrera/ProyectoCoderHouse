const formReg = document.querySelector("#formRegister");
const enviarR = document.querySelector("#enviarRegistro");

formReg?.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    //Se envia la peticion POST con la informacion del formulario y se redirige al home con el res.session['usser] {first_name , last_name. isAdmin}
    const response = await fetch("/api/sessions/register", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      // @ts-ignore
      body: new URLSearchParams(new FormData(formRegister)),
    });

    if (response.status == 201) {
      // el satatus esta bien redirecciona a /
      const usuario = await response.json();
      window.location.href = `/`;
    }
    alert(response.message); // casi contrario muestra el error en una alerta
  } catch (error) {
    alert(error.message);
  }
});
