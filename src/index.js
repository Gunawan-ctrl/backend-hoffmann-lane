import { configDotenv } from 'dotenv';
import express from 'express';
import middlewareLogRequest from './middleware/logs.js';
import indexRoutes from './routes/index-routes.js';
import cors from 'cors';

configDotenv();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(middlewareLogRequest);

app.use(cors());

app.use(express.json());

app.use('/assets', express.static('src/assets'));

app.use(indexRoutes);

app.use((err, req, res, next) => {
  res.json({
    message: err.message
  })
})

app.listen(PORT, () => {
  console.log(`Server berhasil di running di port ${PORT}`);
})

// tetst