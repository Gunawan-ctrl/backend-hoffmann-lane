import express from 'express';
import MenuRoutes from './menu-routes.js';
import KategoriRoutes from './kategori-routes.js';
import StokRoutes from './stok-routes.js';
import UsersRoutes from './users-routes.js';
import CartRoutes from './cart-routes.js';
import OrderRoutes from './order-routes.js';
import TransactionRoutes from './transaction-routes.js';
import OrderMenuRoutes from './order-menu-routes.js';
import QrCodeRoutes from './qrcode-routes.js';

const router = express.Router();

router.use('/api/v1/transaction', TransactionRoutes);
router.use('/api/v1/order', OrderRoutes);
router.use('/api/v1/order-menu', OrderMenuRoutes);
router.use('/api/v1/cart', CartRoutes);
router.use('/api/v1/menu', MenuRoutes);
router.use('/api/v1/category', KategoriRoutes);
router.use('/api/v1/stok', StokRoutes);
router.use('/api/v1/users', UsersRoutes);
router.use('/api/v1/qrcode', QrCodeRoutes);

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Hoffmane-Lane API'
  })
})

export default router;