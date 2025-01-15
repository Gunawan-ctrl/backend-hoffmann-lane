import transactionModel from '../models/transaction-model.js';
import requestResponse from '../config/response.js';
import midtransClient from 'midtrans-client';
import { config as configDotenv } from 'dotenv';

configDotenv();

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const createTransaction = async (req, res) => {
  const { id_user, id_order, total_price, id_menu } = req.body;
  const gross_amount = total_price;

  // Check if required fields are present
  if (!gross_amount || !id_user || !id_order || !id_menu) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Create transaction in the database
    const result = await transactionModel.createTransaction({
      gross_amount,
      payment_type: null, // Example payment type
      transaction_time: new Date(),
      transaction_status: 'pending',
      id_user,
      id_order,
      id_menu,
    });

    // Fetch the newly created transaction
    const newTransaction = await transactionModel.getTransactionById(result.insertId);

    // Create Snap token
    const parameter = {
      transaction_details: {
        order_id: newTransaction.transaction_id,
        gross_amount: newTransaction.gross_amount,
      },
      credit_card: {
        secure: true,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    res.json(requestResponse.successCreateData({
      transaction: newTransaction,
      snapToken: transaction.token,
    }));
  } catch (error) {
    console.log('error', error);
    res.status(500).json(requestResponse.errorServer(error));
  }
};

const getAll = async (req, res) => {
  try {
    const data = await transactionModel.getAll();
    const transactions = data.map((item) => ({
      id: item.id,
      transaction_id: item.transaction_id,
      gross_amount: item.gross_amount,
      payment_type: item.payment_type,
      transaction_time: item.transaction_time,
      transaction_status: item.transaction_status,
      user: {
        id: item.id_user,
        username: item.user_username,
        email: item.user_email,
      },
      order: {
        id: item.id_order,
        qty: item.order_qty,
        total_price: item.order_total_price,
      },
      menu: {
        id: item.id_menu,
        name: item.menu_name,
      }
    }));
    res.json(requestResponse.suksesWithData(transactions));
  }
  catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json(requestResponse.errorServer(error));
  }
}

const getTransactionByIdUser = async (req, res) => {
  const { id_user } = req.params;
  try {
    const data = await transactionModel.getTransactionByIdUser(id_user);
    const transactions = data.map((item) => ({
      id: item.id,
      transaction_id: item.transaction_id,
      gross_amount: item.gross_amount,
      payment_type: item.payment_type,
      transaction_time: item.transaction_time,
      transaction_status: item.transaction_status,
      user: {
        id: item.id_user,
        username: item.user_username,
        email: item.user_email,
      },
      order: {
        id: item.id_order,
        qty: item.order_qty,
        total_price: item.order_total_price,
      },
    }));
    res.json(requestResponse.suksesWithData(transactions));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json(requestResponse.errorServer(error));
  }
};

const updateTransaction = async (req, res) => {
  const { transaction_id } = req.params;
  const { body } = req;

  try {
    await transactionModel.updateTransaction(transaction_id, body);
    const updatedTransaction = await transactionModel.getTransactionById(transaction_id);
    res.json(requestResponse.successUpdateData(updatedTransaction));
  }
  catch (error) {
    res.status(500).json(requestResponse.errorServer(error));
  }
}


export default {
  createTransaction,
  getAll,
  getTransactionByIdUser,
  updateTransaction,
};