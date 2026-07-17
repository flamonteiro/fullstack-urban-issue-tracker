// src/middlewares/auth.js

function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  return res.redirect('/login');
}

function isAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.idPerfil === 1) {
    return next();
  }

  return res.status(403).send('Acesso negado');
}

function isCidadao(req, res, next) {
  if (req.session && req.session.user && req.session.user.idPerfil === 2) {
    return next();
  }

  return res.status(403).send('Acesso negado');
}

module.exports = {
  requireLogin,
  isAdmin,
  isCidadao,
};
