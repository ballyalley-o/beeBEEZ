const path = require('path');
const express = require('express');
const router = express.Router();
const shopController =require('../controllers/shop')


const baseUrl = "/products";

//Method GET
//URL /
router.get("/", shopController.getIndex);

//Method GET
//URL /products
router.get(baseUrl, shopController.getProducts);

// //Method DELETE
// //URL /products/delete
// router.get(`${baseUrl}/delete`, shopController.getProducts);

//Method GET
//URL /products/:productId
router.get(`${baseUrl}/:productId`, shopController.getProduct);

// //Method GET
// //URL /cart
// router.get('/cart', shopController.getCart);

// //Method POST
// //URL /cart
// router.post('/cart', shopController.postCart)

// //Method POST
// //URL /cart-delete-item
// router.post('/cart-delete-item', shopController.postCartDeleteProduct);

// //Method POST
// //URL /cart
// router.post(`/create-order`, shopController.postOrder);

// //Method GET
// //URL /cart
// router.get(`/orders`, shopController.getOrders);

// //Method GET
// //URL /checkout
// router.get("/checkout", shopController.getCheckout);



module.exports = router;