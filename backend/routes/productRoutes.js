const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

router.get('/', ProductController.index);
router.post('/', ProductController.store);

module.exports = router;