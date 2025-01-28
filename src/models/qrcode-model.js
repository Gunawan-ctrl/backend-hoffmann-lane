import dbPool from '../config/database.js';

const create = (body) => {
  const SQLQuery = `INSERT INTO qr_codes (\`table\`, imageQr)
                        VALUES ('${body.table}', '${body.imageQr}' )`;

  return dbPool.execute(SQLQuery);
}

const getAll = async () => {
  const SQLQuery = 'SELECT * FROM qr_codes';
  const [rows] = await dbPool.execute(SQLQuery);
  return rows;
}

const getById = async (id) => {
  const SQLQuery = 'SELECT * FROM qr_codes WHERE id = ?';
  const [rows] = await dbPool.execute(SQLQuery, [id]);
  return rows[0];
}

const deleteOne = async (id) => {
  const SQLQuery = `DELETE FROM qr_codes WHERE id = ?`;
  const [result] = await dbPool.execute(SQLQuery, [id]);
  return result;
}

export default { create, getAll, getById, deleteOne }