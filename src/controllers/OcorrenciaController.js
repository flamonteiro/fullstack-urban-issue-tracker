const OcorrenciaQueries = require('../models/OcorrenciaQueries');

const loginPage = (req, res) => {
  if (req.session && req.session.user) {
    if (req.session.user.idPerfil === 1) {
      return res.redirect('/admin/dashboard');
    }
    return res.redirect('/cidadao');
  }

  return res.render('auth/login', { error: null, user: null });
};

const login = async (req, res, next) => {
  const { email, senha } = req.body;

  try {
    const user = await OcorrenciaQueries.authenticateUser(email, senha);

    if (!user) {
      return res.render('auth/login', {
        error: 'E-mail ou senha inválidos.',
        user: null,
      });
    }

    req.session.user = user;
    req.session.save(() => {
      if (user.idPerfil === 1) {
        return res.redirect('/admin/dashboard');
      }
      return res.redirect('/cidadao');
    });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

const adminDashboard = async (req, res, next) => {
  try {
    const categorias = await OcorrenciaQueries.getCategorias();
    const categoriaId = req.query.categoriaId || '';
    const ocorrencias = await OcorrenciaQueries.listOcorrencias({ categoriaId: categoriaId || null });

    return res.render('admin/dashboard', {
      ocorrencias,
      categorias,
      selectedCategoria: categoriaId,
      user: req.session.user,
    });
  } catch (error) {
    return next(error);
  }
};

const cidadaoHome = (req, res) => {
  return res.render('cidadao/home', { user: req.session.user });
};

const cidadaoList = async (req, res, next) => {
  try {
    const categorias = await OcorrenciaQueries.getCategorias();
    const categoriaId = req.query.categoriaId || '';
    const ocorrencias = await OcorrenciaQueries.listOcorrencias({
      userId: req.session.user.idUsuario,
      categoriaId: categoriaId || null,
    });

    return res.render('cidadao/list', {
      ocorrencias,
      categorias,
      selectedCategoria: categoriaId,
      user: req.session.user,
    });
  } catch (error) {
    return next(error);
  }
};

const cidadaoCreatePage = async (req, res, next) => {
  try {
    const categorias = await OcorrenciaQueries.getCategorias();
    return res.render('cidadao/form', {
      categorias,
      ocorrencia: null,
      user: req.session.user,
      action: '/cidadao/ocorrencias',
      title: 'Criar ocorrência',
    });
  } catch (error) {
    return next(error);
  }
};

const cidadaoStore = async (req, res, next) => {
  try {
    const {
      titulo,
      descricao,
      idCategoria,
      rua,
      numero,
      bairro,
      cep,
      referencia,
    } = req.body;

    const payload = {
      titulo,
      descricao,
      idCategoria,
      idSituacao: 4,
      rua,
      numero: Number(numero) || 0,
      bairro,
      cep,
      referencia,
      idUsuario: req.session.user.idUsuario,
    };

    await OcorrenciaQueries.createOcorrencia(payload);
    return res.redirect('/cidadao/ocorrencias');
  } catch (error) {
    return next(error);
  }
};

const cidadaoEditPage = async (req, res, next) => {
  try {
    const categorias = await OcorrenciaQueries.getCategorias();
    const ocorrencia = await OcorrenciaQueries.getOcorrenciaByIdForUser(
      req.params.id,
      req.session.user.idUsuario
    );

    if (!ocorrencia) {
      return res.status(404).send('Ocorrência não encontrada.');
    }

    return res.render('cidadao/form', {
      categorias,
      ocorrencia,
      user: req.session.user,
      action: `/cidadao/ocorrencias/${req.params.id}/editar`,
      title: 'Editar ocorrência',
    });
  } catch (error) {
    return next(error);
  }
};

const cidadaoUpdate = async (req, res, next) => {
  try {
    const { titulo, descricao, idCategoria, rua, numero, bairro, cep, referencia } = req.body;
    const updated = await OcorrenciaQueries.updateOcorrencia({
      idOcorrencia: req.params.id,
      titulo,
      descricao,
      idCategoria,
      rua,
      numero: Number(numero) || 0,
      bairro,
      cep,
      referencia,
      idUsuario: req.session.user.idUsuario,
    });

    if (!updated) {
      return res.status(403).send('Você não tem permissão para editar esta ocorrência.');
    }

    return res.redirect('/cidadao/ocorrencias');
  } catch (error) {
    return next(error);
  }
};

const cidadaoDelete = async (req, res, next) => {
  try {
    await OcorrenciaQueries.deleteOcorrenciaAndEndereco(req.params.id, req.session.user.idUsuario);
    return res.redirect('/cidadao/ocorrencias');
  } catch (error) {
    if (error.message === 'forbidden') {
      return res.status(403).send('Você não tem permissão para excluir esta ocorrência.');
    }
    return next(error);
  }
};

const adminUpdateStatus = async (req, res, next) => {
  try {
    const { idSituacao } = req.body;
    await OcorrenciaQueries.updateSituacaoOcorrencia(req.params.id, idSituacao);
    return res.redirect('/admin/dashboard');
  } catch (error) {
    return next(error);
  }
};

const adminDelete = async (req, res, next) => {
  try {
    await OcorrenciaQueries.deleteOcorrenciaAndEndereco(req.params.id);
    return res.redirect('/admin/dashboard');
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  loginPage,
  login,
  logout,
  adminDashboard,
  cidadaoHome,
  cidadaoList,
  cidadaoCreatePage,
  cidadaoStore,
  cidadaoEditPage,
  cidadaoUpdate,
  cidadaoDelete,
  adminUpdateStatus,
  adminDelete,
};
