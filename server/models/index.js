const { sequelize } = require('../config/database');

/**
    * Archivo central de modelos
    */

const db = {
    sequelize,
    Sequelize: require('sequelize'),

    User: require('./User'),
    Product: require('./Product'),
    Category: require('./Category'),
    Sale: require('./Sale'),
    SaleItem: require('./SaleItem'),
    Wishlist: require('./Wishlist')
};

/**
    * Función para sincronizar la db
    */
db.sync = async (options = {}) => {
    try {
        await sequelize.sync(options);
        console.log('✅ Base de datos sincronizada ✅');
    } catch (error) {
        console.error('❌ Error al sincronizar base de datos ❌', error);
    }
};

module.exports = db;