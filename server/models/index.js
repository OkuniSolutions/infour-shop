const { sequelize } = require('../config/database');

const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Sale = require('./Sale');
const SaleItem = require('./SaleItem');
const Wishlist = require('./Wishlist');

/**
    * RELACIONES ENTRE MODELOS
    */

// ============================================
// RELACIONES DE USER
// ============================================

// Un usuario puede crear muchos productos
User.hasMany(Product, {
    foreignKey: 'created_by',
    as: 'createdProducts'
});
Product.belongsTo(User, {
    foreignKey: 'created_by',
    as: 'creator'
});

// Un usuario tiene muchas ventas
User.hasMany(Sale, {
    foreignKey: 'user_id',
    as: 'sales'
});
Sale.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

// Un usuario tiene muchos productos en su wishlist (muchos a muchos)
User.belongsToMany(Product, {
    through: Wishlist,
    foreignKey: 'user_id',
    otherKey: 'product_id',
    as: 'wishlistProducts'
});
Product.belongsToMany(User, {
    through: Wishlist,
    foreignKey: 'product_id',
    otherKey: 'user_id',
    as: 'wishlistedBy'
});

// ============================================
// RELACIONES DE CATEGORY
// ============================================

// Una categoría tiene muchos productos
Category.hasMany(Product, {
    foreignKey: 'category_id',
    as: 'products'
});
Product.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category'
});

// ============================================
// RELACIONES DE SALE
// ============================================

// Una venta tiene muchos items (productos)
Sale.hasMany(SaleItem, {
    foreignKey: 'sale_id',
    as: 'items'
});
SaleItem.belongsTo(Sale, {
    foreignKey: 'sale_id',
    as: 'sale'
});

// ============================================
// RELACIONES DE PRODUCT con SALE_ITEMS
// ============================================

// Un producto puede estar en muchos items de venta
Product.hasMany(SaleItem, {
    foreignKey: 'product_id',
    as: 'saleItems'
});
SaleItem.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product'
});

// Relación muchos a muchos entre venta y producto a través de SaleItem
Sale.belongsToMany(Product, {
    through: SaleItem,
    foreignKey: 'sale_id',
    otherKey: 'product_id',
    as: 'products'
});
Product.belongsToMany(Sale, {
    through: SaleItem,
    foreignKey: 'product_id',
    otherKey: 'sale_id',
    as: 'sales'
});

/**
    * Archivo central de modelos
    */

const db = {
    sequelize,
    Sequelize: require('sequelize'),

    User,
    Category,
    Product,
    Sale,
    SaleItem,
    Wishlist
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
