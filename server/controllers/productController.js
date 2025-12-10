const db = require('../models');
const { Op } = require('sequelize');
const path = require('path');

/**
    * Obtener todos los productos
    */
exports.getAll = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            category_id, 
            is_active = true,
            min_price,
            max_price,
            search
        } = req.query;

        const offset = (page - 1) * limit;

        // Filtros dinámicos
        const where = {};

        if (category_id) {
            where.category_id = category_id;
        }

        if (is_active !== undefined) {
            where.is_active = is_active === 'true';
        }

        if (min_price || max_price) {
            where.price = {};
            if (min_price) where.price[Op.gte] = parseFloat(min_price);
            if (max_price) where.price[Op.lte] = parseFloat(max_price);
        }

        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows: products } = await db.Product.findAndCountAll({
            where,
            include: [
                {
                    model: db.Category,
                    as: 'category',
                    attributes: ['id', 'name']
                },
                {
                    model: db.User,
                    as: 'creator',
                    attributes: ['id', 'first_name', 'last_name']
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: {
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
            error: 'Error al obtener productos'
        });
    }
};

/**
    * Obtener producto por ID
    */
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await db.Product.findByPk(id, {
            include: [
                {
                    model: db.Category,
                    as: 'category',
                    attributes: ['id', 'name']
                },
                {
                    model: db.User,
                    as: 'creator',
                    attributes: ['id', 'first_name', 'last_name', 'email']
                }
            ]
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Producto no encontrado'
            });
        }

        res.json({
            success: true,
            data: { product }
        });

    } catch (error) {
        console.error('Ups:', error);
            s.status(500).json({
            success: false,
            error: 'Error al obtener producto'
        });
    }
};

/**
    * Crear nuevo producto
    */
exports.create = async (req, res) => {
    try {
        const { name, description, price, stock, category_id, is_active } = req.body;

        // Construir URL de la imagen
        let image_url = null;
        if (req.file) {
            image_url = `/uploads/products/${req.file.filename}`;
        }

        const product = await db.Product.create({
            name,
            description,
            price,
            stock: stock || 0,
            category_id,
            is_active: is_active !== undefined ? is_active : true,
            image_url,
            created_by: req.user.id
        });

        await product.reload({
            include: [
                { model: db.Category, as: 'category' },
                { model: db.User, as: 'creator', attributes: ['id', 'first_name', 'last_name'] }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: { product }
        });

    } catch (error) {
        console.error('Ups:', error);

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                error: 'Datos inválidos',
                details: error.errors.map(e => e.message)
            });
        }

        res.status(500).json({
            success: false,
            error: 'Error al crear producto'
        });
    }
};

/**
    * Actualizar producto
    */
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, category_id, is_active } = req.body;

        const product = await db.Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Producto no encontrado'
            });
        }

        if (req.user.role !== 'admin' && product.created_by !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'No tienes permisos para editar este producto'
            });
        }

        if (name) product.name = name;
        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = price;
        if (stock !== undefined) product.stock = stock;
        if (category_id !== undefined) product.category_id = category_id;
        if (is_active !== undefined) product.is_active = is_active;

        if (req.file) {
            product.image_url = `/uploads/products/${req.file.filename}`;
        }

        await product.save();

        await product.reload({
            include: [
                { model: db.Category, as: 'category' },
                { model: db.User, as: 'creator', attributes: ['id', 'first_name', 'last_name'] }
            ]
        });

        res.json({
            success: true,
            message: 'Producto actualizado exitosamente',
            data: { product }
        });

    } catch (error) {
        console.error('Ups:', error);
        res.status(500).json({
            success: false,
            error: 'Error al actualizar producto'
        });
    }
};

/**
    * Eliminar producto
    */
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await db.Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Producto no encontrado'
            });
        }

        if (req.user.role !== 'admin' && product.created_by !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'No tienes permisos para eliminar este producto'
            });
        }

        await product.destroy();

        res.json({
            success: true,
            message: 'Producto eliminado exitosamente'
        });

    } catch (error) {
        console.error('Ups:', error);
        res.status(500).json({
            success: false,
            error: 'Error al eliminar producto'
        });
    }
};