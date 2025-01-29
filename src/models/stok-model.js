import dbPool from '../config/database.js';

const create = (body) => {
  const SQLQuery = `INSERT INTO stoks (name, price, stok)
                        VALUES ('${body.name}', '${body.price}', '${body.stok}')`;

  return dbPool.execute(SQLQuery);
}

const getAll = async () => {
  const SQLQuery = 'SELECT * FROM stoks';
  const [rows] = await dbPool.execute(SQLQuery);
  return rows;
}

const getTotalByMonth = async () => {
  const SQLQuery = `
    SELECT
      MONTHNAME(created_at) AS month,
      COUNT(*) AS count
    FROM stok
    GROUP BY MONTH(created_at)
  `;
  const [rows] = await dbPool.execute(SQLQuery);
  return rows;
}

// getbyid
const getById = async (id) => {
  const SQLQuery = 'SELECT * FROM stoks WHERE id = ?';
  const [rows] = await dbPool.execute(SQLQuery, [id]);
  return rows[0];
}


const updateOne = async (body, id) => {
  const SQLQuery = `UPDATE stoks SET name = ?, price = ?, stok = ? WHERE id = ?`;
  const [result] = await dbPool.execute(SQLQuery, [body.name, body.price, body.stok, id]);
  return result;
}

const deleteOne = async (id) => {
  const SQLQuery = `DELETE FROM stoks WHERE id = ?`;
  const [result] = await dbPool.execute(SQLQuery, [id]);
  return result;
}

export default {
  create,
  getTotalByMonth,
  getAll,
  getById,
  updateOne,
  deleteOne,
}