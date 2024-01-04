export async function cookieCreate(req, res, next) {
  res.cookie("cookie", "Esta Cookie es re power", {
    maxAge: 1000 * 60 * 60 * 24,
  });
  next();
}
