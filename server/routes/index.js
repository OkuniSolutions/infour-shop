const express = require('express');
const router = express.Router();

/**
 * Importar todas las rutas
 */
const authRoutes = require('./auth.routes');
const categoryRoutes = require('./category.routes');
const productRoutes = require('./product.routes');
const userRoutes = require('./user.routes');
const wishlistRoutes = require('./wishlist.routes');
const saleRoutes = require('./sale.routes');
const searchRoutes = require('./search.routes');

/**
 * Montar rutas con sus prefijos
 */
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/users', userRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/sales', saleRoutes);
router.use('/search', searchRoutes);

/**
 * Ruta de información de la API
 */
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API E-commerce v1.0',
        endpoints: {
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            users: '/api/users',
            wishlist: '/api/wishlist',
            sales: '/api/sales',
            search: '/api/search'
        },
        documentation: 'https://github.com/tu-usuario/ecommerce-app'
    });
});

module.exports = router;