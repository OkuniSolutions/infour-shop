const jwt = require('jsonwebtoken');
const config = require('../config/config');
const db = require('../models');

/**
    * Middleware de Autenticación
    * Verifica que:
    * 1. El usuario envíe un token en el header Authorization
    * 2. El token sea válido y no haya expirado
    * 3. El usuario asociado al token exista y esté activo
    */

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                error: 'No se proporcionó token de autenticación'
            });
        }

        // El formato es: "Bearer TOKEN"
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Formato de token inválido'
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, config.jwt.secret);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    error: 'Token expirado',
                    code: 'TOKEN_EXPIRED'
                });
            }
            return res.status(401).json({
                success: false,
                error: 'Token inválido'
            });
        }

        const user = await db.User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                error: 'Usuario desactivado'
            });
        }

        req.user = user;

        next();

    } catch (error) {
        console.error('Error en authMiddleware:', error);
        return res.status(500).json({
            success: false,
            error: 'Error al verificar autenticación'
        });
    }
};

/**
    * Middleware para rutas que funcionan con o sin autenticación
    */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            req.user = null;
            return next();
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            req.user = null;
            return next();
        }

        const decoded = jwt.verify(token, config.jwt.secret);
        const user = await db.User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        });

        req.user = user || null;
        next();

    } catch (error) {
        req.user = null;
        next();
    }
};

module.exports = {
    authMiddleware,
    optionalAuth
};