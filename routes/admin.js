const path = require("path");
const express = require("express");
const adminController = require('../controllers/admin')
const router = express.Router();
const protect = require('../middleware/auth-protect')
const { body } = require("express-validator");
const { sanitizeProducts } = require('../helper/sanitize');


router.get("/add-product", protect, adminController.getAddProduct);
router.get("/products", protect, adminController.getProducts);
router.post("/add-product", sanitizeProducts, protect, adminController.postAddProduct);
router.get("/edit-product/:productId", protect, adminController.getEditProduct);
router.post("/edit-product", sanitizeProducts, protect, adminController.postEditProducts);
router.post("/delete-product", protect, adminController.postDeleteProduct);

module.exports = router;


