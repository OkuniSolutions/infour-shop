const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
    * Modelo Wishlist
    */

const Wishlist = sequelize.define('Wishlist', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    }
}, {
    tableName: 'wishlists',
    timestamps: true,
    underscored: true,

    // Índice único: un usuario no puede agregar el mismo producto 2 veces
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'product_id'],
            name: 'unique_user_product'
        }
    ]
});

module.exports = Wishlist;