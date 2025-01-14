import dbPool from '../config/database.js';

const createTransaction = async (body) => {
  const SQLQuery = `
    INSERT INTO transactions 
      (transaction_id, gross_amount, payment_type, transaction_time, transaction_status, id_user, id_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    body.transaction_id,
    body.gross_amount,
    body.payment_type,
    body.transaction_time,
    body.transaction_status,
    body.id_user,
    body.id_order,
  ];
  return dbPool.execute(SQLQuery, values);
};

const getAll = async () => {
  const SQLQuery = `
    SELECT * FROM transactions
  `;
  const [rows] = await dbPool.execute(SQLQuery);
  return rows;
};

const getTransactionById = async (transaction_id) => {
  const SQLQuery = `
    SELECT * FROM transactions WHERE transaction_id = ?
  `;
  const [rows] = await dbPool.execute(SQLQuery, [transaction_id]);
  return rows[0];
};

const getTransactionByIdUser = async (id_user) => {
  const SQLQuery = `
    SELECT
      transactions.*, 
      users.username AS user_username, 
      users.email AS user_email,
      orders.qty AS order_qty, 
      orders.total_price AS order_total_price
    FROM transactions
    JOIN users ON transactions.id_user = users.id
    JOIN orders ON transactions.id_order = orders.id
    WHERE transactions.id_user = ?
  `;
  const [rows] = await dbPool.execute(SQLQuery, [id_user]);
  return rows;
};

export default {
  createTransaction,
  getAll,
  getTransactionById,
  getTransactionByIdUser,
};
