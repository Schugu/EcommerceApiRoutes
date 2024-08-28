DROP DATABASE productsdb;
CREATE DATABASE ecommercedb;

SHOW DATABASES;

USE ecommercedb;

CREATE TABLE product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE, 
    price DECIMAL(10, 2) NOT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    stock INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated VARCHAR(255)
);

-- Ver tabla
DESCRIBE product; 
SHOW COLUMNS FROM product;
SELECT * FROM product;

-- Eliminar tabla
DROP TABLE product;

INSERT INTO product (title, description, code, price, stock, category) 
VALUES 
	('Queso', 'Cremoso', 900, 2.50, 500, 'Lácteos'),
    ('CocaCola', 'Gaseosa', 500, 3.50, 20, 'Bebidas'),
    ('Fanta', 'Gaseosa', 200, 3, 21, 'Bebidas'),
	('Fanta Naranja', 'Gaseosa', '201', 3.50, 22, 'Bebidas');

