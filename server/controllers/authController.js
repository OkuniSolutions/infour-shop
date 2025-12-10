const jwt = require('jsonwebtoken');
const config = require('../config/config');
const db = require('../models');

/**
    * Generar token para un usuario
    */
const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            email: user.email, 
            role: user.role 
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
    );
};

/**
    * Registrar nuevo usuario
    */
exports.register = async (req, res) => {
    try {
        const { email, password, first_name, last_name, phone, role } = req.body;

        // Verificar si el email ya existe
        const existingUser = await db.User.findOne({ where: { email } });
        
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'Este email ya está registrado'
            });
        }

        // Crear el usuario
        const user = await db.User.create({
            email,
            password,
            first_name,
            last_name,
            phone,
            role: role || 'cliente' // Por defecto es cliente
        });

        // Generar token
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
                user: user.toJSON(),
                token
            }
        });

    } catch (error) {
        console.error('Ups:', error);

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                error: 'Datos de registro inválidos',
                details: error.errors.map(e => e.message)
            });
        }

        res.status(500).json({
            success: false,
            error: 'Error al registrar usuario'
        });
    }
};

/**
    * Login de usuario
    */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario por email
        const user = await db.User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Credenciales inválidas'
            });
        }

        // Verificar que el usuario esté activo
        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                error: 'Usuario desactivado. Contacta al administrador'
            });
        }

        // Verificar contraseña
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Credenciales inválidas'
            });
        }

        // Generar token
        const token = generateToken(user);

        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                user: user.toJSON(),
                token
            }
        });

    } catch (error) {
        console.error('Ups:', error);
        res.status(500).json({
            success: false,
            error: 'Error al iniciar sesión'
        });
    }
};

/**
    * Obtener perfil del usuario autenticado
    */
exports.getProfile = async (req, res) => {
    try {
        const user = await db.User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        res.json({
            success: true,
            data: { user }
        });

    } catch (error) {
        console.error('Ups:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener perfil'
        });
    }
};

/**
    * Actualizar perfil del usuario autenticado
    */
exports.updateProfile = async (req, res) => {
    try {
        const { first_name, last_name, phone } = req.body;

        const user = await db.User.findByPk(req.user.id);

        // Actualizar solo los campos permitidos
        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (phone !== undefined) user.phone = phone;

        await user.save();

        res.json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            data: { user: user.toJSON() }
        });

    } catch (error) {
        console.error('Ups:', error);
        res.status(500).json({
            success: false,
            error: 'Error al actualizar perfil'
        });
    }
};

/**
    * Cambiar contraseña
    */
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Se requieren ambas contraseñas'
            });
        }

        const user = await db.User.findByPk(req.user.id);

        // Verificar contraseña actual
        const isPasswordValid = await user.comparePassword(currentPassword);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Contraseña actual incorrecta'
            });
        }

        // Actualizar contraseña
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Contraseña cambiada exitosamente'
        });

    } catch (error) {
        console.error('Ups:', error);
        res.status(500).json({
            success: false,
            error: 'Error al cambiar contraseña'
        });
    }
};