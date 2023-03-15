const path = require('path');
const express = require('express');
const router = express.Router();
const shopController =require('../controllers/shop')


//Method GET
//URL /
router.get("/", shopController.getIndex);

//Method GET
//URL /products
router.get("/products", shopController.getProducts);

//Method DELETE
//URL /products/delete
router.get("/products/delete", shopController.getProducts);

//Method GET
//URL /products/:productId
router.get("/products/:productId", shopController.getProduct);

//Method GET
//URL /cart
router.get("/shop/cart", shopController.getCart);

//Method GET
//URL /cart
router.get("/orders", shopController.getOrders);

//Method GET
//URL /checkout
router.get("/checkout", shopController.getCheckout);



module.exports = router;