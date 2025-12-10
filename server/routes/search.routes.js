const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

/**
    * @route   GET /api/search
    * @desc    Buscar productos
    * @access  Public
    * @query   q (término de búsqueda), category_id, min_price, max_price, in_stock, page, limit
    */
router.get('/',
    searchController.search
);

module.exports = router;