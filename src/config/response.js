const requestResponse = {
  successLogin: (data) => ({
    status: true,
    message: "Berhasil Login",
    data,
  }),

  successCreateData: (data) => ({
    status: true,
    message: "Berhasil menambahkan data",
    data: data
  }),

  successUpdateData: (data) => ({
    status: true,
    message: "Berhasil mengupdate data",
    data,
  }),

  successDeleteData: () => ({
    status: true,
    message: "Berhasil menghapus data"
  }),

  suksesWithData: (data) => ({
    status: true,
    message: "Berhasil Memuat Data",
    data,
  }),

  errorResponse: (message) => ({
    status: false,
    message,
  }),

  errorServer: (serverMessage) => ({
    status: false,
    message: "Terjadi kesalahan pada server",
    serverMessage,
  }),
};

export default requestResponse;
