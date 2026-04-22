const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', ProductController.index);

router.post('/', verifyToken, isAdmin, ProductController.store);
router.put('/:id', verifyToken, isAdmin, ProductController.update);

module.exports = router;