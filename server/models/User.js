const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

/**
    * Modelo User
    * 
    * Roles disponibles:
    * - cliente: Usuario comprador
    * - editor: Puede crear/editar productos
    * - admin: Acceso total al sistema
    */

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: {
            msg: 'Este email ya está registrado'
        },
        validate: {
            isEmail: {
                msg: 'Debe ser un email válido'
            },
            notEmpty: {
                msg: 'El email es obligatorio'
            }
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: {
                args: [8, 100],
                msg: 'La contraseña debe tener al menos 8 caracteres'
            }
        }
    },
    first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El nombre es obligatorio'
            }
        }
    },
    last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El apellido es obligatorio'
            }
        }
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM('cliente', 'editor', 'admin'),
        defaultValue: 'cliente',
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    
    // Hooks para hashear la contraseña
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

/**
    * Métodos de instancia
    */

// Comparar contraseña con contraseña anterior
User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Obtener datos del usuario
User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password;
    return values;
};

/**
    * Métodos estáticos
    */

// Buscar usuario por email
User.findByEmail = async function(email) {
    return await this.findOne({ where: { email } });
};

module.exports = User;
