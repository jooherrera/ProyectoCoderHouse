export function soloLoguedosApi(req, res, next) {
  if (!req.isAuthenticated()) {
    return res
      .status(403)
      .json({ status: "error", message: "Aun no iniciaste sesion" });
  }
  next();
}
export function soloLoguedosWeb(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
}
