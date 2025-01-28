import requestResponse from '../config/response.js';
import ReservationModel from '../models/reservation-model.js';

const getAll = async (req, res) => {
  try {
    const data = await ReservationModel.getAll();
    res.json(requestResponse.suksesWithData(data))
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error))
  }
}

// getbyid
const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await ReservationModel.getById(id);
    res.json(requestResponse.suksesWithData(data))
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error))
  }
}

// create
const create = async (req, res) => {
  const { body } = req;
  try {
    await ReservationModel.create(body);
    res.status(201).json(requestResponse.successCreateData(body))
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error))
  }
}

const updateOne = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    await ReservationModel.updateOne(body, id);
    res.json(requestResponse.successUpdateData(body))
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error))
  }
}

const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    await ReservationModel.deleteOne(id);
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