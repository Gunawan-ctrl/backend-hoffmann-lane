import MenuModel from '../models/menu-model.js';
import requestResponse from '../config/response.js';

const getAll = async (req, res) => {
  try {
    const data = await MenuModel.getAll();
    const getMenu = data.map(item =>
    ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      upload_menu: item.upload_menu,
      status: item.status === 1 ? true : false,
      category: {
        idKategori: item.idKategori,
        name: item.category_name,
        description: item.category_description,
      }
    }));
    res.json(requestResponse.suksesWithData(getMenu));
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error));
  }
}

const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await MenuModel.getById(id);
    const getMenu = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      upload_menu: data.upload_menu,
      status: data.status === 1 ? true : false,
      category: {
        idKategori: data.idKategori,
        name: data.category_name,
        description: data.category_description,
      }
    };
    res.json(requestResponse.suksesWithData(getMenu));
  } catch (error) {
    console.log('error', error);
    res.status(500).json(requestResponse.errorServer(error));
  }
}

const getByIdKategori = async (req, res) => {
  const { idKategori } = req.params;
  try {
    const data = await MenuModel.getByIdKategori(idKategori);
    const getMenu = data.map(item =>
    ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      upload_menu: item.upload_menu,
      status: item.status === 1 ? true : false,
      category: {
        idKategori: item.idKategori,
        name: item.category_name,
        description: item.category_description,
      }
    }));
    res.json(requestResponse.suksesWithData(getMenu));
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error));
  }
}

// getbystatus
const getByStatus = async (req, res) => {
  const { status } = req.params;
  try {
    const data = await MenuModel.getByStatus(status);
    const dataStatus = data.map(item =>
    // console.log('item', item)
    ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      upload_menu: item.upload_menu,
      status: item.status === 1 ? true : false,
      category: {
        idKategori: item.idKategori,
        name: item.category_name,
        description: item.category_description,
      }
    }));
    res.json(requestResponse.suksesWithData(dataStatus));
  } catch (error) {
    console.log('error', error);
    res.status(500).json(requestResponse.errorServer(error));
  }
}

const create = async (req, res) => {
  const { body } = req;
  try {
    const upload_menu = req.file ? req.file.filename : null;
    if (!upload_menu) {
      return res.status(400).json(requestResponse.errorResponse('Upload menu tidak boleh kosong'));
    }
    body.upload_menu = upload_menu;
    const data = await MenuModel.create(body);
    res.status(201).json(requestResponse.successCreateData(body));
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error));
  }
};

// update status menu
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    await MenuModel.updateStatus(body, id);
    res.status(201).json(requestResponse.successUpdateData(body));
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error));
  }
}

const updateOne = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  console.log('body', body);
  try {
    let upload_menu = req.file ? req.file.filename : null;
    let status = body.status == true ? 1 : 0;

    // Jika tidak ada file baru yang diunggah, ambil upload_menu sebelumnya dari database
    if (!upload_menu) {
      const existingMenu = await MenuModel.getById(id);
      upload_menu = existingMenu.upload_menu;
    }
    // Tambahkan upload_menu ke body
    body.upload_menu = upload_menu;
    body.status = status;
    await MenuModel.updateOne(body, id);
    res.status(201).json(requestResponse.successUpdateData(body));
  } catch (error) {
    console.log('error', error);
    res.status(500).json(requestResponse.errorServer(error));
  }
}

const deleteOne = async (req, res) => {
  const { id } = req.params;
  try {
    await MenuModel.deleteOne(id);
    res.json(requestResponse.successDeleteData());
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error));
  }
}

export default {
  create,
  getAll,
  getById,
  getByIdKategori,
  getByStatus,
  updateStatus,
  updateOne,
  deleteOne,
}