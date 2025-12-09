const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
    * Modelo Product
    */

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El nombre del producto es obligatorio'
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: {
                msg: 'El precio debe ser un número decimal'
            },
            min: {
                args: [0],
                msg: 'El precio no puede ser negativo'
            }
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            isInt: {
                msg: 'El stock debe ser un número entero'
            },
            min: {
                args: [0],
                msg: 'El stock no puede ser negativo'
            }
        }
    },
    image_url: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'categories',
            key: 'id'
        }
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: 'products',
    timestamps: true,
    underscored: true
});

/**
    * Métodos de instancia
    */

// Verificar si hay stock disponible
Product.prototype.hasStock = function(quantity = 1) {
    return this.stock >= quantity;
};

// Reducir stock después de una venta
Product.prototype.reduceStock = async function(quantity) {
    if (!this.hasStock(quantity)) {
        throw new Error('Stock insuficiente');
    }
    this.stock -= quantity;
    await this.save();
};

// Aumentar stock (devoluciones, restock)
Product.prototype.increaseStock = async function(quantity) {
    this.stock += quantity;
    await this.save();
};

module.exports = Product;