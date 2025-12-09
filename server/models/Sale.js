const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
    * Modelo Sale
    * Venta realizada
    */

const Sale = sequelize.define('Sale', {
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
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: {
                msg: 'El total debe ser un número decimal'
            },
            min: {
                args: [0],
                msg: 'El total no puede ser negativo'
            }
        }
    },
    status: {
        type: DataTypes.ENUM('pendiente', 'completada', 'cancelada'),
        defaultValue: 'pendiente',
        allowNull: false
    },
    shipping_address: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La dirección de envío es obligatoria'
            }
        }
    }
}, {
    tableName: 'sales',
    timestamps: true,
    underscored: true
});

/**
 * Métodos de instancia
 */

// Marcar venta como completada
Sale.prototype.markAsCompleted = async function() {
    this.status = 'completada';
    await this.save();
};

// Cancelar venta
Sale.prototype.cancel = async function() {
    this.status = 'cancelada';
    await this.save();
};

module.exports = Sale;