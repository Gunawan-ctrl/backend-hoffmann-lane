const statusMiddleware = (req, res, next) => {
  if (req.body.status !== undefined) {
    req.body.status = req.body.status === true ? 1 : 0;
  }
  next();
};

export default statusMiddleware;