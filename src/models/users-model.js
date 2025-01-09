import dbPool from '../config/database.js';

const findUserByUsernameOrEmail = async (identifier) => {
  const SQLQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
  const [rows] = await dbPool.execute(SQLQuery, [identifier, identifier]);
  return rows[0];
};

const createUser = async (userData) => {
  const SQLQuery = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
  const [result] = await dbPool.execute(SQLQuery, [
    userData.username,
    userData.email,
    userData.password, // hashed password
    userData.role || 'user',
  ]);
  return result;
};

const getAllUsers = async () => {
  const SQLQuery = 'SELECT * FROM users';
  const [rows] = await dbPool.execute(SQLQuery);
  return rows;
}

const getById = async (id) => {
  const SQLQuery = 'SELECT * FROM users WHERE id = ?';
  const [rows] = await dbPool.execute(SQLQuery, [id]);
  return rows[0];
}


const updateUser = async (body, id) => {
  const SQLQuery = `UPDATE users SET username = ?, email = ? WHERE id = ?`;
  const [result] = await dbPool.execute(SQLQuery, [body.username, body.email, id]);
  return result;
}

const deleteUser = async (id) => {
  const SQLQuery = `DELETE FROM users WHERE id = ?`;
  const [result] = await dbPool.execute(SQLQuery, [id]);
  return result;
}

export default {
  findUserByUsernameOrEmail,
  createUser,
  getAllUsers,
  getById,
  updateUser,
  deleteUser,
}