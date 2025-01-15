import orderModel from "../models/order-model.js";
import dbPool from '../config/database.js';
import requestResponse from "../config/response.js";

const create = async (req, res) => {
  const { body } = req;
  try {
    // Periksa role pengguna
    const [user] = await dbPool.execute('SELECT role FROM users WHERE id = ?', [body.id_user]);
    if (user.length === 0) {
      return res.status(404).json(requestResponse.errorResponse('User not found'));
    }
    if (user[0].role !== 2) {
      return res.status(403).json(requestResponse.errorResponse('User does not have permission to create order'));
    }

    // Periksa apakah order sudah ada
    const [existingOrder] = await dbPool.execute('SELECT * FROM orders WHERE id_user = ? AND id_menu = ?', [body.id_user, body.id_menu]);
    if (existingOrder.length > 0) {
      // Jika order sudah ada, tambahkan qty
      const newQty = existingOrder[0].qty + body.qty;
      await dbPool.execute('UPDATE orders SET qty = ?, total_price = ? WHERE id = ?', [newQty, existingOrder[0].total_price + body.total_price, existingOrder[0].id]);
      return res.status(200).json(requestResponse.successUpdateData({ ...existingOrder[0], qty: newQty, total_price: existingOrder[0].total_price + body.total_price }));
    }

    // Buat order baru dengan qty 1 jika belum ada
    body.qty = 1;
    const data = await orderModel.create(body);
    res.status(201).json(requestResponse.successCreateData(body));
  } catch (error) {
    console.log('order', error);
    res.status(500).json(requestResponse.errorServer(error));
  }
}


const getAll = async (req, res) => {
  try {
    const data = await orderModel.getAll();
    const order = data.map(item => ({
      id: item.id,
      user: {
        id: item.id_user,
        username: item.user_username,
        email: item.user_email
      },
      menu: {
        id: item.id_menu,
        name: item.menu_name,
        description: item.menu_description,
        price: item.menu_price,
        upload_menu: item.menu_upload_menu,
        category: {
          id: item.idKategori,
          name: item.category_name,
          description: item.category_description
        }
      },
      qty: item.qty,
      total_price: item.total_price
    }));
    res.json(requestResponse.suksesWithData(order));
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error));
  }
}

const getByIdUser = async (req, res) => {
  const { id_user } = req.params;
  console.log('id_user', id_user);
  try {
    const data = await orderModel.getByIdUser(id_user);
    const order = data.map(item => ({
      id: item.id,
      user: {
        id: item.id_user,
        username: item.user_username,
        email: item.user_email
      },
      menu: {
        id: item.id_menu,
        name: item.menu_name,
        description: item.menu_description,
        price: item.menu_price,
        upload_menu: item.menu_upload_menu,
        category: {
          id: item.idKategori,
          name: item.category_name,
          description: item.category_description
        }
      },
      qty: item.qty,
      total_price: item.total_price
    }));
    res.json(requestResponse.suksesWithData(order));
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error));
  }
}

const updateOne = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    await orderModel.updateOne(id, body);
    res.json(requestResponse.successUpdateData(body));
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error));
  }
}

const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    await orderModel.deleteOne(id);
    res.json(requestResponse.successDeleteData());
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error));
  }
}

export default {
  create,
  getAll,
  // getById,
  getByIdUser,
  updateOne,
  deleteOne
}
