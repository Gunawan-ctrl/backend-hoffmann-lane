const requestResponse = {
  successLogin: (data) => ({
    code: 200,
    status: true,
    message: "Berhasil Login",
    data: {
      username: data.username,
      email: data.email,
      role: data.role,
      token: data.token
    }
  }),

  successCreateData: (data) => ({
    code: 201,
    status: true,
    message: "Berhasil menambahkan data",
    data: data
  }),

  successUpdateData: (data) => ({
    code: 201,
    status: true,
    message: "Berhasil mengupdate data",
    data,
  }),

  successDeleteData: () => ({
    code: 200,
    status: true,
    message: "Berhasil menghapus data"
  }),

  suksesWithData: (data) => ({
    code: 200,
    status: true,
    message: "Berhasil Memuat Data",
    data,
  }),

  errorResponse: (message) => ({
    code: 400,
    status: false,
    message,
  }),

  errorServer: (serverMessage) => ({
    code: 500,
    status: false,
    message: "Terjadi kesalahan pada server",
    serverMessage,
  }),
};

export default requestResponse;
