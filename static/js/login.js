// const formLogin = document.querySelector("#formulario");

// //Se envia la peticion POST con los datos del form para comprobar que exista en la base de datos, si existe, si redirecciona a / con el usuario cargado
// formLogin.addEventListener("submit", async (event) => {
//   event.preventDefault();
//   try {
//     const response = await fetch("/api/sessions/loginPassport", {
//       // /login para hacerlo con session

//       method: "POST",
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       // @ts-ignore
//       body: new URLSearchParams(new FormData(formLogin)),
//     });
//     const res = await response.json(); // si el status es Success vuelve a / a ver los productos, sino envia una alert
//     if (res.status === "success") {
//       window.location.href = `/`;
//     }
//   } catch (error) {
//     alert(error.message);
//   }
// });

const formLogin = document.querySelector("#formulario");

//Se envia la peticion POST con los datos del form para comprobar que exista en la base de datos, si existe, si redirecciona a / con el usuario cargado
formLogin.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const inputsVAlores = JSON.stringify({
      email: document.querySelector("#email").value,
      password: document.querySelector("#password").value,
    });
    console.log(inputsVAlores);
    const response = await fetch("/api/sessions/loginPassport", {
      // /login para hacerlo con session

      method: "POST",
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
