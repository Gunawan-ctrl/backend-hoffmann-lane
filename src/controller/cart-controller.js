import cartModel from "../models/cart-model.js";
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
      return res.status(403).json(requestResponse.errorResponse('User does not have permission to create cart'));
    }

    // Periksa apakah cart sudah ada
    const [existingCart] = await dbPool.execute('SELECT * FROM carts WHERE id_user = ? AND id_menu = ?', [body.id_user, body.id_menu]);
    if (existingCart.length > 0) {
      // Jika cart sudah ada, tambahkan qty
      const newQty = existingCart[0].qty + body.qty;
      await dbPool.execute('UPDATE carts SET qty = ?, total_price = ? WHERE id = ?', [newQty, existingCart[0].total_price + body.total_price, existingCart[0].id]);
      return res.status(200).json(requestResponse.successUpdateData({ ...existingCart[0], qty: newQty, total_price: existingCart[0].total_price + body.total_price }));
    }

    // Buat cart baru dengan qty 1 jika belum ada
    body.qty = 1;
    const data = await cartModel.create(body);
    res.status(201).json(requestResponse.successCreateData(body));
  } catch (error) {
    console.log('cart', error);
    res.status(500).json(requestResponse.errorServer(error));
  }
}

const getAll = async (req, res) => {
  try {
    const data = await cartModel.getAll();
    const cart = data.map(item => ({
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
    res.json(requestResponse.suksesWithData(cart));
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error));
  }
}

const getByIdUser = async (req, res) => {
  const { id_user } = req.params;
  try {
    const data = await cartModel.getByIdUser(id_user);
    const cart = data.map(item => ({
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
    res.json(requestResponse.suksesWithData(cart));
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error));
  }
}

const updateOne = async (req, res) => {
  const { id } = req.params
  const { body } = req
  try {
    await cartModel.updateOne(id, body);
    res.status(201).json(requestResponse.successUpdateData(body))
  }
  catch (error) {
    res.status(500).json(requestResponse.errorServer(error))
  }
}

const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    await cartModel.deleteOne(id);
    res.json(requestResponse.successDeleteData())
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error))
  }
}

export default {
  create,
  getAll,
  getByIdUser,
  updateOne,
  deleteOne,
}