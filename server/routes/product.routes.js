const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { 
    authMiddleware,
    isAdminOrCreator,
    uploadSingle,
    handleUploadError,
    validateRequiredFields,
    validateProduct,
    validateId,
    optionalAuth
} = require('../middleware');

/**
    * @route   GET /api/products
    * @desc    Obtener todos los productos
    * @access  Public
    * @query   page, limit, category_id, is_active, min_price, max_price, search
    */
router.get('/',
    productController.getAll
);

/**
    * @route   GET /api/products/:id
    * @desc    Obtener producto por ID
    * @access  Public
    */
router.get('/:id',
    validateId('id'),
    productController.getById
);

/**
    * @route   POST /api/products
    * @desc    Crear nuevo producto
    * @access  Private (Admin o Content Creator)
    * @body    name, description, price, stock, category_id, image (file)
    */
router.post('/',
    authMiddleware,
    isAdminOrCreator,
    uploadSingle,
    handleUploadError,
    validateProduct,
    productController.create
);

/**
    * @route   PUT /api/products/:id
    * @desc    Actualizar producto
    * @access  Private (Admin o creador del producto)
    */
router.put('/:id',
    authMiddleware,
    isAdminOrCreator,
    validateId('id'),
    uploadSingle,
    handleUploadError,
    productController.update
);

/**
    * @route   DELETE /api/products/:id
    * @desc    Eliminar producto
    * @access  Private (Admin o creador del producto)
    */
router.delete('/:id',
    authMiddleware,
    isAdminOrCreator,
    validateId('id'),
    productController.delete
);

module.exports = router;