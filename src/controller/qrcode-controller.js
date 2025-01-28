import qrCodeModel from "../models/qrcode-model.js";
import requestResponse from "../config/response.js";
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config as configDotenv } from 'dotenv';

configDotenv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createQrCode = async (req, res) => {
  const { table } = req.body;
  try {
    // Get baseURL from environment variable
    let baseURL = process.env.BASE_URL;
    if (req.hostname !== 'localhost') {
      baseURL = `http://${req.hostname}`;
    }

    // Generate QR code link
    const qrCodeLink = `${baseURL}/menu?meja=${table}`;
    const qrCodeFileName = `qrcode_${table}.png`;
    const qrCodeFilePath = path.join(__dirname, '..', 'assets', 'code', qrCodeFileName);

    // Generate QR code image
    await QRCode.toFile(qrCodeFilePath, qrCodeLink);

    // Save QR code data to the database
    const result = await qrCodeModel.create({ table, imageQr: qrCodeFileName });

    res.json(requestResponse.successCreateData({ table, imageQr: qrCodeFileName }));
  } catch (error) {
    console.log('error', error);
    res.status(500).json(requestResponse.errorServer(error));
  }
}

const getAll = async (req, res) => {
  try {
    const data = await qrCodeModel.getAll();
    res.json(requestResponse.suksesWithData(data));
  } catch (error) {
    console.log('error', error);
    res.status(500).json(requestResponse.errorServer(error));
  }
}

const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    // Get QR code details by ID
    const qrCode = await qrCodeModel.getById(id);
    if (!qrCode) {
      return res.status(404).json(requestResponse.errorNotFound());
    }

    // Normalize the path to ensure it is valid
    const qrCodeFilePath = path.join(__dirname, '..', 'assets', 'code', qrCode.imageQr);

    // Delete QR code image file
    fs.unlink(qrCodeFilePath, (err) => {
      if (err) {
        console.log('error', err);
        return res.status(500).json(requestResponse.errorServer(err));
      }
    });

    // Delete QR code entry from database
    const data = await qrCodeModel.deleteOne(id);
    if (data.affectedRows > 0) {
      res.json(requestResponse.successDeleteData());
    } else {
      res.json(requestResponse.errorNotFound());
    }
  } catch (error) {
    console.log('error', error);
    res.status(500).json(requestResponse.errorServer(error));
  }
}

export default { createQrCode, getAll, deleteOne };