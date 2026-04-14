const ProductModel = require('../models/ProductModel');

class ProductController {
    static index(req, res) {
        ProductModel.getAllProduct((err, results) => {
            if (err) return res.status(500).json({ error: 'Failed to retrieve products' });
            res.json({ message: 'Products retrieved successfully', data: results });
        });
    }
}

module.exports = ProductController;