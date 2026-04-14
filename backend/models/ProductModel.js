const db = require('../config/db'); 

class ProductModel {
    static getAllProduct(callback) {
        db.query('SELECT * FROM products', (err, results) => {
            callback(err, results);
        });
    }
}

module.exports = ProductModel;