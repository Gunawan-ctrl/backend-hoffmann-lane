import orderModel from "../models/order-model.js";
import StokModel from "../models/stok-model.js";
import MenuModel from "../models/menu-model.js";
import ReservationModel from "../models/reservation-model.js";
import orderMenuModel from "../models/order-menu-model.js";
import requestResponse from "../config/response.js";
import midtransClient from 'midtrans-client';
import { config as configDotenv } from 'dotenv';
import menuModel from "../models/menu-model.js";

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
      order_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
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


const getTotal = async (req, res) => {
  try {
    const totalAmount = await orderModel.getTotalAmount();
    const stokData = await StokModel.getAll();
    const menuData = await MenuModel.getAll();
    const reservationData = await ReservationModel.getAll();

    const totalStok = stokData.length;
    const totalMenu = menuData.length
    const totalReservation = reservationData.length;

    const response = {
      transaction: {
        name: "Transaction",
        total: totalAmount
      },
      stok: {
        name: "Stok",
        total: totalStok
      },
      menu: {
        name: "Menu",
        total: totalMenu
      },
      reservation: {
        name: "Reservation",
        total: totalReservation
      }
    };

    res.json(requestResponse.suksesWithData(response));
  } catch (error) {
    console.log('error', error);
    res.status(500).json(requestResponse.errorServer(error));
  }
}

const getOrderSummary = async (req, res) => {
  try {
    const summaryData = await orderModel.getOrderSummaryByMonth();

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const summaryMap = {};
    summaryData.forEach(item => {
      summaryMap[item.month] = {
        total_orders: item.total_orders,
        total_amount: item.total_amount
      };
    });

    const response = {
      status: true,
      message: "Berhasil Memuat Data",
      data: months.map(month => ({
        month,
        total_orders: summaryMap[month]?.total_orders || 0,
        total_amount: summaryMap[month]?.total_amount || 0
      }))
    };

    res.json(response);
  } catch (error) {
    console.log('error', error);
    res.status(500).json(requestResponse.errorServer(error));
  }
};

const getMostOrderedItems = async (req, res) => {
  try {
    const data = await orderModel.getMostOrderedItems();
    const detailedData = await Promise.all(data.map(async (item) => {
      const menuDetails = await menuModel.getById(item.id_menu);
      if (menuDetails) {
        return {
          id_menu: item.id_menu,
          total_qty: item.total_qty,
          name: menuDetails.name,
          description: menuDetails.description,
          category: menuDetails.category_name
        };
      } else {
        return {
          id_menu: item.id_menu,
          total_qty: item.total_qty,
          name: "Unknown",
          description: "Unknown",
          category: "Unknown"
        };
      }
    }));

    // const response = {
    //   status: true,
    //   message: "Berhasil Memuat Data",
    //   data: detailedData
    // };
    res.json(requestResponse.suksesWithData(detailedData));
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
  getTotal,
  getMostOrderedItems,
  getOrderSummary,
  getAll,
  updateOne,
  deleteOne
}
