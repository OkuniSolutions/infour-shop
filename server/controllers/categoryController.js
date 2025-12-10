const db = require('../models');

/**
    * Obtener todas las categorías
    */
exports.getAll = async (req, res) => {
    try {
        const categories = await db.Category.findAll({
            order: [['name', 'ASC']]
        });

        res.json({
            success: true,
            data: { categories }
        });

    } catch (error) {
        console.error('Ups:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener las categorías'
        });
    }
};

/**
    * Obtener una categoría por ID
    */
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await db.Category.findByPk(id, {
            include: [{
                model: db.Product,
                as: 'products',
                where: { is_active: true },
                required: false // Incluye categorías sin productos activos
            }]
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Categoría no encontrada'
            });
        }

        res.json({
            success: true,
            data: { category }
        });

    } catch (error) {
        console.error('Ups:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener categoría'
        });
    }
};

/**
    * Crear nueva categoría
    */
exports.create = async (req, res) => {
    try {
        const { name, description } = req.body;

        const category = await db.Category.create({
            name,
            description
        });

        res.status(201).json({
            success: true,
            message: 'Categoría creada exitosamente',
            data: { category }
        });

    } catch (error) {
        console.error('Ups:', error);

            if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                error: 'Ya existe una categoría con ese nombre'
            });
        }

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                error: 'Datos inválidos',
                details: error.errors.map(e => e.message)
            });
        }

        res.status(500).json({
            success: false,
            error: 'Error al crear categoría'
        });
    }
};

/**
    * Actualizar categoría
    */
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const category = await db.Category.findByPk(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Categoría no encontrada'
            });
        }

        if (name) category.name = name;
        if (description !== undefined) category.description = description;

        await category.save();

        res.json({
            success: true,
            message: 'Categoría actualizada exitosamente',
            data: { category }
        });

    } catch (error) {
        console.error('Ups:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                error: 'Ya existe una categoría con ese nombre'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Error al actualizar categoría'
        });
    }
};

/**
    * Eliminar categoría
    */
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await db.Category.findByPk(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                error: 'Categoría no encontrada'
            });
        }

        const productCount = await db.Product.count({
            where: { category_id: id }
        });

        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                error: `No se puede eliminar. Hay ${productCount} producto(s) asociados a esta categoría`
            });
        }

        await category.destroy();

        res.json({
            success: true,
            message: 'Categoría eliminada exitosamente'
        });

    } catch (error) {
        console.error('Ups:', error);
        res.status(500).json({
            success: false,
            error: 'Error al eliminar categoría'
        });
    }
};