const  Product = require('../models/Product')

const SHOP = "shop/product-list"
const INDEX = "shop/index"
const CART = "/cart"
const CHECKOUT = "shop/checkout";
const ORDERS = "shop/orders";



//method POST
//url
exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
        res.render(SHOP, {
          prods: products,
          pageTitle: "Shop",
          path: "/products",
        });
    });
  console.log("Middleware logging in ROOT...");
};


exports.getIndex = (req, res, next) => {
  Product.fetchAll(products => {
        res.render(INDEX, {
          prods: products,
          pageTitle: "Shop",
          path: "/"
        });
    });
  console.log("Middleware logging in INDEX...");
};


exports.getCart = (req, res, next) => {
  res.render(CART, {
    path: '/cart',
    pageTitle: "Cart"
  })
};

exports.getOrders = (req, res, next) => {
  res.render(ORDERS, {
    path: "/orders",
    pageTitle: "Orders",
  });
};


exports.getCheckout = (req, res, next) => {
  res.render(CHECKOUT, {
    path: '/checkout',
    pageTitle: 'Checkout'
  })

};