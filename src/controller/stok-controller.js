import requestResponse from '../config/response.js';
import StokModel from '../models/stok-model.js';

const getAll = async (req, res) => {
  try {
    const data = await StokModel.getAll();
    res.json(requestResponse.suksesWithData(data))
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error))
  }
}

// getbyid
const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await StokModel.getById(id);
    res.json(requestResponse.suksesWithData(data))
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error))
  }
}

// create
const create = async (req, res) => {
  const { body } = req;
  try {
    await StokModel.create(body);
    res.status(201).json(requestResponse.successCreateData(body))
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error))
  }
}

const updateOne = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    await StokModel.updateOne(body, id);
    res.json(requestResponse.successUpdateData(body))
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error))
  }
}

const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    await StokModel.deleteOne(id);
    res.json(requestResponse.successDeleteData())
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error))
  }
}

export default {
  create,
  getAll,
  getById,
  updateOne,
  deleteOne,
}