import orderModel from "../models/order-model.js";
import orderMenuModel from "../models/order-menu-model.js";
import requestResponse from "../config/response.js";
import midtransClient from 'midtrans-client';
import { config as configDotenv } from 'dotenv';

configDotenv();

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});


const createOrder = async (req, res) => {
  const { gross_amount, order_status, qty, table, id_order, items } = req.body;
  try {
    // Create order in the database
    const result = await orderModel.create({
      gross_amount,
      order_time: new Date(),
      order_status,
      qty,
      table
    });

    const order_id = result[0].insertId;

    // Create order menu items in the database
    for (const item of items) {
      await orderMenuModel.create({
        id_menu: item.id_menu,
        id_order: order_id,
        qty: item.qty,
        total: item.total
      });
    }

    const parameter = {
      transaction_details: {
        order_id,
        gross_amount,
      },
      credit_card: {
        secure: true,
      },
    };

    const order = await snap.createTransaction(parameter);
    res.json(requestResponse.successCreateData({
      order: {
        id_order: order_id,
        gross_amount,
        order_status,
        qty,
        table,
        items
      },
      snapToken: order.token,
    }));
  } catch (error) {
    console.log('error', error);
    res.status(500).json(requestResponse.errorServer(error));
  }
}

const getAll = async (req, res) => {
  try {
    const data = await orderModel.getAll();
    const order = data.map(item => ({
      id: item.id,
      order_status: item.order_status,
      order_time: item.order_time,
      qty: item.qty,
      gross_amount: item.gross_amount,
      table: item.table,
    }));
    res.json(requestResponse.suksesWithData(order));
  } catch (error) {
    console.log('error', error);
    res.status(500).json(requestResponse.errorServer(error));
  }
}

const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await orderModel.getById(id);
    const order = {
      id: data.id,
      order_status: data.order_status,
      order_time: data.order_time,
      qty: data.qty,
      gross_amount: data.gross_amount,
      table: data.table,
      items: data.items
    };
    res.json(requestResponse.suksesWithData(order));
  } catch (error) {
    console.log('error', error);
    res.status(500).json(requestResponse.errorServer(error));
  }
}

const updateOne = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  console.log('req.body', req.body);
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
  createOrder,
  getById,
  getAll,
  updateOne,
  deleteOne
}
