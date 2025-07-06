const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const uploadImage = require("../middlewares/imageUploadMiddleware");

router.post("/products", uploadImage, productController.createProduct);

router.get('/products', productController.getAllProducts);


router.delete('/products/:id', productController.deleteProduct);

module.exports = router;

