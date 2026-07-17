require('dotenv').config();
const pool = require('./src/config/db');

(async () => {
  try {
    const res = await pool.query("SELECT idUsuario, email, idPerfil, senha FROM usuario WHERE email IN ('admin@teste.com','cidadao@teste.com') ORDER BY email");
    console.log(res.rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
