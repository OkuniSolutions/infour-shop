const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { 
    authMiddleware,
    validateRequiredFields,
    validateId
} = require('../middleware');

/**
    * @route   GET /api/wishlist
    * @desc    Obtener wishlist del usuario autenticado
    * @access  Private
    */
router.get('/',
    authMiddleware,
    wishlistController.getMyWishlist
);

/**
    * @route   POST /api/wishlist
    * @desc    Agregar producto a wishlist
    * @access  Private
    * @body    product_id
    */
router.post('/',
    authMiddleware,
    validateRequiredFields(['product_id']),
    wishlistController.addToWishlist
);

/**
    * @route   DELETE /api/wishlist/:product_id
    * @desc    Eliminar producto de wishlist
    * @access  Private
    */
router.delete('/:product_id',
    authMiddleware,
    validateId('product_id'),
    wishlistController.removeFromWishlist
);

/**
    * @route   DELETE /api/wishlist
    * @desc    Limpiar toda la wishlist
    * @access  Private
    */
router.delete('/',
    authMiddleware,
    wishlistController.clearWishlist
);

module.exports = router;