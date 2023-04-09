const Product = require('../models/Product');
const Order = require('../models/Order');

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
        isAuthenticated: req.session.isLoggedIn,
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
        isAuthenticated: req.session.isLoggedIn,
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
       isAuthenticated: req.session.isLoggedIn,
     });
  }).catch(err => {
    console.log(err)
  })
  console.log("Logging in INDEX...".white.inverse);
};

exports.getCart = (req, res, next) => {
  req.member
  .populate('cart.items.productId')
  .then(member => {
      const products = member.cart.items;
      res.render(CART, {
        path: "/cart",
        pageTitle: "Cart",
        products: products,
        isAuthenticated: req.session.isLoggedIn,
      });
      })
  .catch(err => {
    console.log(err)
  })
  console.log("Logging in CART...".white.inverse);
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product
    .findById(prodId)
    .then(product => {
        return req.session.member.addToCart(product)
      })
    .then(result => {
    console.log(result);
    res.redirect("/cart");
  })
}

exports.postCartDeleteProduct = (req, res, next) => {
  //look for product Id in the request body
  const prodId = req.body.productId;
  req.member
    .removeFromCart(prodId)
    .then((result) => {
      console.log(`DELETED ${req.body.productId}`.red.inverse);
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
  req.member
  .populate('cart.items.productId')
  .then(member => {
      const products = member.cart.items.map(
        i => {
          return {
            quantity: i.quantity,
            product: {...i.productId._doc }
          }
        });
        const order = new Order({
          member: {
            name: req.session.member.name,
            memberId: req.session.member._id,
          },
          products: products,
        });
        order.save();
  })
    .then(result => {
      req.session.member.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch(err => {
      console.log(err)
    })
};

exports.getOrders = (req, res, next) => {
  Order
    .find({"member.memberId": req.session.member._id})
    .then(orders => {
        res.render(ORDERS, {
          path: "/orders",
          pageTitle: "Your Orders",
          orders: orders,
          isAuthenticated: req.session.isLoggedIn,
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


