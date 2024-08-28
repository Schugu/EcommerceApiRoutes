SHOW DATABASES;

USE ecommercedb;

CREATE TABLE cart_items (
	id INT PRIMARY KEY AUTO_INCREMENT,
	cart_id INT,
	product_id INT,
	quantity INT,
	FOREIGN KEY (cart_id) REFERENCES carts(id),
	FOREIGN KEY (product_id) REFERENCES product(id)
);

INSERT INTO cart_items (cart_id, product_id, quantity)
VALUES (2, 3, 2), (2, 2, 2), (2, 4, 2);

SELECT * FROM cart_items;

SELECT p.title, ci.quantity
FROM cart_items ci
JOIN product p ON ci.product_id = p.id
WHERE ci.cart_id = 2;

SELECT c.id AS cart_id, p.title, ci.quantity
FROM carts c
JOIN cart_items ci ON c.id = ci.cart_id
JOIN product p ON ci.product_id = p.id
WHERE c.id = 1 AND p.id = 2;
    
SELECT p.title, ci.quantity 
FROM cart_items ci
JOIN product p ON ci.product_id = p.id 
WHERE ci.cart_id = 1 AND p.id = 2;


SELECT * FROM cart_items WHERE cart_id = 1;

SELECT * FROM cart_items WHERE product_id = 2;

SELECT * FROM cart_items WHERE cart_id = 8;
