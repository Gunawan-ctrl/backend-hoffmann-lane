import dbPool from '../config/database.js';

const create = (body) => {
  const SQLQuery = `  INSERT INTO categories (name, description)
                        VALUES ('${body.name}', '${body.description}')`;
  return dbPool.execute(SQLQuery);
}

const getAll = async () => {
  const SQLQuery = 'SELECT * FROM categories';
  const [rows] = await dbPool.execute(SQLQuery);
  return rows;
}

const getById = async (id) => {
  const SQLQuery = 'SELECT * FROM categories WHERE id = ?';
  const [rows] = await dbPool.execute(SQLQuery, [id]);
  return rows[0];
}

const updateOne = async (body, id) => {
  const SQLQuery = `UPDATE categories SET name = ?, description = ? WHERE id = ?`;
  const [result] = await dbPool.execute(SQLQuery, [body.name, body.description, id]);
  return result;
}

const deleteOne = async (id) => {
  const SQLQuery = `DELETE FROM categories WHERE id = ?`;
  const [result] = await dbPool.execute(SQLQuery, [id]);
  return result;
}

export default {
  create,
  getAll,
  getById,
  updateOne,
  deleteOne,
}