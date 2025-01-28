import orderModel from "../models/order-model.js";
import requestResponse from "../config/response.js";
import midtransClient from 'midtrans-client';
import { config as configDotenv } from 'dotenv';

configDotenv();

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// const createOrder = async (req, res) => {
//   const { id_user, id_menu, id_order, total_price, no_telp, qty, alamat, table } = req.body;
//   const gross_amount = total_price;
//   console.log('req.body', req.body);
//   try {
//     // Check if required fields are present
//     if (!gross_amount || !id_user || !id_menu) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     // Create transaction in the database
//     const result = await orderModel.create({
//       order_id: id_order,
//       gross_amount,
//       order_time: new Date(),
//       order_status: 'PENDING',
//       id_user,
//       id_menu: id_menu[0],
//       id_order: id_order[0],
//       no_telp,
//       qty,
//       no_telp,
//       alamat,
//       table,
//     });

//     const order_id = result[0].insertId;
//     const newOrder = await orderModel.getById(order_id);

//     // Create Snap token
//     const parameter = {
//       transaction_details: {
//         order_id: newOrder.id,
//         gross_amount: newOrder.gross_amount,
//       },
//       credit_card: {
//         secure: true,
//       },
//     };

//     const order = await snap.createTransaction(parameter)

//     res.json(requestResponse.successCreateData({
//       order: newOrder,
//       snapToken: order.token,
//     }));
//   } catch (error) {
//     console.log('order', error);
//     res.status(500).json(requestResponse.errorServer(error));
//   }
// }
const createOrder = async (req, res) => {
  const { id_order, gross_amount, order_status, qty, table } = req.body;
  console.log('req.body', req.body);
  try {
    // Check if required fields are present
    if (!id_order || !gross_amount || !order_status || !qty || !table) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create transaction in the database
    const result = await orderModel.create({
      id_order,
      gross_amount,
      order_time: new Date(),
      order_status,
      qty,
      table,
    });

    const order_id = result[0].insertId;
    const newOrder = await orderModel.getById(order_id);

    // Create Snap token
    const parameter = {
      transaction_details: {
        order_id: newOrder.id,
        gross_amount: newOrder.gross_amount,
      },
      credit_card: {
        secure: true,
      },
    };

    const order = await snap.createTransaction(parameter);

    res.json(requestResponse.successCreateData({
      order: newOrder,
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
      // user: {
      //   id: item.id_user,
      //   username: item.user_username,
      //   email: item.user_email
      // },
      // menu: {
      //   id: item.id_menu,
      //   name: item.menu_name,
      //   description: item.menu_description,
      //   price: item.menu_price,
      //   upload_menu: item.menu_upload_menu,
      // },
      order: {
        // id: item.id_order,
        id_order: item.id_order,
        order_status: item.order_status,
        order_time: item.order_time,
      },
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
  getAll,
  updateOne,
  deleteOne
}
