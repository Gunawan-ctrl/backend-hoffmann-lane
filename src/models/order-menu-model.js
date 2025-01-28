import dbPool from '../config/database.js';

const create = (body) => {
  const SQLQuery = `
    INSERT INTO orders_menus (id_menu, id_order, qty, total)
    VALUES ('${body.id_menu}', '${body.id_order}', '${body.qty}', '${body.total}')
  `;
  return dbPool.execute(SQLQuery);
}

const getAll = async () => {
  const SQLQuery = `
    SELECT
      orders_menus.*
    FROM orders_menus
  `;
  const [rows] = await dbPool.execute(SQLQuery);
  return rows;
}

const getById = async (id) => {
  const SQLQuery = `
    SELECT * FROM orders_menus WHERE id = ?`;
  const [rows] = await dbPool.execute(SQLQuery, [id]);
  return rows[0];
}

const updateOne = async (id, body) => {
  const SQLQuery = `
    UPDATE orders_menus
    SET
      order_status = '${body.order_status}'
    WHERE id = ?
    `;
  return dbPool.execute(SQLQuery, [id]);
}

const deleteOne = async (id) => {
  const SQLQuery = `DELETE FROM orders_menus WHERE id = ? `;
  return dbPool.execute(SQLQuery, [id]);
}

export default {
  create,
  getAll,
  getById,
  updateOne,
  deleteOne
};