const db = require('../models');
const { Op } = require('sequelize');

/**
 * Obtener todas las ventas
 */
exports.getAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, user_id } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (status) where.status = status;
        if (user_id) where.user_id = user_id;

        const { count, rows: sales } = await db.Sale.findAndCountAll({
            where,
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['id', 'first_name', 'last_name', 'email']
                },
                {
                    model: db.SaleItem,
                    as: 'items',
                    include: [
                        {
                            model: db.Product,
                            as: 'product',
                            attributes: ['id', 'name', 'image_url']
                        }
                    ]
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                        sales,
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
            error: 'Error al obtener ventas'
        });
    }
};

/**
 * Obtener ventas de usuario
 */
exports.getMySales = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows: sales } = await db.Sale.findAndCountAll({
            where: { user_id: req.user.id },
            include: [
                {
                    model: db.SaleItem,
                    as: 'items',
                    include: [
                        {
                            model: db.Product,
                            as: 'product',
                            attributes: ['id', 'name', 'image_url']
                        }
                    ]
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                sales,
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
            error: 'Error al obtener tus ventas'
        });
    }
};

/**
 * Obtener una venta por ID
 */
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;

        const sale = await db.Sale.findByPk(id, {
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
                },
                {
                    model: db.SaleItem,
                    as: 'items',
                    include: [
                        {
                            model: db.Product,
                            as: 'product',
                            attributes: ['id', 'name', 'image_url', 'description']
                        }
                    ]
                }
            ]
        });

        if (!sale) {
            return res.status(404).json({
                success: false,
                error: 'Venta no encontrada'
            });
        }

        if (req.user.role !== 'admin' && sale.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'No tienes permisos para ver esta venta'
            });
        }

        res.json({
            success: true,
            data: { sale }
        });

    } catch (error) {
        console.error('Ups:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener venta'
        });
    }
};

/**
 * Crear nueva venta
 */
exports.create = async (req, res) => {
    const transaction = await db.sequelize.transaction();

    try {
        const { items, shipping_address } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Debes agregar al menos un producto'
            });
        }

        if (!shipping_address) {
            return res.status(400).json({
                success: false,
                error: 'La dirección de envío es requerida'
            });
        }

        let total = 0;
        const saleItems = [];

        for (const item of items) {
            const product = await db.Product.findByPk(item.product_id);

            if (!product) {
                await transaction.rollback();
                return res.status(404).json({
                    success: false,
                    error: `Producto con ID ${item.product_id} no encontrado`
                });
            }

            if (!product.is_active) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    error: `El producto "${product.name}" no está disponible`
                });
            }

            if (product.stock < item.quantity) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    error: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}`
                });
            }

            const subtotal = product.price * item.quantity;
            total += subtotal;

            saleItems.push({
                product_id: product.id,
                quantity: item.quantity,
                price: product.price,
                subtotal
            });

            product.stock -= item.quantity;
            await product.save({ transaction });
        }

        const sale = await db.Sale.create({
            user_id: req.user.id,
            total,
            shipping_address,
            status: 'pending'
        }, { transaction });

        for (const item of saleItems) {
            await db.SaleItem.create({
                sale_id: sale.id,
                ...item
            }, { transaction });
        }

        await transaction.commit();

        await sale.reload({
            include: [
                {
                    model: db.SaleItem,
                    as: 'items',
                    include: [
                        {
                            model: db.Product,
                            as: 'product'
                        }
                    ]
                }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Compra realizada exitosamente',
            data: { sale }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Ups:', error);
        res.status(500).json({
            success: false,
            error: 'Error al procesar la compra'
        });
    }
};

/**
 * Actualizar estado de venta
 */
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'completed', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: `Estado inválido. Valores permitidos: ${validStatuses.join(', ')}`
            });
        }

        const sale = await db.Sale.findByPk(id);

        if (!sale) {
            return res.status(404).json({
                success: false,
                error: 'Venta no encontrada'
            });
        }

        sale.status = status;
        await sale.save();

        res.json({
            success: true,
            message: 'Estado actualizado exitosamente',
            data: { sale }
        });

    } catch (error) {
        console.error('Ups:', error);
        res.status(500).json({
            success: false,
            error: 'Error al actualizar estado'
        });
    }
};

/**
 * Obtener estadísticas de ventas
 */
exports.getStats = async (req, res) => {
    try {
        const totalSales = await db.Sale.count();
        const completedSales = await db.Sale.count({ where: { status: 'completed' } });
        const pendingSales = await db.Sale.count({ where: { status: 'pending' } });
        
        const totalRevenue = await db.Sale.sum('total', {
            where: { status: 'completed' }
        });

        res.json({
            success: true,
            data: {
                totalSales,
                completedSales,
                pendingSales,
                totalRevenue: totalRevenue || 0
            }
        });

    } catch (error) {
        console.error('Ups:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener estadísticas'
        });
    }
};