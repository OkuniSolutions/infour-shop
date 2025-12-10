const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { 
    authMiddleware,
    isAdmin,
    validateRequiredFields,
    validateId
} = require('../middleware');

/**
    * @route   GET /api/categories
    * @desc    Obtener todas las categorías
    * @access  Public
    */
router.get('/',
    categoryController.getAll
);

/**
    * @route   GET /api/categories/:id
    * @desc    Obtener categoría por ID
    * @access  Public
    */
router.get('/:id',
    validateId('id'),
    categoryController.getById
);

/**
    * @route   POST /api/categories
    * @desc    Crear nueva categoría
    * @access  Private (Admin)
    */
router.post('/',
    authMiddleware,
    isAdmin,
    validateRequiredFields(['name']),
    categoryController.create
);

/**
    * @route   PUT /api/categories/:id
    * @desc    Actualizar categoría
    * @access  Private (Admin)
    */
router.put('/:id',
    authMiddleware,
    isAdmin,
    validateId('id'),
    categoryController.update
);

/**
    * @route   DELETE /api/categories/:id
    * @desc    Eliminar categoría
    * @access  Private (Admin)
    */
router.delete('/:id',
    authMiddleware,
    isAdmin,
    validateId('id'),
    categoryController.delete
);

module.exports = router;