SELECT users.id 
AS user_id, users.username, products.id 
AS product_id, products.title 
AS product_title, products.price
FROM users
LEFT JOIN products ON users.id = products.user_id;


SELECT users.id 
AS user_id, users.username, products.id 
AS product_id, products.title 
AS product_title, products.price
FROM users
INNER JOIN products ON users.id = products.user_id;