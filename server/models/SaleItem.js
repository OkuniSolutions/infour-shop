const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
    * Modelo SaleItem
    * Intermedia entre Sale y Product
    */

const SaleItem = sequelize.define('SaleItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sale_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sales',
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
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: {
                msg: 'La cantidad debe ser un número entero'
            },
            min: {
                args: [1],
                msg: 'La cantidad debe ser al menos 1'
            }
        }
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
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: {
                msg: 'El subtotal debe ser un número decimal'
            }
        }
    }
}, {
    tableName: 'sale_items',
    timestamps: true,
    underscored: true,
    
    hooks: {
        beforeCreate: (saleItem) => {
            saleItem.subtotal = saleItem.price * saleItem.quantity;
        },
        beforeUpdate: (saleItem) => {
            if (saleItem.changed('price') || saleItem.changed('quantity')) {
                saleItem.subtotal = saleItem.price * saleItem.quantity;
            }
        }
    }
});

module.exports = SaleItem;