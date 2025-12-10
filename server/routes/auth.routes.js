const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { 
    authMiddleware,
    validateRequiredFields,
    validateEmail,
    validatePassword
} = require('../middleware');

/**
    * @route   POST /api/auth/register
    * @desc    Registrar nuevo usuario
    * @access  Public
    */
router.post('/register',
    validateRequiredFields(['email', 'password', 'first_name', 'last_name']),
    validateEmail,
    validatePassword,
    authController.register
);

/**
    * @route   POST /api/auth/login
    * @desc    Iniciar sesión
    * @access  Public
    */
router.post('/login',
    validateRequiredFields(['email', 'password']),
    validateEmail,
    authController.login
);

/**
    * @route   GET /api/auth/me
    * @desc    Obtener perfil del usuario autenticado
    * @access  Private
    */
router.get('/me',
    authMiddleware,
    authController.getProfile
);

/**
    * @route   PUT /api/auth/me
    * @desc    Actualizar perfil del usuario autenticado
    * @access  Private
    */
router.put('/me',
    authMiddleware,
    authController.updateProfile
);

/**
    * @route   PUT /api/auth/change-password
    * @desc    Cambiar contraseña
    * @access  Private
    */
router.put('/change-password',
    authMiddleware,
    validateRequiredFields(['currentPassword', 'newPassword']),
    authController.changePassword
);

module.exports = router;