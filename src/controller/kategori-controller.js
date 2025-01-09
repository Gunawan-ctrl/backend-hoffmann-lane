import KategoriModel from '../models/kategori-model.js';
import requestResponse from '../config/response.js';

const getAll = async (req, res) => {
  try {
    const data = await KategoriModel.getAll();
    res.json(requestResponse.suksesWithData(data))
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error))
  }
}

// getbyid
const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await KategoriModel.getById(id);
    res.json(requestResponse.suksesWithData(data))
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error))
  }
}

// create
const create = async (req, res) => {
  const { body } = req;
  try {
    await KategoriModel.create(body);
    res.status(201).json(requestResponse.successCreateData(body))
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error))
  }
}

const updateOne = async (req, res) => {
  const { id } = req.params
  const { body } = req
  try {
    await KategoriModel.updateOne(body, id);
    res.status(201).json(requestResponse.successUpdateData(body))
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error))
  }
}

const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    await KategoriModel.deleteOne(id);
    res.json(requestResponse.successDeleteData())
  } catch (error) {
    res.status(500).json(requestResponse.successDeleteData())
  }
}

export default {
  create,
  getAll,
  getById,
  updateOne,
  deleteOne,
}