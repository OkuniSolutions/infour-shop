/**
    * Middleware de Autorización por Roles
    * IMPORTANTE: Debe usarse DESPUÉS de authMiddleware
    */

/**
    * Verificar si el usuario tiene uno de los roles permitidos
    */
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Usuario no autenticado'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'No tienes permisos para realizar esta acción',
                requiredRoles: allowedRoles,
                yourRole: req.user.role
            });
        }

        next();
    };
};

/**
    * Shortcuts para roles comunes
    */

// Solo administradores
const isAdmin = checkRole(['admin']);

// Administradores y creadores de contenido
const isAdminOrCreator = checkRole(['admin', 'editor']);

// Solo compradores
const isBuyer = checkRole(['cliente']);

// Cualquier usuario autenticado
const isAuthenticated = checkRole(['admin', 'editor', 'cliente']);

/**
    * Verificar que el usuario sea el dueño del recurso o admin
    */
const isOwnerOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Usuario no autenticado'
        });
    }

    const resourceUserId = req.params.userId || req.body.userId;

    if (req.user.role === 'admin' || req.user.id === parseInt(resourceUserId)) {
        return next();
    }

    return res.status(403).json({
        success: false,
        error: 'No tienes permisos para acceder a este recurso'
    });
};

module.exports = {
    checkRole,
    isAdmin,
    isAdminOrCreator,
    isBuyer,
    isAuthenticated,
    isOwnerOrAdmin
};