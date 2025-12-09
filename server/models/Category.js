const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
    * Modelo Category
    */

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
            msg: 'Ya existe una categoría con este nombre'
        },
        validate: {
            notEmpty: {
                msg: 'El nombre de la categoría es obligatorio'
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'categories',
    timestamps: true,
    underscored: true
});

module.exports = Category;