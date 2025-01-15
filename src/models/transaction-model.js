import dbPool from '../config/database.js';

const createTransaction = async (body) => {
  const SQLQuery = `
    INSERT INTO transactions 
      (gross_amount, payment_type, transaction_time, transaction_status, id_user, id_order, id_menu)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    body.gross_amount,
    body.payment_type || null,
    body.transaction_time || null,
    body.transaction_status || null,
    body.id_user,
    body.id_order,
    body.id_menu,
  ];
  const [result] = await dbPool.execute(SQLQuery, values);
  return result;
};


const getAll = async () => {
  const SQLQuery = `
    SELECT 
      transactions.*, 
      users.id AS user_id, 
      users.username AS user_username, 
      users.email AS user_email,
      orders.id AS order_id, 
      orders.qty AS order_qty, 
      orders.total_price AS order_total_price,
      menus.id AS menu_id,
      menus.name AS menu_name
    FROM transactions
    JOIN users ON transactions.id_user = users.id
    JOIN orders ON transactions.id_order = orders.id
    JOIN menus ON transactions.id_menu = menus.id
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

const updateTransaction = async (transaction_id, body) => {
  const SQLQuery = `
    UPDATE transactions
    SET
      gross_amount = ?,
      payment_type = ?,
      transaction_time = ?,
      transaction_status = ?,
      id_user = ?,
      id_order = ?,
      id_menu = ?
    WHERE transaction_id = ?
  `;
  const values = [
    body.gross_amount,
    body.payment_type || null,
    body.transaction_time || null,
    body.transaction_status || null,
    body.id_user,
    body.id_order,
    body.id_menu,
    transaction_id,
  ];
  const [result] = await dbPool.execute(SQLQuery, values);
  return result;
};

export default {
  createTransaction,
  getAll,
  getTransactionById,
  getTransactionByIdUser,
  updateTransaction,
};
