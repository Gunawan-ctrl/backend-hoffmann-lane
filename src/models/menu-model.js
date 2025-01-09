import dbPool from '../config/database.js';

const create = (body) => {
  const SQLQuery = `
    INSERT INTO menus (name, description, price, upload_menu, idKategori, status)
    VALUES ('${body.name}', '${body.description}', '${body.price}', '${body.upload_menu}', '${body.idKategori}', '${body.status}')
  `;
  return dbPool.execute(SQLQuery);
};

const getAll = async () => {
  const SQLQuery = `
    SELECT menus.*, categories.name as category_name, categories.description as category_description
    FROM menus
    JOIN categories ON menus.idkategori = categories.id
  `;
  const [rows] = await dbPool.execute(SQLQuery);
  return rows;
}

// getbyid
const getById = async (id) => {
  const SQLQuery = `
    SELECT menus.*, categories.name as category_name, categories.description as category_description
    FROM menus
    JOIN categories ON menus.idKategori = categories.id
    WHERE menus.id = ?
  `;
  const [rows] = await dbPool.execute(SQLQuery, [id]);
  return rows[0]; // Mengembalikan objek tunggal
}

// getbyidKategori
const getByIdKategori = async (idKategori) => {
  const SQLQuery = `
    SELECT menus.*, categories.name as category_name, categories.description as category_description
    FROM menus
    JOIN categories ON menus.idKategori = categories.id
    WHERE menus.idKategori = ?
  `;
  const [rows] = await dbPool.execute(SQLQuery, [idKategori]);
  return rows;
}

// getbystatus
const getByStatus = async (status) => {
  const SQLQuery = `
    SELECT menus.*, categories.name as category_name, categories.description as category_description
    FROM menus
    JOIN categories ON menus.idKategori = categories.id
    WHERE menus.status = ?
  `;
  const [rows] = await dbPool.execute(SQLQuery, [status]);
  return rows;
}

// update status menu
const updateStatus = async (body, id) => {
  const SQLQuery = `UPDATE menus SET status = ? WHERE id = ?`;
  const [result] = await dbPool.execute(SQLQuery, [body.status, id]);
  return result;
}

const updateOne = async (body, id) => {
  const SQLQuery = `UPDATE menus SET name = ?, description = ?, price = ?, upload_menu = ?, idKategori = ?, status = ?  WHERE id = ?`;
  const [result] = await dbPool.execute(SQLQuery, [body.name, body.description, body.price, body.upload_menu, body.idKategori, body.status, id]);
  return result;
}

const deleteOne = async (id) => {
  const SQLQuery = `DELETE FROM menus WHERE id = ?`;
  const [result] = await dbPool.execute(SQLQuery, [id]);
  return result;
}

export default {
  create,
  getAll,
  getById,
  getByIdKategori,
  getByStatus,
  updateStatus,
  updateOne,
  deleteOne,
}