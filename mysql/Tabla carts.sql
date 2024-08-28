USE ecommercedb;

CREATE TABLE carts (
	id INT PRIMARY KEY AUTO_INCREMENT,
	user_id INT NOT NULL UNIQUE,  
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE carts 
MODIFY COLUMN user_id  INT(3) NOT NULL UNIQUE;

DROP TABLE carts;

INSERT INTO carts (user_id) VALUES (1), (6);
    
SELECT * FROM CARTS;

SELECT id FROM carts WHERE id = 1;

DELETE FROM carts WHERE id = 3;

SELECT * FROM carts WHERE id = 8;
