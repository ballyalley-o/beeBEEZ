const Product = require('../models/Product');

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
  Product.find()
    .then(products => {
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
    .findById(prodId)
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
  Product.find()
  .then(products => {
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
  req.member
  .getCart()
  .then(products => {
        res.render(CART, {
        path: "/cart",
        pageTitle: "Cart",
        products: products
        });
      })
  .catch(err => {
    console.log(err)
  })

  console.log("Logging in CART...".white.inverse);
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId).then(product => {
    return req.member.addToCart(product)
  }).then(result => {
    console.log(result);
    res.redirect("/cart");
  })
}

exports.postCartDeleteProduct = (req, res, next) => {
  //look for product Id in the request body
  const prodId = req.body.productId;
  req.member
    .deleteItemFromCart(prodId)
    .then((result) => {
      console.log(`DELETED ${req.body.productId}`.red.inverse)
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });


  // //find the product in the Product model
  // Product.findByPk(prodId, product => {
  //   //delete the product from the cart
  //   Cart.deleteProduct(prodId, product.price);
  //   //redirect to the cart page
  //   res.redirect('/cart')
  // })
}

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.member
    .addOrder()
    .then(result => {
      res.redirect("/orders");
    })
    .catch(err => {
      console.log(err)
    })
};

exports.getOrders = (req, res, next) => {
  req.member
    .getOrders()
    .then(orders => {
      res.render(ORDERS, {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders
      });
    })
    .catch(err => console.log(err))
};

exports.getCheckout = (req, res, next) => {
  res.render(CHECKOUT, {
    path: '/checkout',
    pageTitle: 'Checkout'
  })
};


