const db = require('../models');
const { Op } = require('sequelize');

/**
 * Búsqueda general de productos
 */
exports.search = async (req, res) => {
    try {
        const { 
            q,
            category_id,
            min_price,
            max_price,
            in_stock = true,
            page = 1,
            limit = 20
        } = req.query;

        if (!q || q.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Debes proporcionar un término de búsqueda'
            });
        }

        const offset = (page - 1) * limit;
        const where = {
            is_active: true,
            [Op.or]: [
                { name: { [Op.like]: `%${q}%` } },
                { description: { [Op.like]: `%${q}%` } }
            ]
        };

        if (category_id) {
            where.category_id = category_id;
        }

        if (in_stock === 'true') {
            where.stock = { [Op.gt]: 0 };
        }

        if (min_price || max_price) {
            where.price = {};
            if (min_price) where.price[Op.gte] = parseFloat(min_price);
            if (max_price) where.price[Op.lte] = parseFloat(max_price);
        }

        const { count, rows: products } = await db.Product.findAndCountAll({
            where,
            include: [
                {
                    model: db.Category,
                    as: 'category',
                    attributes: ['id', 'name']
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['name', 'ASC']]
        });

        res.json({
            success: true,
            data: {
                query: q,
                products,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            }
        });

    } catch (error) {
        console.error('Ups:', error);
        res.status(500).json({
            success: false,
            error: 'Error al realizar búsqueda'
        });
    }
};