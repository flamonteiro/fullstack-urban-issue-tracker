const express = require('express');
const router = express.Router();
const OcorrenciaController = require('../controllers/OcorrenciaController');
const { requireLogin, isAdmin, isCidadao } = require('../middlewares/auth');

router.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  if (req.session.user.idPerfil === 1) {
    return res.redirect('/admin/dashboard');
  }

  return res.redirect('/cidadao');
});

router.get('/login', OcorrenciaController.loginPage);
router.post('/login', OcorrenciaController.login);
router.get('/logout', OcorrenciaController.logout);

router.get('/admin/dashboard', requireLogin, isAdmin, OcorrenciaController.adminDashboard);
router.post('/admin/ocorrencias/:id/situacao', requireLogin, isAdmin, OcorrenciaController.adminUpdateStatus);
router.post('/admin/ocorrencias/:id/excluir', requireLogin, isAdmin, OcorrenciaController.adminDelete);

router.get('/cidadao', requireLogin, isCidadao, OcorrenciaController.cidadaoHome);
router.get('/cidadao/ocorrencias', requireLogin, isCidadao, OcorrenciaController.cidadaoList);
router.get('/cidadao/ocorrencias/novo', requireLogin, isCidadao, OcorrenciaController.cidadaoCreatePage);
router.post('/cidadao/ocorrencias', requireLogin, isCidadao, OcorrenciaController.cidadaoStore);
router.get('/cidadao/ocorrencias/:id/editar', requireLogin, isCidadao, OcorrenciaController.cidadaoEditPage);
router.post('/cidadao/ocorrencias/:id/editar', requireLogin, isCidadao, OcorrenciaController.cidadaoUpdate);
router.post('/cidadao/ocorrencias/:id/excluir', requireLogin, isCidadao, OcorrenciaController.cidadaoDelete);

router.get('/ocorrencias', requireLogin, isCidadao, OcorrenciaController.cidadaoList);
router.get('/ocorrencias/novo', requireLogin, isCidadao, OcorrenciaController.cidadaoCreatePage);
router.post('/ocorrencias', requireLogin, isCidadao, OcorrenciaController.cidadaoStore);
router.get('/ocorrencias/:id/editar', requireLogin, isCidadao, OcorrenciaController.cidadaoEditPage);
router.post('/ocorrencias/:id/excluir', requireLogin, isCidadao, OcorrenciaController.cidadaoDelete);

module.exports = router;
