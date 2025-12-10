const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const { 
    authMiddleware,
    isAdmin,
    validateRequiredFields,
    validateId
} = require('../middleware');

/**
    * @route   GET /api/sales/stats
    * @desc    Obtener estadísticas de ventas
    * @access  Private (Admin)
    */
router.get('/stats',
    authMiddleware,
    isAdmin,
    saleController.getStats
);

/**
    * @route   GET /api/sales/my-sales
    * @desc    Obtener mis ventas
    * @access  Private
    */
router.get('/my-sales',
    authMiddleware,
    saleController.getMySales
);

/**
    * @route   GET /api/sales
    * @desc    Obtener todas las ventas
    * @access  Private (Admin)
    * @query   page, limit, status, user_id
    */
router.get('/',
    authMiddleware,
    isAdmin,
    saleController.getAll
);

/**
    * @route   GET /api/sales/:id
    * @desc    Obtener venta por ID
    * @access  Private (Admin o dueño de la venta)
    */
router.get('/:id',
    authMiddleware,
    validateId('id'),
    saleController.getById
);

/**
    * @route   POST /api/sales
    * @desc    Crear nueva venta
    * @access  Private
    * @body    items: [{ product_id, quantity }], shipping_address
    */
router.post('/',
    authMiddleware,
    validateRequiredFields(['items', 'shipping_address']),
    saleController.create
);

/**
    * @route   PUT /api/sales/:id/status
    * @desc    Actualizar estado de venta
    * @access  Private (Admin)
    * @body    status (pendiente, completado, cancelado)
    */
router.put('/:id/status',
    authMiddleware,
    isAdmin,
    validateId('id'),
    validateRequiredFields(['status']),
    saleController.updateStatus
);

module.exports = router;