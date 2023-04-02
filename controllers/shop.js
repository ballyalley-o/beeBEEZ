const Product = require('../models/Product');
const Cart = require('../models/Cart');
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
  Product.fetchAll()
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
  Product.fetchAll()
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
  .then(cart => {
    return cart
      .getProducts()
      .then(products => {
        res.render(CART, {
        path: "/cart",
        pageTitle: "Cart",
        products: products
        });
      })
      .catch(err => console.log(err))
  })
  .catch(err => {
    console.log(err)
  })

  console.log("Logging in CART...".white.inverse);
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.member
  .getCart()
  .then(cart => {
    fetchedCart = cart;
    return cart.getProducts({where: {id: prodId}})
  })
  .then(products => {
    let product;
    if (products.length > 0) {
      product = products[0]
    }
    if (product) {
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
      return product;
    }
    return Product.findByPk(prodId)
  })
  .then(product => {
     return fetchedCart.addProduct(product, {
       through: { quantity: newQuantity },
     });
  })
  .then(() => {
    res.redirect("/cart");
  })
  .catch(err => {
    console.log(err)
  })
}

exports.postCartDeleteProduct = (req, res, next) => {
  //look for product Id in the request body
  const prodId = req.body.productId;
  req.member
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } })
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart')
    })
    .catch(err => {
      console.log(err)
    })
  //find the product in the Product model
  Product.findByPk(prodId, product => {
    //delete the product from the cart
    Cart.deleteProduct(prodId, product.price);
    //redirect to the cart page
    res.redirect('/cart')
  })
}

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.member
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts()
    })
    .then(products => {
      return  req.member
                .createOrder()
                .then(order => {
                  return order.addProducts(products.map(product => {
                    product.orderItem = {quantity: product.cartItem.quantity};
                    return product;
                  })
                  )
                })
                .catch(err => console.log(err))
    })
    .then(result => {
      return fetchedCart.setProducts(null)

    })
    .then(result => {
      res.redirect("/orders");
    })
    .catch(err => {
      console.log(err)
    })
};

exports.getOrders = (req, res, next) => {
  req.member
    .getOrders({include: ['products']})
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


