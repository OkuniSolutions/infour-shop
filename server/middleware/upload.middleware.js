const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');

/**
    * Middleware para subir imágenes de productos
    */

const uploadDir = config.upload.uploadPath;
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

/**
    * Configuración de almacenamiento
    */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    
    filename: (req, file, cb) => {
        // Formato: producto-nombreoriginal.jpg
        const uniqueSuffix = Date.now() + '-';
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-');

        cb(null, `producto-${uniqueSuffix}-${basename}${ext}`);
    }
});

/**
    * Filtro para validar tipos de archivo
    */
const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg',
        'image/avif'
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP, SVG, AVIF)'), false);
    }
};

/**
    * Configuración de Multer
    */
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: config.upload.maxFileSize // 5MB
    }
});

/**
    * Middleware para subir una sola imagen
    */
const uploadSingle = upload.single('image');

/**
    * Middleware para subir múltiples imágenes
    * Máximo 5 imágenes
    */
const uploadMultiple = (maxCount = 5) => {
    return upload.array('images', maxCount);
};

/**
    * Middleware para manejar errores de Multer
    */
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: `El archivo es demasiado grande. Tamaño máximo: ${config.upload.maxFileSize / 1024 / 1024}MB`
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                error: 'Se superó el número máximo de archivos permitidos'
            });
        }
        return res.status(400).json({
            success: false,
            error: err.message
        });
    } else if (err) {
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }
    next();
};

/**
    * Función helper para eliminar archivo
    */
const deleteFile = (filename) => {
    const filePath = path.join(uploadDir, filename);

    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
            return true;
        } catch (error) {
            console.error('Error al eliminar archivo:', error);
            return false;
        }
    }
    return false;
};

module.exports = {
    uploadSingle,
    uploadMultiple,
    handleUploadError,
    deleteFile
};