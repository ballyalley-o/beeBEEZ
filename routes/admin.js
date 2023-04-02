const path = require("path");
const express = require("express");
const adminController = require('../controllers/admin')
const router = express.Router();

// method GET
// URL /admin/add-product
router.get("/add-product", adminController.getAddProduct);

// method GET
// URL /admin/cart
router.get("/products", adminController.getProducts)

// method POST
// URL /admin/add-product
router.post("/add-product", adminController.postAddProduct);

// method GET
// URL /admin/edit-product
router.get("/edit-product/:productId", adminController.getEditProduct)

// method POST
// URL /admin/edit-product/:productId
router.post("/edit-product", adminController.postEditProducts);

// method POST
// URL /admin/delete-product
router.post("/delete-product", adminController.postDeleteProduct)

module.exports = router;


