const db = require('../config/db'); 

class ProductModel {
    static getAllProducts(callback) {
        db.query('SELECT * FROM products', (err, results) => {
            callback(err, results);
        });
    }
}

module.exports = ProductModel;