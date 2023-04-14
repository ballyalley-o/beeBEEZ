const path = require("path");
const express = require("express");
const adminController = require('../controllers/admin')
const router = express.Router();
const protect = require('../middleware/auth-protect')
const sanitizeProducts = require('../helper/sanitize');

// method GET
// URL /admin/add-product
router.get("/add-product", protect, adminController.getAddProduct);

// method GET
// URL /admin/cart
router.get("/products", protect, adminController.getProducts);

// // method POST
// // URL /admin/add-product
router.post("/add-product", protect, adminController.postAddProduct);

// method GET
// URL /admin/edit-product
router.get("/edit-product/:productId", protect, adminController.getEditProduct);

// method POST
// URL /admin/edit-product/:productId
router.post("/edit-product", protect, adminController.postEditProducts);

// method POST
// URL /admin/delete-product
router.post("/delete-product", protect, adminController.postDeleteProduct);

module.exports = router;


