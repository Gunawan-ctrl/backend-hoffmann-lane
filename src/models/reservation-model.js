import dbPool from '../config/database.js';

const create = (body) => {
  const SQLQuery = `INSERT INTO reservations (name, date, time, phone, manyPeople)
                        VALUES ('${body.name}', '${body.date}', '${body.time}', '${body.phone}', '${body.manyPeople}' )`;

  return dbPool.execute(SQLQuery);
}

const getAll = async () => {
  const SQLQuery = 'SELECT * FROM reservations';
  const [rows] = await dbPool.execute(SQLQuery);
  return rows;
}

// getbyid
const getById = async (id) => {
  const SQLQuery = 'SELECT * FROM reservations WHERE id = ?';
  const [rows] = await dbPool.execute(SQLQuery, [id]);
  return rows[0];
}


const updateOne = async (body, id) => {
  const SQLQuery = `UPDATE reservations SET name = ?, date = ?, time = ?, phone = ?, manyPeople = ? WHERE id = ?`;
  const [result] = await dbPool.execute(SQLQuery, [body.name, body.date, body.time, body.phone, body.manyPeople, id]);
  return result;
}

const deleteOne = async (id) => {
  const SQLQuery = `DELETE FROM reservations WHERE id = ?`;
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