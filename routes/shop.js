const path = require('path');
const express = require('express');
const router = express.Router();
const shopController =require('../controllers/shop')
const protect = require('../middleware/auth-protect')

const baseUrl = "/products";

router.get("/", shopController.getIndex);
router.get(baseUrl, shopController.getProducts);
router.get(`${baseUrl}/:productId`, shopController.getProduct);
router.get("/cart", protect, shopController.getCart);
router.post("/cart", protect, shopController.postCart);
router.post("/cart-delete-item", protect, shopController.postCartDeleteProduct);
router.post(`/create-order`, protect, shopController.postOrder);
router.get(`/orders`, protect, shopController.getOrders);
// router.get("/checkout", protect, shopController.getCheckout);



module.exports = router;