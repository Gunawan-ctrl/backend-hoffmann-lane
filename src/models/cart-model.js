import dbPool from '../config/database.js';

const create = (body) => {
  const SQLQuery = `
    INSERT INTO carts (id_user, id_menu, qty, total_price)
    VALUES ('${body.id_user}', '${body.id_menu}', '${body.qty}', '${body.total_price}')
  `;
  return dbPool.execute(SQLQuery);
}

const getAll = async () => {
  const SQLQuery = `
    SELECT
      carts.*,
      users.username as user_username,
      users.email as user_email,
      menus.name as menu_name,
      menus.description as menu_description,
      menus.price as menu_price,
      menus.upload_menu as menu_upload_menu,
      categories.name as category_name,
      categories.description as category_description
    FROM carts
    JOIN users ON carts.id_user = users.id
    JOIN menus ON carts.id_menu = menus.id
    JOIN categories ON menus.idKategori = categories.id
  `;
  const [rows] = await dbPool.execute(SQLQuery);
  return rows;
}

const getByIdUser = async (id_user) => {
  const SQLQuery = `
    SELECT
      carts.*,
      users.username as user_username,
      users.email as user_email,
      menus.name as menu_name,
      menus.description as menu_description,
      menus.price as menu_price,
      menus.upload_menu as menu_upload_menu,
      categories.name as category_name,
      categories.description as category_description
    FROM carts
    JOIN users ON carts.id_user = users.id
    JOIN menus ON carts.id_menu = menus.id
    JOIN categories ON menus.idKategori = categories.id
    WHERE carts.id_user = ?
  `;
  const [rows] = await dbPool.execute(SQLQuery, [id_user]);
  return rows;
}

const updateOne = async (id, body) => {
  const SQLQuery = `
    UPDATE carts
    SET
      id_user = '${body.id_user}',
      id_menu = '${body.id_menu}',
      qty = '${body.qty}',
      total_price = '${body.total_price}'
    WHERE id = ?
  `;
  return dbPool.execute(SQLQuery, [id]);
}

const deleteOne = async (id) => {
  const SQLQuery = `
    DELETE FROM carts
    WHERE id = ?
  `;
  return dbPool.execute(SQLQuery, [id]);
}

export default {
  create,
  getAll,
  getByIdUser,
  updateOne,
  deleteOne,
}