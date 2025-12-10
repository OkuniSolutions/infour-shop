const db = require('../models');
const { Op } = require('sequelize');

/**
    * Obtener todos los usuarios
    */
exports.getAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, role, is_active, search } = req.query;
        const offset = (page - 1) * limit;

        const where = {};

            if (role) where.role = role;
        if (is_active !== undefined) where.is_active = is_active === 'true';

            if (search) {
            where[Op.or] = [
                { first_name: { [Op.like]: `%${search}%` } },
                { last_name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows: users } = await db.User.findAndCountAll({
            where,
            attributes: { exclude: ['password'] },
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                users,
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
            error: 'Error al obtener usuarios'
        });
    }
};

/**
    * Obtener usuario por ID
    */
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await db.User.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: db.Sale,
                    as: 'sales',
                    limit: 5,
                    order: [['created_at', 'DESC']]
                }
            ]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            data: { user }
        });

    } catch (error) {
        console.error('Ups:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener usuario'
        });
    }
};

/**
    * Crear usuario
    */
exports.create = async (req, res) => {
    try {
        const { email, password, first_name, last_name, phone, role, is_active } = req.body;

        const existingUser = await db.User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'Este email ya está registrado'
            });
        }

        const user = await db.User.create({
            email,
            password,
            first_name,
            last_name,
            phone,
            role: role || 'cliente',
            is_active: is_active !== undefined ? is_active : true
        });

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: { user: user.toJSON() }
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
            error: 'Error al crear usuario'
        });
    }
};

/**
    * Actualizar usuario
    */
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, phone, role, is_active } = req.body;

        const user = await db.User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (phone !== undefined) user.phone = phone;
        if (role) user.role = role;
        if (is_active !== undefined) user.is_active = is_active;

        await user.save();

        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: { user: user.toJSON() }
        });

    } catch (error) {
        console.error('Ups:', error);
        res.status(500).json({
            success: false,
            error: 'Error al actualizar usuario'
        });
    }
};

/**
    * Eliminar usuario
    */
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        // No permitir que un admin se elimine a sí mismo
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({
                success: false,
                error: 'No puedes eliminar tu propia cuenta'
            });
        }

        const user = await db.User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        await user.destroy();

        res.json({
            success: true,
            message: 'Usuario eliminado exitosamente'
        });

    } catch (error) {
        console.error('Ups:', error);
        res.status(500).json({
            success: false,
            error: 'Error al eliminar usuario'
        });
    }
};