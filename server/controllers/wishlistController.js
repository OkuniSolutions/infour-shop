const db = require("../models");

/**
 * Obtener wishlist del usuario autenticado
 */
exports.getMyWishlist = async (req, res) => {
    try {
        const wishlist = await db.Wishlist.findAll({
            where: { user_id: req.user.id },
            include: [
                {
                    model: db.Product,
                    as: "product",
                    include: [
                        { model: db.Category, as: "category", attributes: ["id", "name"] },
                    ],
                },
            ],
            order: [["created_at", "DESC"]],
        });

        res.json({
            success: true,
            data: { wishlist },
        });

    } catch (error) {
        console.error("Ups:", error);
        res.status(500).json({
            success: false,
            error: "Error al obtener wishlist",
        });
    }
};

/**
 * Agregar producto a wishlist
 */
exports.addToWishlist = async (req, res) => {
    try {
        const { product_id } = req.body;

        if (!product_id) {
            return res.status(400).json({
                success: false,
                error: "El ID del producto es requerido",
            });
        }

        const product = await db.Product.findByPk(product_id);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: "Producto no encontrado",
            });
        }

        const existing = await db.Wishlist.findOne({
            where: {
                user_id: req.user.id,
                product_id,
            },
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                error: "Este producto ya está en tu wishlist",
            });
        }

        const wishlistItem = await db.Wishlist.create({
            user_id: req.user.id,
            product_id,
        });

        await wishlistItem.reload({
            include: [
                {
                    model: db.Product,
                    as: "product",
                    include: [{ model: db.Category, as: "category" }],
                },
            ],
        });

        res.status(201).json({
            success: true,
            message: "Producto agregado a wishlist",
            data: { wishlistItem },
        });

    } catch (error) {
        console.error("Ups:", error);
        res.status(500).json({
            success: false,
            error: "Error al agregar a wishlist",
        });
    }
};

/**
* Eliminar producto de wishlist
*/
exports.removeFromWishlist = async (req, res) => {
    try {
        const { product_id } = req.params;
        const wishlistItem = await db.Wishlist.findOne({

                where: {
                user_id: req.user.id,
                product_id,
            },
        });

        if (!wishlistItem) {
            return res.status(404).json({
                success: false,
                error: "Producto no encontrado en tu wishlist",
            });
        }

        await wishlistItem.destroy();

        res.json({
            success: true,
            message: "Producto eliminado de wishlist",
        });

    } catch (error) {
        console.error("Ups:", error);
        res.status(500).json({
            success: false,
            error: "Error al eliminar de wishlist",
        });
    }
};

/**
* Limpiar toda la wishlist
*/
exports.clearWishlist = async (req, res) => {
    try {
        await db.Wishlist.destroy({
            where: { user_id: req.user.id },
        });

        res.json({
            success: true,
            message: "Wishlist vaciada exitosamente",
        });
    } catch (error) {
        console.error("Ups:", error);
        res.status(500).json({
            success: false,
            error: "Error al limpiar wishlist",
        });
    }
};
