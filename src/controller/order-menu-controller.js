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

const create = async (req, res) => {
  const { body } = req;
  console.log("body", body);
  try {
    await orderMenuModel.create(body);
    res.json(requestResponse.successCreateData(body));
  } catch (error) {
    console.log('error', error);
    res.status(500).json(requestResponse.errorServer(error));
  }
}


const getAll = async (req, res) => {
  try {
    const data = await orderMenuModel.getAll();
    res.json(requestResponse.suksesWithData(data));
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
    await orderMenuModel.updateOne(id, body);
    res.json(requestResponse.successUpdateData(body));
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error));
  }
}

const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    await orderMenuModel.deleteOne(id);
    res.json(requestResponse.successDeleteData());
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error));
  }
}

export default {
  create,
  getAll,
  updateOne,
  deleteOne
}
