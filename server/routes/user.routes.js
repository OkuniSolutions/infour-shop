const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { 
    authMiddleware,
    isAdmin,
    isOwnerOrAdmin,
    validateRequiredFields,
    validateEmail,
    validatePassword,
    validateId
} = require('../middleware');

/**
    * @route   GET /api/users
    * @desc    Obtener todos los usuarios
    * @access  Private (Admin)
    * @query   page, limit, role, is_active, search
    */
router.get('/',
    authMiddleware,
    isAdmin,
    userController.getAll
);

/**
    * @route   GET /api/users/:id
    * @desc    Obtener usuario por ID
    * @access  Private (Admin o el mismo usuario)
    */
router.get('/:id',
    authMiddleware,
    isOwnerOrAdmin,
    validateId('id'),
    userController.getById
);

/**
    * @route   POST /api/users
    * @desc    Crear nuevo usuario
    * @access  Private (Admin)
    */
router.post('/',
    authMiddleware,
    isAdmin,
    validateRequiredFields(['email', 'password', 'first_name', 'last_name']),
    validateEmail,
    validatePassword,
    userController.create
);

/**
    * @route   PUT /api/users/:id
    * @desc    Actualizar usuario
    * @access  Private (Admin)
    */
router.put('/:id',
    authMiddleware,
    isAdmin,
    validateId('id'),
    userController.update
);

/**
    * @route   DELETE /api/users/:id
    * @desc    Eliminar usuario
    * @access  Private (Admin)
    */
router.delete('/:id',
    authMiddleware,
    isAdmin,
    validateId('id'),
    userController.delete
);

module.exports = router;