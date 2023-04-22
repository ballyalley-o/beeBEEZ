const mongoose = require("mongoose");
const deleterHelper = require('../helper/deleter')
const Product = require("../models/Product");
const Member = require("../models/Member");
const { validationResult } = require("express-validator/check");


const EDIT = "admin/edit-product";
const PRODUCTS = "admin/products";
require('colors')


//method GET
//url
exports.getAddProduct = (req, res, next) => {
  res.render(EDIT, {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
  console.log("Logging in ADD-PRODUCT...".white.inverse);
};

//method POST
//url
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file
  const price = req.body.price;
  const description = req.body.description;
  console.log(image)
  if (!image) {
    return res.status(422).render(EDIT, {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: 'Document file type is not acepted.',
      validationErrors: [],
    });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render(EDIT, {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  const imageUrl = image.path;

  const product = new Product({
    title: title,
    price: price.replace(/\$/g, ""),
    description: description,
    imageUrl: imageUrl,
    memberId: req.member,
  });
  product
    .save()
    .then((result) => {

      console.log("PRODUCT CREATED".green.inverse);
      res.redirect("/admin/products");
    })
    // .catch((err) => {
      // console.log(err)
      // res.status(500).render(EDIT, {
      //   pageTitle: "Add Product",
      //   path: "admin/add-product",
      //   editing: false,
      //   hasError: true,
      //   errorMessage: "Validation failed, please try again.",
      //   product: {
      //     title: title,
      //     price: price,
      //     description: description,
      //     imageUrl: imageUrl
      //   },
      //   validationErrors: errors.array()
      // });
      .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error)
    });
};

//method GET
//url /edit-product/:productId
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(product => {
    if (!product) {
      return res.redirect('/')
    }
    res.render(EDIT, {
      pageTitle: "Edit Product",
      path: EDIT,
      editing: editMode,
      product: product,
      hasError: false,
      errorMessage: null,
      validationErrors: [],
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })
}

exports.postEditProducts = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const image = req.file;
  const updatedPrice = req.body.price.replace(/\$/g, "");
  const updatedDesc = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render(EDIT, {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
  Product.findById(prodId)
    .then((product) => {
      if (product.memberId.toString() !== req.member._id.toString()) {
        req.flash("error", "You are not authorized to edit this product");
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if (image) {
        deleterHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
      return product.save().then((result) => {
        console.log("PRODUCT UPDATED".green.inverse);
        res.redirect("/admin/products");
      });
    })

    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
    // .catch(err => {
    //   console.log(err)
    //   res.status(500).render(EDIT, {
    //     pageTitle: "Edit Product",
    //     path: "admin/edit-product",
    //     editing: false,
    //     hasError: true,
    //     errorMessage: "Validation failed, please try again.",
    //     product: {
    //       title: updatedTitle,
    //       price: updatedPrice,
    //       description: updatedDesc,
    //       imageUrl: updatedImageUrl,
    //       _id: prodId
    //     },
    //     validationErrors: errors.array(),
    //   });
    // })
}

exports.getProducts = (req, res, next) => {
  Product.find({ memberId: req.member._id })
    .then((products) => {
      res.render(PRODUCTS, {
        prods: products,
        path: "admin/products",
        pageTitle: "Admin: Products",
      });
    })
    .then((result) => {
      console.log(`Member: ${req.member.name}`.green.inverse);
      console.log("Logging in ADMIN...".white.inverse);
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product
    .findById(prodId)
    .then(product => {
      if (!prodId) {
        return next(new Error('Product not found'))
      }
        deleterHelper.deleteFile(product.imageUrl);
        return Product.deleteOne({ _id: prodId, memberId: req.member._id });
    })
    .then((result) => {
      console.log("PRODUCT DELETED".green.inverse);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};