const db = require('../config/db'); 

class ProductModel {
    static getAllProducts(callback) {
        db.query('SELECT * FROM products', (err, results) => {
            callback(err, results);
        });
    }

    static create(data, callback) {
        const query = 'INSERT INTO products (name, description, price, stock, category_id) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [data.name, data.description, data.price, data.stock, data.category_id], (err, results) => {
            callback(err, results);
        });
    }
}

module.exports = ProductModel;