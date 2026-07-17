const pool = require('../config/db');
const bcrypt = require('bcrypt');

const ensureSeedData = async () => {
  await pool.query(`
    INSERT INTO situacao (idSituacao, status)
    VALUES (4, 'Pendente')
    ON CONFLICT (idSituacao) DO NOTHING;
  `);

  await pool.query(`
    INSERT INTO situacao (idSituacao, status)
    VALUES (5, 'Em Andamento')
    ON CONFLICT (idSituacao) DO NOTHING;
  `);

  await pool.query(`
    INSERT INTO situacao (idSituacao, status)
    VALUES (6, 'Concluída')
    ON CONFLICT (idSituacao) DO NOTHING;
  `);

  const categorias = ['Iluminação', 'Saneamento', 'Segurança'];
  for (const nomeCategoria of categorias) {
    const existing = await pool.query('SELECT idCategoria FROM categoria WHERE nomeCategoria = $1', [nomeCategoria]);
    if (existing.rows.length === 0) {
      await pool.query('INSERT INTO categoria (nomeCategoria) VALUES ($1)', [nomeCategoria]);
    }
  }

  const adminRes = await pool.query('SELECT idUsuario, senha FROM usuario WHERE email = $1', ['admin@teste.com']);
  if (adminRes.rows.length === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.query('INSERT INTO usuario (email, senha, idPerfil) VALUES ($1, $2, $3)', ['admin@teste.com', hashedPassword, 1]);
  } else {
    const admin = adminRes.rows[0];
    if (!admin.senha || !admin.senha.startsWith('$2')) {
      const hashedPassword = await bcrypt.hash(String(admin.senha || 'admin123'), 10);
      await pool.query('UPDATE usuario SET senha = $1 WHERE idUsuario = $2', [hashedPassword, admin.idusuario]);
    }
  }

  const cidadaoRes = await pool.query('SELECT idUsuario, senha FROM usuario WHERE email = $1', ['cidadao@teste.com']);
  if (cidadaoRes.rows.length === 0) {
    const hashedPassword = await bcrypt.hash('cidadao123', 10);
    await pool.query('INSERT INTO usuario (email, senha, idPerfil) VALUES ($1, $2, $3)', ['cidadao@teste.com', hashedPassword, 2]);
  } else {
    const cid = cidadaoRes.rows[0];
    if (!cid.senha || !cid.senha.startsWith('$2')) {
      const hashedPassword = await bcrypt.hash(String(cid.senha || 'cidadao123'), 10);
      await pool.query('UPDATE usuario SET senha = $1 WHERE idUsuario = $2', [hashedPassword, cid.idusuario]);
    }
  }
};

const getCategorias = async () => {
  const result = await pool.query(
    'SELECT idCategoria, nomeCategoria FROM categoria ORDER BY nomeCategoria'
  );
  return result.rows;
};

const getSituacoes = async () => {
  const result = await pool.query(
    'SELECT idSituacao, status FROM situacao ORDER BY status'
  );
  return result.rows;
};

const authenticateUser = async (email, senha) => {
  const result = await pool.query(
    'SELECT idUsuario, email, senha, idPerfil FROM usuario WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];
  const isMatch = await require('bcrypt').compare(senha, user.senha);

  if (!isMatch) {
    return null;
  }

  return {
    idUsuario: Number(user.idusuario),
    email: user.email,
    idPerfil: Number(user.idperfil),
  };
};

const insertEndereco = async (enderecoData, client = pool) => {
  const { rua, bairro, referencia, numero, cep } = enderecoData;
  const result = await client.query(
    `INSERT INTO endereco (rua, bairro, referencia, numero, cep)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING idEndereco`,
    [rua, bairro, referencia, numero, cep]
  );
  return result.rows[0].idendereco;
};

const insertOcorrencia = async (ocorrenciaData, client = pool) => {
  const { titulo, descricao, idSituacao, idCategoria, idEndereco, idUsuario } = ocorrenciaData;
  const result = await client.query(
    `INSERT INTO ocorrencia (titulo, descricao, dataCriacao, idSituacao, idCategoria, idEndereco, idUsuario)
     VALUES ($1, $2, NOW(), $3, $4, $5, $6)
     RETURNING idOcorrencia`,
    [titulo, descricao, idSituacao, idCategoria, idEndereco, idUsuario]
  );
  return result.rows[0].idocorrencia;
};

const createOcorrencia = async (payload) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const idEndereco = await insertEndereco(
      {
        rua: payload.rua,
        bairro: payload.bairro,
        referencia: payload.referencia,
        numero: payload.numero,
        cep: payload.cep,
      },
      client
    );

    await insertOcorrencia(
      {
        titulo: payload.titulo,
        descricao: payload.descricao,
        idSituacao: payload.idSituacao,
        idCategoria: payload.idCategoria,
        idEndereco,
        idUsuario: payload.idUsuario,
      },
      client
    );

    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const listOcorrencias = async ({ userId = null, categoriaId = null } = {}) => {
  const filters = [];
  const values = [];

  let query = `
    SELECT
      o.idOcorrencia,
      o.titulo,
      o.descricao,
      o.dataCriacao,
      c.nomeCategoria,
      s.status AS situacao,
      e.rua,
      e.bairro,
      e.referencia,
      e.numero,
      e.cep,
      u.email AS usuario_email,
      o.idSituacao,
      o.idCategoria,
      o.idUsuario
    FROM ocorrencia o
    JOIN categoria c ON o.idCategoria = c.idCategoria
    JOIN situacao s ON o.idSituacao = s.idSituacao
    JOIN endereco e ON o.idEndereco = e.idEndereco
    JOIN usuario u ON o.idUsuario = u.idUsuario`;

  if (userId) {
    filters.push('o.idUsuario = $1');
    values.push(userId);
  }

  if (categoriaId) {
    filters.push(`o.idCategoria = $${values.length + 1}`);
    values.push(categoriaId);
  }

  if (filters.length > 0) {
    query += ` WHERE ${filters.join(' AND ')}`;
  }

  query += ' ORDER BY o.dataCriacao DESC';

  const result = await pool.query(query, values);
  return result.rows;
};

const getOcorrenciaByIdForUser = async (idOcorrencia, idUsuario) => {
  const result = await pool.query(
    `SELECT
      o.idOcorrencia,
      o.titulo,
      o.descricao,
      o.idSituacao,
      o.idCategoria,
      o.idUsuario,
      e.rua,
      e.bairro,
      e.referencia,
      e.numero,
      e.cep
    FROM ocorrencia o
    JOIN endereco e ON o.idEndereco = e.idEndereco
    WHERE o.idOcorrencia = $1 AND o.idUsuario = $2`,
    [idOcorrencia, idUsuario]
  );

  return result.rows[0] || null;
};

const updateOcorrencia = async (payload) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const ocorrenciaResult = await client.query(
      'SELECT idEndereco FROM ocorrencia WHERE idOcorrencia = $1 AND idUsuario = $2',
      [payload.idOcorrencia, payload.idUsuario]
    );

    if (ocorrenciaResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return false;
    }

    const idEndereco = ocorrenciaResult.rows[0].idendereco;

    await client.query(
      `UPDATE ocorrencia
       SET titulo = $1, descricao = $2, idCategoria = $3
       WHERE idOcorrencia = $4 AND idUsuario = $5`,
      [payload.titulo, payload.descricao, payload.idCategoria, payload.idOcorrencia, payload.idUsuario]
    );

    await client.query(
      `UPDATE endereco
       SET rua = $1, bairro = $2, referencia = $3, numero = $4, cep = $5
       WHERE idEndereco = $6`,
      [payload.rua, payload.bairro, payload.referencia, payload.numero, payload.cep, idEndereco]
    );

    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const updateSituacaoOcorrencia = async (idOcorrencia, idSituacao) => {
  await pool.query('UPDATE ocorrencia SET idSituacao = $1 WHERE idOcorrencia = $2', [idSituacao, idOcorrencia]);
};

const deleteOcorrenciaAndEndereco = async (idOcorrencia, idUsuario = null) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const whereClause = idUsuario ? 'WHERE idOcorrencia = $1 AND idUsuario = $2' : 'WHERE idOcorrencia = $1';
    const values = idUsuario ? [idOcorrencia, idUsuario] : [idOcorrencia];

    const ocorrenciaResult = await client.query(
      `SELECT idEndereco FROM ocorrencia ${whereClause}`,
      values
    );

    if (ocorrenciaResult.rows.length === 0) {
      await client.query('ROLLBACK');
      if (idUsuario) {
        const error = new Error('forbidden');
        error.code = 'FORBIDDEN';
        throw error;
      }
      return false;
    }

    const idEndereco = ocorrenciaResult.rows[0].idendereco;

    await client.query('DELETE FROM ocorrencia WHERE idOcorrencia = $1', [idOcorrencia]);
    await client.query('DELETE FROM endereco WHERE idEndereco = $1', [idEndereco]);

    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  ensureSeedData,
  getCategorias,
  getSituacoes,
  authenticateUser,
  insertEndereco,
  insertOcorrencia,
  createOcorrencia,
  listOcorrencias,
  getOcorrenciaByIdForUser,
  updateOcorrencia,
  updateSituacaoOcorrencia,
  deleteOcorrenciaAndEndereco,
};
