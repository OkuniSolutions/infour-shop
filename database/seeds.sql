-- ============================================
-- SEEDS ECOMMERCE DATABASE
-- Datos de prueba para desarrollo
-- ============================================

USE infour_db;

-- ============================================
-- Limpiar tablas (¡CUIDADO! ¡NO USAR EN PRODUCCIÓN!)
-- ============================================
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE wishlists;
TRUNCATE TABLE sale_items;
TRUNCATE TABLE sales;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- INSERTAR USUARIOS
-- Contraseñas: todas son "password123"
-- ============================================
INSERT INTO users (email, password, first_name, last_name, phone, role) VALUES
('admin@ecommerce.com', '$2a$10$rXK5p/6JZ0z5L.qYxLxHUOF6kT0L3eQ8qH5pX9yL7bK9N8yJ6qM8O', 'Super', 'Admin', '1234567890', 'admin'),
('creator@ecommerce.com', '$2a$10$rXK5p/6JZ0z5L.qYxLxHUOF6kT0L3eQ8qH5pX9yL7bK9N8yJ6qM8O', 'Content', 'Creator', '1234567891', 'content_creator'),
('buyer@ecommerce.com', '$2a$10$rXK5p/6JZ0z5L.qYxLxHUOF6kT0L3eQ8qH5pX9yL7bK9N8yJ6qM8O', 'John', 'Doe', '1234567892', 'buyer'),
('buyer2@ecommerce.com', '$2a$10$rXK5p/6JZ0z5L.qYxLxHUOF6kT0L3eQ8qH5pX9yL7bK9N8yJ6qM8O', 'Jane', 'Smith', '1234567893', 'buyer');

-- ============================================
-- INSERTAR CATEGORÍAS
-- ============================================
INSERT INTO categories (name, description) VALUES
('Electrónica', 'Dispositivos y gadgets electrónicos'),
('Ropa', 'Prendas de vestir y accesorios'),
('Salud', 'Artículos para el cuidado personal'),
('Libros', 'Libros físicos y digitales');

-- ============================================
-- INSERTAR PRODUCTOS
-- created_by: 2 (content_creator)
-- ============================================
INSERT INTO products (name, description, price, stock, category_id, created_by, image_url) VALUES
('Laptop Dell XPS 15', 'Laptop potente para trabajo y gaming', 25999.99, 10, 1, 2, '/uploads/products/laptop-dell.jpg'),
('iPhone 15 Pro', 'Último modelo de iPhone', 32999.00, 15, 1, 2, '/uploads/products/iphone15.jpg'),
('Auriculares Sony WH-1000XM5', 'Cancelación de ruido premium', 7999.99, 25, 1, 2, '/uploads/products/sony-headphones.jpg'),
('Camiseta Nike Dri-Fit', 'Camiseta deportiva transpirable', 599.00, 50, 4, 2, '/uploads/products/nike-shirt.jpg'),
('Jeans Levis 501', 'Jeans clásicos de mezclilla', 1299.00, 30, 2, 2, '/uploads/products/levis-jeans.jpg'),
('Cafetera Nespresso', 'Cafetera de cápsulas automática', 3499.00, 20, 3, 2, '/uploads/products/nespresso.jpg'),
('Balón de Fútbol Adidas', 'Balón profesional tamaño 5', 899.00, 40, 4, 2, '/uploads/products/adidas-ball.jpg'),
('Libro "Cien Años de Soledad"', 'Novela de Gabriel García Márquez', 299.00, 100, 5, 2, '/uploads/products/book-cien-anos.jpg'),
('Smart TV Samsung 55"', 'TV 4K con Smart Hub', 12999.00, 8, 1, 2, '/uploads/products/samsung-tv.jpg'),
('Reloj Casio G-Shock', 'Reloj resistente al agua', 2499.00, 35, 2, 2, '/uploads/products/casio-watch.jpg');

-- ============================================
-- INSERTAR VENTAS
-- ============================================
INSERT INTO sales (user_id, total, status, shipping_address) VALUES
(3, 26598.99, 'completed', 'Calle Falsa 123, CDMX, México'),
(4, 10498.99, 'completed', 'Av. Reforma 456, Guadalajara, México'),
(3, 3798.00, 'pending', 'Calle Falsa 123, CDMX, México');

-- ============================================
-- INSERTAR ITEMS DE VENTAS
-- ============================================
INSERT INTO sale_items (sale_id, product_id, quantity, price, subtotal) VALUES
-- Venta 1 (user 3)
(1, 1, 1, 25999.99, 25999.99),
(1, 4, 1, 599.00, 599.00),
-- Venta 2 (user 4)
(2, 3, 1, 7999.99, 7999.99),
(2, 6, 1, 2499.00, 2499.00),
-- Venta 3 (user 3, pendiente)
(3, 6, 1, 3499.00, 3499.00),
(3, 8, 1, 299.00, 299.00);

-- ============================================
-- INSERTAR WISHLISTS
-- ============================================
INSERT INTO wishlists (user_id, product_id) VALUES
(3, 2),  -- John quiere el iPhone
(3, 9),  -- John quiere la TV
(4, 1),  -- Jane quiere la Laptop
(4, 7);  -- Jane quiere el balón