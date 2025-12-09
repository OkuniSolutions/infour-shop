require('dotenv').config();

/**
    * Configuración centralizada de la aplicación
    */

module.exports = {
    // Configuración del servidor
    server: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || 'development'
    },

    // Configuración de la base de datos
    database: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },

    // Configuración de autenticación
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    },

    // Configuración de subida de archivos
    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
        uploadPath: process.env.UPLOAD_PATH || './uploads/products'
    }
};