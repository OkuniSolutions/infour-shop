/**
    * Middleware para validar datos de entrada
    */

/**
    * Validar campos requeridos
    */
const validateRequiredFields = (requiredFields) => {
    return (req, res, next) => {
        const missingFields = [];

        requiredFields.forEach(field => {
            if (
                !req.body[field] && 
                !req.params[field] && 
                !req.query[field]
            ) {
                missingFields.push(field);
            }
        });

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Faltan campos requeridos',
                missingFields: missingFields
            });
        }

        next();
    };
};

/**
    * Validar email
    */
const validateEmail = (req, res, next) => {
    const email = req.body.email;

    if (!email) {
        return res.status(400).json({
            success: false,
            error: 'El email es requerido'
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            error: 'Formato de email inválido'
        });
    }

    next();
};

/**
    * Validar contraseña
    */
const validatePassword = (req, res, next) => {
    const password = req.body.password;

    if (!password) {
        return res.status(400).json({
            success: false,
            error: 'La contraseña es requerida'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            error: 'La contraseña debe tener al menos 6 caracteres'
        });
    }

    if (password.length > 100) {
        return res.status(400).json({
            success: false,
            error: 'La contraseña es demasiado larga'
        });
    }

    next();
};

/**
    * Validar ID
    */
const validateId = (paramName = 'id') => {
    return (req, res, next) => {
        const id = req.params[paramName];

        if (!id) {
            return res.status(400).json({
                success: false,
                error: `El parámetro ${paramName} es requerido`
            });
        }

        const numId = parseInt(id);

        if (isNaN(numId) || numId <= 0) {
            return res.status(400).json({
                success: false,
                error: `El ${paramName} debe ser un número positivo válido`
            });
        }

        req.params[paramName] = numId;
        next();
    };
};

/**
    * Validar producto
    */
const validateProduct = (req, res, next) => {
    const { name, price, stock, category_id } = req.body;
    const errors = [];

    if (!name || name.trim().length === 0) {
        errors.push('El nombre del producto es requerido');
    }

    if (name && name.length > 255) {
        errors.push('El nombre del producto es demasiado largo (máximo 255 caracteres)');
    }

    if (price === undefined || price === null) {
        errors.push('El precio es requerido');
    }

    if (price && (isNaN(price) || parseFloat(price) < 0)) {
        errors.push('El precio debe ser un número positivo');
    }

    if (stock !== undefined && (isNaN(stock) || parseInt(stock) < 0)) {
        errors.push('El stock debe ser un número entero positivo');
    }

    if (category_id && (isNaN(category_id) || parseInt(category_id) <= 0)) {
        errors.push('El ID de categoría debe ser un número positivo válido');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            error: 'Datos de producto inválidos',
            details: errors
        });
    }

    next();
};

/**
    * Sanitizar entrada de texto
    */
const sanitizeInput = (req, res, next) => {
    const sanitize = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = obj[key].replace(/<[^>]*>/g, '');
                obj[key] = obj[key].trim();
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitize(obj[key]);
            }
        }
    };

    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);

    next();
};

module.exports = {
    validateRequiredFields,
    validateEmail,
    validatePassword,
    validateId,
    validateProduct,
    sanitizeInput
};