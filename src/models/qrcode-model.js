import dbPool from '../config/database.js';

const create = async (body) => {
  const SQLQuery = `INSERT INTO qr_codes (\`table\`, imageQr)
                    VALUES (?, ?)`;

  try {
    await dbPool.execute(SQLQuery, [body.table, body.imageQr]);
    return { success: true, message: 'QR code created successfully' };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, message: 'Table already has a QR code' };
    }
    throw error;
  }
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