/**
    * Índice central de middlewares
    */

const { authMiddleware, optionalAuth } = require('./auth.middleware');
const { 
    checkRole, 
    isAdmin, 
    isAdminOrCreator, 
    isBuyer,
    isAuthenticated,
    isOwnerOrAdmin 
} = require('./role.middleware');
const { 
    uploadSingle, 
    uploadMultiple, 
    handleUploadError, 
    deleteFile 
} = require('./upload.middleware');
const {
    validateRequiredFields,
    validateEmail,
    validatePassword,
    validateId,
    validateProduct,
    sanitizeInput
} = require('./validation.middleware');

module.exports = {
    // Auth
    authMiddleware,
    optionalAuth,

    // Roles
    checkRole,
    isAdmin,
    isAdminOrCreator,
    isBuyer,
    isAuthenticated,
    isOwnerOrAdmin,

    // Upload
    uploadSingle,
    uploadMultiple,
    handleUploadError,
    deleteFile,

    // Validation
    validateRequiredFields,
    validateEmail,
    validatePassword,
    validateId,
    validateProduct,
    sanitizeInput
};