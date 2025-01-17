import dbPool from '../config/database.js';

const create = (body) => {
  const SQLQuery = `
    INSERT INTO orders (gross_amount, order_time, order_status, id_user, id_menu,  no_telp, alamat, qty)
    VALUES ('${body.gross_amount}', '${body.order_time}', '${body.order_status}', '${body.id_user}', '${body.id_menu}', '${body.no_telp}', '${body.alamat}', '${body.qty}')
  `;
  return dbPool.execute(SQLQuery);
}

const getAll = async () => {
  const SQLQuery = `
    SELECT
      orders.*,
      users.username as user_username,
      users.email as user_email,
      menus.name as menu_name,
      menus.description as menu_description,
      menus.price as menu_price,
      menus.upload_menu as menu_upload_menu,
      categories.name as category_name,
      categories.description as category_description
    FROM orders
    JOIN users ON orders.id_user = users.id
    JOIN menus ON orders.id_menu = menus.id
    JOIN categories ON menus.idKategori = categories.id
  `;
  const [rows] = await dbPool.execute(SQLQuery);
  return rows;
}

const getById = async (id) => {
  const SQLQuery = `
    SELECT * FROM orders WHERE id = ?`;
  const [rows] = await dbPool.execute(SQLQuery, [id]);
  return rows[0];
}

const updateOne = async (id, body) => {
  const SQLQuery = `
    UPDATE orders
    SET
      order_status = '${body.order_status}'
    WHERE id = ?
    `;
  return dbPool.execute(SQLQuery, [id]);
}

const deleteOne = async (id) => {
  const SQLQuery = `DELETE FROM orders WHERE id = ? `;
  return dbPool.execute(SQLQuery, [id]);
}

export default {
  create,
  getAll,
  getById,
  updateOne,
  deleteOne
};