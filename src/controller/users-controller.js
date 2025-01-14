import UsersModel from '../models/users-model.js';
import requestResponse from '../config/response.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await UsersModel.createUser({
      username,
      email,
      password: hashedPassword,
      role: role || 2,
    });

    res.status(201).json(requestResponse.successCreateData(req.body));
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error));
  }
};

const login = async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ message: 'Username/Email and password are required' });
  }

  try {
    const user = await UsersModel.findUserByUsernameOrEmail(identifier);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Sertakan id_user dalam respons login
    res.status(200).json(requestResponse.successLogin({ ...user, id_user: user.id }));
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error));
  }
};


const getAllUsers = async (req, res) => {
  try {
    const data = await UsersModel.getAllUsers();
    res.json(requestResponse.suksesWithData(data))
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error))
  }
}

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const data = await UsersModel.updateUser(body, id);
    res.json(requestResponse.successCreateData(body))
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error))
  }
}

const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await UsersModel.getById(id);
    res.json(requestResponse.suksesWithData(data))
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error))
  }
}

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await UsersModel.deleteUser(id);
    res.json(requestResponse.successDeleteData())
  } catch (error) {
    res.status(500).json(requestResponse.errorServer(error))
  }
}

export default {
  register,
  login,
  getAllUsers,
  getById,
  updateUser,
  deleteUser,
}