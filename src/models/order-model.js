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
      orders.*
    FROM orders
  `;
  const [rows] = await dbPool.execute(SQLQuery);
  return rows;
}

const getTotalAmount = async () => {
  const SQLQuery = `
    SELECT
      SUM(gross_amount) AS total_amount
    FROM orders
  `;
  const [rows] = await dbPool.execute(SQLQuery);
  return rows[0].total_amount;
}

const getOrderSummaryByMonth = async () => {
  const SQLQuery = `
    SELECT
      DATE_FORMAT(order_time, '%M') AS month, 
      MONTH(order_time) AS month_number,
      COUNT(*) AS total_orders,
      SUM(gross_amount) AS total_amount
    FROM orders
    WHERE order_time >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
    GROUP BY month, month_number
    ORDER BY month_number
  `;
  const [rows] = await dbPool.execute(SQLQuery);
  return rows;
};

const getById = async (id) => {
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
          'name', menus.name,
          'description', menus.description,
          'qty', orders_menus.qty,
          'total', orders_menus.total
        )
      ) AS items
    FROM orders
    LEFT JOIN orders_menus ON orders.id = orders_menus.id_order
    LEFT JOIN menus ON orders_menus.id_menu = menus.id
    WHERE orders.id = ?
    GROUP BY orders.id
  `;
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
  getTotalAmount,
  getOrderSummaryByMonth,
  getAll,
  getById,
  updateOne,
  deleteOne
};