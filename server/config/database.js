const { Sequelize } = require('sequelize');
require('dotenv').config();

/**
    * Configuración de conexión a MariaDB usando Sequelize
    */

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mariadb',
        
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        
        timezone: '-06:00', //CDMX Timezone
        
        define: {
            timestamps: true,
            underscored: false,
            freezeTableName: true,
        }
    }
);

/**
    * Prueba de conexión a la base de datos
    */

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión establecida correctamente ✅');
    } catch (error) {
        console.error('❌ Error de conexión ❌', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, testConnection };