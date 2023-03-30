const Product = require('../models/Product')
const Cart = require('../models/Cart')
require('colors')

const SHOP = "shop/product-list"
const INDEX = "shop/index"
const CART = "shop/cart"
const CHECKOUT = "shop/checkout";
const ORDERS = "shop/orders";
const DETAILS = "shop/product-details";

//method POST
//url
exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render(SHOP, {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("Logging in TECHNOLOGY...".white.inverse);
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product
    .findByPk(prodId)
    .then(product => {
      res.render(DETAILS, {
        pageTitle: product.title,
        product: product,
        path: "/products",
      });
    })
    .catch(err => console.log(err))
};

exports.getIndex = (req, res, next) => {
  Product.findAll().then(products => {
     res.render(INDEX, {
       prods: products,
       pageTitle: "Shop",
       path: "/",
     });
  }).catch(err => {
    console.log(err)
  })
  console.log("Logging in INDEX...".white.inverse);
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProd = []
      for (product of products) {
        const cartProdData = cart.products.find(prod => prod.id === product.id)
        if (cartProdData) {
          cartProd.push({
                        productData: product,
                        qty: cartProdData.qty
                        })
        }
      }
      res.render(CART, {
        path: "/cart",
        pageTitle: "Cart",
        products: cartProd
      });
    })
  })
  console.log("Logging in CART...".white.inverse);
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price)
  })
  res.redirect('/cart')
}

exports.postCartDeleteProduct = (req, res, next) => {
  //look for product Id in the request body
  const prodId = req.body.productId;
  //find the product in the Product model
  Product.findById(prodId, product => {
    //delete the product from the cart
    Cart.deleteProduct(prodId, product.price);
    //redirect to the cart page
    res.redirect('/cart')
  })
}

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


