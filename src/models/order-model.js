import dbPool from '../config/database.js';

const create = (body) => {
  const SQLQuery = `
    INSERT INTO orders (gross_amount, order_time, order_status, qty,   \`table\`)
    VALUES ('${body.gross_amount}', '${body.order_time}', '${body.order_status}',  '${body.qty}', '${body.table}')
  `;
  return dbPool.execute(SQLQuery);
}

const getAll = async () => {
  const SQLQuery = `
    SELECT
      orders.id,
      orders.gross_amount,
      orders.order_time,
      orders.order_status,
      orders.qty,
      orders.\`table\`,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id_menu', orders_menus.id_menu,
          'id_order', orders_menus.id_order,
          'qty', orders_menus.qty,
          'total', orders_menus.total
        )
      ) AS items
    FROM orders
    LEFT JOIN orders_menus ON orders.id = orders_menus.id_order
    GROUP BY orders.id
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