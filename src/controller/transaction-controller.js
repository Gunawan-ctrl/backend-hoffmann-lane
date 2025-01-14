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

// const createTransaction = async (req, res) => {
//   const { body } = req;
//   try {
//     console.log('Creating transaction with data:', body);
//     await transactionModel.createTransaction(body);
//     res.json(requestResponse.successCreateData(body));
//   } catch (error) {
//     console.error('Error creating transaction:', error);
//     res.status(500).json(requestResponse.errorServer(error));
//   }
// };

const createTransaction = async (req, res) => {
  const { body } = req;
  try {
    console.log('Creating transaction with data:', body);
    await transactionModel.createTransaction(body);

    // Fetch the newly created transaction
    const newTransaction = await transactionModel.getTransactionById(body.transaction_id);

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
    console.log('newTransaction', newTransaction);
    console.log('Snap Token', transaction.token);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json(requestResponse.errorServer(error));
  }
};

const getAll = async (req, res) => {
  try {
    const data = await transactionModel.getAll();
    console.log('Fetched transactions:', data);
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

const getSnapToken = async (req, res) => {
  const { id_order, total_price } = req.body;
  try {
    const parameter = {
      transaction_details: {
        order_id: id_order,
        gross_amount: total_price,
      },
      credit_card: {
        secure: true,
      },
    };
    const transaction = await snap.createTransaction(parameter);
    res.json(requestResponse.suksesWithData(transaction));
    console.log('transaction', transaction);
  } catch (error) {
    console.error('Error creating Snap token:', error);
    res.status(500).json(requestResponse.errorServer(error));
  }
};

export default {
  createTransaction,
  getAll,
  getTransactionByIdUser,
  getSnapToken,
};