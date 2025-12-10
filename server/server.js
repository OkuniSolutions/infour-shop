const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const config = require('./config/config');
const { testConnection } = require('./config/database');
const db = require('./models');

const app = express();

/**
    * MIDDLEWARES GLOBALES
    */

app.use(cors({
    origin: 'http://localhost:5173', // para desarrollo
    credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/**
    * RUTAS
    */
// ============================================
// MONTAR RUTAS
// ============================================
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: '🚀 API funcionando',
        version: '1.0.0',
        endpoints: {
            testModels: '/test-models',
            protected: '/protected',
            adminOnly: '/admin-only',
            health: '/health',
            api: '/api',
            documentation: '/api'
            // Endpoints adicionales
        }
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Ruta test
app.get('/test-models', async (req, res) => {
    try {
        // Contar usuarios
        const userCount = await db.User.count();
        const productCount = await db.Product.count();
        const categoryCount = await db.Category.count();

        res.json({
            success: true,
            message: 'Modelos funcionando correctamente',
            counts: {
                users: userCount,
                products: productCount,
                categories: categoryCount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Ruta middleware
app.get('/protected', 
    require('./middleware').authMiddleware,
    (req, res) => {
        res.json({
            success: true,
            message: '¡Acceso autorizado!',
            user: req.user
        });
    }
);

// Ruta solo para admins
app.get('/admin-only',
    require('./middleware').authMiddleware,
    require('./middleware').isAdmin,
    (req, res) => {
        res.json({
            success: true,
            message: 'Bienvenido, administrador',
            user: req.user
        });
    }
);

/**
    * MANEJO DE ERRORES
    */

// Error 500
app.use((err, req, res, next) => {
    console.error('❌ Error ❌', err.stack);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Error interno del servidor'
    });
});

// El 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Ruta no encontrada'
    });
});

/**
    * INICIAR SERVIDOR
    */
const PORT = config.server.port;

const startServer = async () => {
    try {
        await testConnection();

        app.listen(PORT, () => {
            console.log(`
╔═══════════════════════════════════════════════
║  🚀 Servidor corriendo en puerto ${PORT}
║  📊 Entorno: ${config.server.env.padEnd(24)}
║  🌐 URL: http://localhost:${PORT}
║  📁 API: http://localhost:${PORT}/api
╚═══════════════════════════════════════════════

Endpoints disponibles:
    - POST   /api/auth/register
    - POST   /api/auth/login
    - GET    /api/auth/me
    - GET    /api/categories
    - GET    /api/products
    - POST   /api/products
    - GET    /api/wishlist
    - POST   /api/sales
    - GET    /api/search

Documentación: http://localhost:${PORT}/api

`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor ❌', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;