import dbPool from '../config/database.js';

const findUserByUsernameOrEmail = async (identifier) => {
  const SQLQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
  const [rows] = await dbPool.execute(SQLQuery, [identifier, identifier]);
  return rows[0];
};

const createUser = async (userData) => {
  const SQLQuery = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
  const [result] = await dbPool.execute(SQLQuery, [
    userData.username,
    userData.email,
    userData.password, // hashed password
    userData.role || 'user',
  ]);
  return result;
};

const getAllUsers = async () => {
  const SQLQuery = 'SELECT * FROM users';
  const [rows] = await dbPool.execute(SQLQuery);
  return rows;
}

const findUserByEmail = async (email) => {
  const SQLQuery = 'SELECT * FROM users WHERE email = ?';
  const [rows] = await dbPool.execute(SQLQuery, [email]);
  return rows[0];
}

const resetPassword = async (email, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const SQLQuery = 'UPDATE users SET password = ? WHERE email = ?';
  const [result] = await dbPool.execute(SQLQuery, [hashedPassword, email]);
  return result;
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await UsersModel.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate JWT token
    const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '1h' });
    const link = `${process.env.BASE_URL}/users/reset-password/${token}`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Reset Password',
      html: `<p>Klik <a href="${link}">link ini</a> untuk reset password</p>`,
    };

    // Kirim email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Link reset password telah dikirim ke email Anda' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error });
  }
};

const getById = async (id) => {
  const SQLQuery = 'SELECT * FROM users WHERE id = ?';
  const [rows] = await dbPool.execute(SQLQuery, [id]);
  return rows[0];
}

const updateUser = async (body, id) => {
  const SQLQuery = `UPDATE users SET username = ?, email = ? WHERE id = ?`;
  const [result] = await dbPool.execute(SQLQuery, [body.username, body.email, id]);
  return result;
}

const deleteUser = async (id) => {
  const SQLQuery = `DELETE FROM users WHERE id = ?`;
  const [result] = await dbPool.execute(SQLQuery, [id]);
  return result;
}

export default {
  findUserByUsernameOrEmail,
  findUserByEmail,
  resetPassword,
  forgetPassword,
  createUser,
  getAllUsers,
  getById,
  updateUser,
  deleteUser,
}