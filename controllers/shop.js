const fs = require('fs');
const path = require('path');
const PDFDoc = require('pdfkit')
const Product = require('../models/Product');
const Order = require('../models/Order');
const csrf = require('csurf');

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
    .then((products) => {
      res.render(SHOP, {
        prods: products,
        pageTitle: "Shop",
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  console.log("Logging in TECHNOLOGY...".white.inverse);
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render(DETAILS, {
        pageTitle: product.title,
        product: product,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render(INDEX, {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  console.log("Logging in INDEX...".white.inverse);
};

exports.getCart = (req, res, next) => {
  req.member
    .populate("cart.items.productId")
    .then((member) => {
      const products = member.cart.items;
      res.render(CART, {
        path: "/cart",
        pageTitle: "Cart",
        products: products,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  console.log("Logging in CART...".white.inverse);
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product
    .findById(prodId)
    .then(product => {
        return req.member.addToCart(product)
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
            name: req.member.name,
            email: req.member.email,
            memberId: req.member._id,
          },
          products: products,
        });
        order.save();
     })
    .then(result => {
      req.member.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    }).catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error)
    });
};

exports.getOrders = (req, res, next) => {
  Order
    .find({"member.memberId": req.session.member._id})
    .then(orders => {
        res.render(ORDERS, {
          path: "/orders",
          pageTitle: "Your Orders",
          orders: orders
        });
    }).catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error)
    });
};

exports.getCheckout = (req, res, next) => {
  res.render(CHECKOUT, {
    path: '/checkout',
    pageTitle: 'Checkout'
  })
};


exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return new Error("No order no. found");
      }
      if (order.member.memberId.toString() !== req.member._id.toString()) {
        return next(new Error("Unauthorized to access this order"));
      }
      const invoiceName = "invoice_" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      const pdfDoc = new PDFDoc();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.image("public/assets/hippo.png", 170, 150, {});
      pdfDoc.font('Helvetica')
      pdfDoc
        .fontSize(22)
        .text("beeBEEZ Invoice", 90, 150, {
          //add more options
          align: "center",
        });

       pdfDoc.fontSize(10).text("www.beeBEEZ.co.nz", 15, 170, {
          link: 'https://www.beeBEEZ.co.nz',
          underline: true,
          align: 'center'

       });

       pdfDoc
          .fontSize(23)
          .text('Thank you for Shopping with us!', 120, 450, {
            margin: 20,
       })

      pdfDoc.moveDown()
      pdfDoc.text("---------------------------------------", 200, 200);
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              " - " +
              prod.quantity +
              " * " +
              " $ " +
              prod.product.price
          );
      });

      pdfDoc.text("--------------------------------------------------");
      pdfDoc.fontSize(18).text("Total Price: $" + totalPrice);



      pdfDoc.end();
    })
    .catch((err) => {
      return next(err);
    });
}

